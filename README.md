Application of Web Programming in Infrastructure Systems
Project Assignment for 2024

1. Task Description
Develop a taxi application.
The system has three types of users:

Administrator
User
Driver
2. System Functions
2.1. Display Information for Unregistered Users
The first page that an unregistered user sees is the application's homepage. It allows them to log in (if already registered) or navigate to the registration/login page.

2.2. User Registration and Login
The registration/login page enables users to log in using their email and password.
If not yet registered, a user must complete registration to use the app's features. Registration can be done in two ways:

Traditional Registration - By entering personal details including:

Email
Password (entered twice for error prevention)
First Name
Last Name
Date of Birth
Address
The administrator must approve the registration before activation.

Social Media Registration - Users can register via a social media account. (Implement at least one social media option).

During registration, the following must be defined:

Username
Email
Password
Full Name
Date of Birth
Address
User Type (Administrator, User, Driver)
Profile Picture (Enable image upload, storing the image on the server, and downloading it for display).
Note: Authentication and authorization mechanisms must be implemented server-side.

2.3. User Profile
Registered users can update their personal information on their profile page.

2.4. Registration Verification
Administrators can review registration data and either approve or reject requests. Verification is required only for drivers. Ordinary users do not need verification.

Users can view their verification status on their profile (e.g., “Processing,” “Approved,” or “Rejected”). An email notification must be sent upon verification.

2.5. Dashboard
After a successful login, the user is redirected to the Dashboard page, which contains the following elements:

Profile (all users)
New Ride (User)
Previous Rides (User)
Verification (Admin)
New Rides (Driver)
My Rides (Driver)
All Rides (Admin)
2.5.1. Profile
Displays and allows modification of user profiles.

2.5.2. New Ride
Users can create a new ride by entering the start and end addresses. Upon submitting the order, the system predicts the cost and estimated arrival time (these can be randomized). If the user confirms, the ride becomes available for drivers to accept.

Once a ride is created and accepted:

Users and drivers see:

A countdown to the driver’s arrival (real-time countdown required).
A countdown to the ride’s completion.
After the ride ends:

The user can rate the driver (1–5 stars).
Only the admin can see driver ratings to block/unblock drivers.
Blocked Drivers: Can log in but cannot accept rides.

2.5.3. Verification
Admins can view drivers’ verification requests and statuses, approving or rejecting them as needed.

2.5.4. Previous Rides
Users can view a list of their previous rides.

2.5.5. New Rides
Drivers can see a list of rides awaiting acceptance.

2.5.6. My Rides
Drivers can view their completed rides.

2.5.7. All Rides
Admins have access to all rides and their statuses.

3. System Implementation
3.1. Server Platforms
.NET CORE, Microsoft Service Fabric
3.2. Client Platforms
Single-page interface application in React
3.3. Email Notifications
Email notifications must be implemented using a personal email account.

3.4. Concurrent Access to Resources
Concurrency issues must be addressed to prevent multiple users from accessing the same resource simultaneously. For example, test whether deletion/modification of a non-existent entity is possible and handle exceptions both client- and server-side.

3.5. Solution Architecture and Evaluation Criteria
The project must adhere to good practices for web applications:

Frontend should be component-based.
URLs for external services must be stored in .env files.
HTTP requests should be handled in injectable services, not directly in components.
Frontend models must exist.
Backend must follow a microservices architecture.
Database and DTO models should be separate, with proper mapping.
REST conventions must be followed for resource naming.
Passwords must be hashed in the database.
Tokens must be validated for signature and expiration.
Configurable server data (e.g., external service credentials) must be stored in appsettings.json.
Git Version Control: The project repository must be on GitHub and accessible for review.
