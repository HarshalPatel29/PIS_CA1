![image](https://github.com/user-attachments/assets/ffdfddb6-3ea7-4c99-85e5-3929b2ba1b17)
  
# PasX - Personal Password Manager
## Project Overview
PasX is a secure web-based password management application that allows users to store, edit, and delete passwords for different websites. The application uses a modern web stack with user-friendly design.

## Tools and Technologies used
### Frontend: 
- HTML: Provides the basic structure of the application.
- CSS
- JavaScript : Handles client-side interactions
  - **Functions for :**
   - Copying text to clipboard
   - Masking passwords
   - Deleting passwords
   - Editing passwords
   - Submitting new passwords
   - Fetching and displaying passwords
     
### Backend: 
- Node.js: npm init -y
- Express.js: npm i express
- dotenv:  npm install dotenv --save

#### Server Configuration
- Express.js server.
- Connects to MongoDB.
- Provides RESTful API endpoints.

#### API Endpoints
- GET /passwords: Retrieve all stored passwords.
- POST /passwords: Add or update a password.
- DELETE /passwords: Remove a password.
  
### Database: 
- MongoDB: npm install mongodb
- Database Name: passpax
  - Collection: passwords
  - Stores password entries with fields:( website, username, password, comment )
### Testing: 
- Jest: npm install --save-dev jest 
- Supertest: npm install --save-dev jest supertest

## To Start the Server
npm build
## To Run the Test (Jest)
npm test

## References
1. Font used from : https://fonts.google.com/specimen/Poppins
2. ExpressJS : https://expressjs.com/en/starter/installing.html
3. dotenv : https://www.npmjs.com/package/dotenv
4. MongoDB : https://www.npmjs.com/package/mongodb
5. NodeJS : https://nodejs.org/docs/latest/api/
6. Jest : https://jestjs.io/docs/getting-started

## Some Images
![Screenshot 2024-12-10 180339](https://github.com/user-attachments/assets/4ebc075a-a185-4507-88fe-b6930adf7257)
![Screenshot 2024-12-10 180633](https://github.com/user-attachments/assets/607cb4f5-ba33-4a49-ac0b-52db771e97d4)

### Unit Testing
![Screenshot 2024-12-10 162615](https://github.com/user-attachments/assets/a6025b53-6bcd-4c9f-876b-7c0f84a41723)

## This is a password management application that allows users to:
- Save new passwords
- View existing passwords
- Edit existing passwords
- Delete passwords
- Copy website, username, and password to clipboard

## Future Improvements
- Implement encryption for stored passwords
- Add user authentication
- Implement password strength checker
- Create a more robust error handling mechanism



