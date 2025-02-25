# React Authentication Dashboard

This project implements a user authentication system in a React application. After a successful login, the user's email and profile picture are stored in `localStorage` and displayed on the dashboard. The dashboard also includes navigation links and a logout button.

## 📌 Features

- ✅ Store user authentication details (`email`, `token`, `photo`) in `localStorage`
- ✅ Display user details (email, name & profile picture) on the dashboard
- ✅ Navigate between different pages using React Router

---

## 2️⃣ Install Dependencies

- npm install

3️⃣ Setup Environment Variables
Create a .env file in the root directory and add the following:

VITE_GOOGLE_CLIENT_ID= your-Client-ID

- Environment Variable Explanation:

VITE_GOOGLE_CLIENT_ID - Your Google OAuth Client ID (from Google Developer Console).
Replace your-google-client-id with the actual Google OAuth Client ID.

## 4️⃣ Start the Development Server

npm start

Visit your localhot link

Click the Login with Google button
After authentication, you'll see your name, email, and profile picture

### 1️⃣ Clone the Repository

```sh
git clone https://github.com/your-username/react-auth-dashboard.git
```
