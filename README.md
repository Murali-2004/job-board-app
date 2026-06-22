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

\* MONGO\_URI

\* ACCESS\_TOKEN\_SECRET

\* REFRESH\_TOKEN\_SECRET

\* EMAIL\_USER

\* EMAIL\_PASS

\* CLOUDINARY\_CLOUD\_NAME

\* CLOUDINARY\_API\_KEY

\* CLOUDINARY\_API\_SECRET



\### Run Server



```bash

npm run dev

```



\## Author



Murali M



