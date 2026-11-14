# StayEasy - Hotel Booking System

A full-stack Hotel Booking System built using **Spring Boot, React, and MySQL**. Users can register, log in, browse hotel rooms, make bookings, view their booking history, and cancel bookings.

## Features

### User Features
- User registration and login
- Browse available hotel rooms
- Select check-in and check-out dates
- Book hotel rooms
- View personal booking history
- Filter bookings by status
- Cancel confirmed bookings
- Prevent overlapping bookings for the same room
- User-specific booking access

### Admin Features
- Role-based access control (USER and ADMIN)
- Add new hotel rooms
- Update room details
- Delete hotel rooms
- Only administrators can manage rooms

## Technologies Used

### Backend
- Java 25
- Spring Boot
- Spring Data JPA
- Spring Security
- MySQL
- Maven
- REST APIs

### Frontend
- React
- JavaScript
- HTML
- CSS
- Axios
- React Router
- Vite

## Project Structure

The project contains two separate applications:

**Backend:** `hotel-booking-system`
- Handles business logic, authentication, room management, and bookings.
- Connects to the MySQL database.

**Frontend:** `hotel-booking-frontend`
- Provides the user interface.
- Communicates with the backend through REST APIs.

## Setup Instructions

### Prerequisites
- Java JDK 25
- Node.js and npm
- MySQL Server 8
- Spring Tool Suite (STS) or another Java IDE
- Visual Studio Code or another code editor

### 1. Clone the repositories

Clone the backend and frontend projects into your computer.

### 2. Configure the MySQL database

Create a database named:

```sql
CREATE DATABASE hotel_booking;
```

Configure your database username and password in the backend's `application.properties` file.

Do not upload real database passwords to GitHub.

### 3. Run the Backend

1. Open the `hotel-booking-system` project in STS.
2. Configure the MySQL connection.
3. Run the Spring Boot application.
4. The backend runs at:

`http://localhost:8080`

### 4. Run the Frontend

1. Open the `hotel-booking-frontend` folder in VS Code.
2. Open the terminal.
3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the application at:

`http://localhost:5173`

## API Overview

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| GET | `/auth/me` | Get authenticated user details |
| GET | `/rooms` | View hotel rooms |
| POST | `/rooms` | Add a room (ADMIN) |
| PUT | `/rooms/{id}` | Update a room (ADMIN) |
| DELETE | `/rooms/{id}` | Delete a room (ADMIN) |
| POST | `/bookings` | Create a booking |
| GET | `/bookings` | View the authenticated user's bookings |
| GET | `/bookings/{id}` | View booking details |
| PUT | `/bookings/{id}` | Update a booking |
| DELETE | `/bookings/{id}` | Cancel a booking |
| GET | `/bookings/search` | Search bookings |

## Authentication and Authorization

- Spring Security is used for authentication and authorization.
- Passwords are stored using password encoding.
- HTTP Basic Authentication is used for authenticated API requests.
- Users can access their own bookings.
- ADMIN users have permission to manage hotel rooms.
- New registrations receive the USER role by default.

## Important Notes

- The frontend and backend must both be running to use the application.
- Configure your own database credentials before starting the backend.
- This project is intended as a learning and portfolio project. Its authentication approach should be strengthened before production deployment.

## Author

Developed as a full-stack Java learning project using Spring Boot and React.
