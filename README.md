\# MERN Job Board Application

A full-stack Job Board platform built using MongoDB, Express.js, React.js, and Node.js.

\## Features

\### Authentication \& Authorization

\* User Registration

\* User Login

\* JWT Access Token Authentication

\* Refresh Token Authentication

\* Role-Based Authorization (Job Seeker / Recruiter / Admin)

\* Secure Logout

\### Password Management

\* Forgot Password via Email OTP

\* OTP Verification

\* Password Reset

\* Token Invalidation after Password Reset

\### Job Management

\* Create Job Posting

\* View All Jobs

\* Search and Filter Jobs

\* Save Jobs

\* Remove Saved Jobs

\### Application Management

\* Apply for Jobs

\* View Applied Jobs

\* View Applicants

\* Update Application Status

\* Resume Upload Support

\### Recruiter Dashboard

\* Total Jobs Posted

\* Total Applications Received

\* Application Status Analytics

&#x20; \* Applied

&#x20; \* Under Review

&#x20; \* Accepted

&#x20; \* Rejected

\## Tech Stack

\### Backend

\* Node.js

\* Express.js

\* MongoDB

\* Mongoose

\### Authentication

\* JWT

\* bcryptjs

\### File Upload

\* Multer

\* Cloudinary

\### Email Service

\* Nodemailer

\## API Features

\* Pagination

\* Search

\* Filtering

\* Protected Routes

\* Role-Based Access Control

\## Installation

\### Clone Repository

```bash

git clone <repository-url>

```

\### Install Dependencies

```bash

cd backend

npm install

```

\### Configure Environment Variables

Create a `.env` file inside the backend folder.

Required variables:

\* PORT

\* MONGO_URI

\* ACCESS_TOKEN_SECRET

\* REFRESH_TOKEN_SECRET

\* EMAIL_USER

\* EMAIL_PASS

\* CLOUDINARY_CLOUD_NAME

\* CLOUDINARY_API_KEY

\* CLOUDINARY_API_SECRET

\### Run Server

```bash

npm run dev

```

\## Author

Murali M

Features

Authentication

- Register/Login
- JWT Authentication
- Refresh Tokens
- Forgot Password with OTP

Job Seeker

- View Jobs
- Search Jobs
- Save Jobs
- Apply Jobs
- View Applications

Recruiter

- Create Jobs
- Manage Jobs
- Dashboard Statistics
- Update Application Status
- Email Notifications

Admin

- View Users
- Search Users
- Block/Unblock Users
- Delete Users
- View Jobs
- Search Jobs
- Delete Jobs
- Dashboard Analytics
