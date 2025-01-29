# DoctorAppointmenSystem

https://drive.google.com/file/d/15l3lPYPVBG_0qSxrXQWrlGoHCxkv_MxI/view?usp=sharing

The Doctor Appointment System is a web application that allows patients to search for doctors, book appointments, and leave reviews. The project is built using JavaScript, Node.js, Express.js, React.js, Firebase, Redis, and Azure Queue Storage.

The system provides Google Authentication for user login and a structured appointment management system for doctors. Firebase Firestore is used as a NoSQL database, while Azure Queue Storage handles asynchronous appointment processing. Redis is implemented for caching frequently accessed data. Additionally, email notifications and role-based access control enhance security.

## 🛠 Tech Stack
### Frontend
React.js - User Interface
React Router - Page Navigation
Leaflet.js - Map Visualization
Styled Components & Bootstrap - Styling and UI Design
### Backend
Node.js & Express.js - RESTful API
Firebase Firestore - NoSQL database (for doctors, users, and appointments)
Redis - Data caching and performance optimization
Azure Queue Storage - Asynchronous message queue (for appointment handling)
Nodemailer - Email notifications
Docker - Deployment

## 📌 Modules
### 1️⃣ Authentication Module 🔑
Google Authentication for user login
User authentication and authorization

### 2️⃣ Doctor Management Module 🏥
Doctor registration and profile management
Scheduling and availability settings

### 3️⃣ Appointment Management Module 📅
Search for doctors, book, and manage appointments
Real-time scheduling for efficient booking

### 4️⃣ Review and Rating Module ⭐
Patients can rate and review doctors
Reviews are stored in Firebase Firestore

### 5️⃣ Notification Module 📩
Azure Queue Storage for appointment reminders
Nodemailer for email notifications


## 🔗 Firebase Configuration
Before running the API server, add the serviceAccountKey.json file inside the backend folder.
This file is required for Firebase services to function properly.

## 🐳 Running with Docker
To start the application using Docker, run the following command:
docker-compose up --build
This will set up both the frontend and backend in a Docker environment.

![image](https://github.com/user-attachments/assets/199459c2-d28d-41ab-afb8-73e2b30902bf)

## 🚀 API Gateway
The project uses an API Gateway to route all API requests and improve security.
API Gateway URL:
🔗 https://api-gateway.azure.com/doctor-appointments
Example API Requests:
Get Doctor List:
GET /api/doctors
Book an Appointment:
POST /api/appointments
Fetch Doctor Reviews:
GET /api/reviews/:doctorId

## 🛑 Redis Integration
The system implements Redis to improve performance by caching frequently accessed data.

## 📨 Azure Queue Storage Integration
Azure Queue Storage is used to handle asynchronous processing of appointment requests.

## 📧 Email Notifications
Email notifications are sent using Nodemailer whenever an appointment is booked or a doctor is reviewed.

## 🎯 Features
✅ Users can search for doctors, filter results, and book appointments.

✅ Doctors can manage their availability and schedules.

✅ Users can leave reviews and rate doctors.

✅ Redis Caching ensures fast data retrieval.

✅ Azure Queue Storage handles appointment processing asynchronously.

✅ Nodemailer sends email notifications for bookings and reviews.

✅ Google Authentication secures user access.





