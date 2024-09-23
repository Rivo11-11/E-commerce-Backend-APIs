# E-Commerce Application REST API

## Overview

This project is a REST API for a full-featured e-commerce application built using Express.js and MongoDB. The API follows the MVC (Model-View-Controller) architecture and provides key e-commerce functionalities such as user authentication, role-based authorization, product management, and a robust validation layer.

## Key Features

1. **MVC Structure:**
   - Organized using the MVC pattern: separating routes, controllers, and models for maintainability and scalability.

2. **Authentication & Login System:**
   - **Sign Up, Login:** Allows users to register and authenticate using secure practices.
   - **Forgot/Reset Password:** A reset password functionality using **Nodemailer** to send a verification code to the user’s email.

3. **Authorization Layer:**
   - Role-based access control with protected routes for different roles in the system:
     - **Customer:** Basic access to shop and manage orders.
     - **Manager:** Manage inventory and customer orders.
     - **Developer:** Full access to the system for development and maintenance.

4. **Validation Layer:**
   - Efficient data validation to ensure input integrity before accessing the MongoDB database. It handles validation for forms, product data, and user inputs.

5. **Image Handling:**
   - The API can handle image uploads, associating them with products or users. Images are served through the API.

6. **E-Commerce Services:**
   - **Favorites List:** Users can add products to a personal favorites list.
   - **Shopping Cart:** A fully functioning cart system where users can add, remove, and checkout products.
   - **Discounts:** Ability to apply discount codes and view updated pricing.

7. **MongoDB (NoSQL Database):**
   - All data is stored in MongoDB, with collections created for each entity (Users, Products, Orders, etc.).

8. **Route Validation (Postman):**
   - All API routes are tested and validated using **Postman** to ensure proper functionality and adherence to specifications.

## Tech Stack

- **Backend:** Node.js with Express.js framework
- **Database:** MongoDB (NoSQL)
- **Email Service:** Nodemailer for sending email verifications
- **Testing:** Postman for route and API testing
- **Authentication:** JWT (JSON Web Token) for secure authentication
- **File Uploads:** Multer for handling image uploads

