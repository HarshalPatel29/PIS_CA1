console.log("Working");

function copyText(txt) {
    navigator.clipboard.writeText(txt).then(
        () => {
            /* clipboard successfully set */
            document.getElementById("alert").style.display = "inline"
            setTimeout(() => {
                document.getElementById("alert").style.display = "none"
            }, 2000);
        },
        () => {
            /* clipboard write failed */
            alert("Clipboard copying failed")
        },
    );
}

function maskPassword(pass) {
    return "*".repeat(pass.length)
}

const deletePassword = (website) => {
    let data = localStorage.getItem("passwords")
    let arr = JSON.parse(data);
    arrUpdated = arr.filter((e) => {
        return e.website != website
    })
    localStorage.setItem("passwords", JSON.stringify(arrUpdated))
    alert(`Successfully deleted ${website}'s password`)
    showPasswords()

}

const editPassword = (website, username, password, comment) => {

    document.getElementById("website").value = website;
    document.getElementById("username").value = username;
    document.getElementById("password").value = password;
    document.getElementById("comment").value = comment;
};


// Logic to fill the table
const showPasswords = () => {
    let tb = document.querySelector("table")
    let data = localStorage.getItem("passwords")
    if (data == null || JSON.parse(data).length == 0) {
        tb.innerHTML = "No Data To Show"
    }
    else {
        tb.innerHTML = `<tr>
        <th>Website</th>
        <th>Username</th>
        <th>Password</th>
        <th>Comment</th>
        <th>Delete</th>
        <th>Edit</th>
    </tr> `
        let arr = JSON.parse(data);
        let str = ""
        for (let index = 0; index < arr.length; index++) {
            const element = arr[index];

            str += `<tr>
    <td>${element.website} <img onclick="copyText('${element.website}')" src="./copy.svg" alt="Copy Button" width="10" width="10" height="10">
    </td>
    <td>${element.username} <img onclick="copyText('${element.username}')" src="./copy.svg" alt="Copy Button" width="10" width="10" height="10">
    </td>
    <td>${maskPassword(element.password)} <img onclick="copyText('${element.password}')" src="./copy.svg" alt="Copy Button" width="10" width="10" height="10">
    </td>
    <td>${element.comment}</td>
    <td><button class="btnsm" onclick="deletePassword('${element.website}')">Delete</button></td>
    <td><button class="btnsm" onclick="editPassword('${element.website}', '${element.username}', '${element.password}', '${element.comment}')">Edit</button></td>
    </tr>`
        }
        tb.innerHTML = tb.innerHTML + str

    }
    website.value = ""
    username.value = ""
    password.value = ""
    comment.value = ""
}
showPasswords()

// Submit event listener
document.querySelector(".btn").addEventListener("click", async (e) => {
    e.preventDefault()

    const website = document.getElementById("website").value;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const comment = document.getElementById("comment").value;

    // Validate inputs
    if (!website || !username || !password) {
        alert("Please fill in the website, username and password")
        return;
    }

    try {
        let req = await fetch("/passwords", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ website, username, password, comment })
        });

        // Check if the response is OK
        if (!req.ok) {
            const errorText = await req.text();
            console.error("Save error response:", errorText);
            throw new Error(`HTTP error! status: ${req.status}`);
        }

        let res = await req.json();
        console.log("Save response:", res);

        if (res.success) {
            alert("Password Saved");
            showPasswords();

            // Clear form fields
            document.getElementById("website").value = "";
            document.getElementById("username").value = "";
            document.getElementById("password").value = "";
            document.getElementById("comment").value = "";
        } else {
            alert("Failed to save password: " + res.error);
        }
    } catch (error) {
        console.error("Save password error:", error)
        alert("Failed to save password: " + error.message)
    }
});