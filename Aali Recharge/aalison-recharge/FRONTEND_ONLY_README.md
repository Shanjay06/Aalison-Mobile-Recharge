# Aalison Recharge - Frontend Only Version

## Overview
This is a frontend-only version of the Aalison Recharge application with all backend dependencies removed. The application now uses localStorage for data persistence and includes improved authentication with admin functionality.

## Key Changes Made

### 1. Removed Backend Dependencies
- Deleted all backend directories and files
- Removed API calls to external servers
- Replaced with localStorage-based data management

### 2. New Authentication System
- **AuthService**: Local authentication using localStorage
- **Admin Login**: Default admin account (admin@aalison.com / admin123)
- **User Management**: Admin can view and delete users
- **Session Management**: Persistent login sessions

### 3. Improved UI/UX
- Removed all emojis for a more professional look
- Clean, modern interface design
- Better form validation and error handling
- Responsive design improvements

### 4. New Components
- `AuthPage.jsx`: Unified login/signup with admin options
- `AdminDashboard.jsx`: Admin panel for user management
- `ImprovedLoginPage.jsx`: Enhanced login experience
- `authService.js`: Local authentication service
- `api.js`: Updated to use localStorage instead of API calls

## Features

### User Features
- User registration and login
- Profile management
- Recharge history (stored locally)
- Plan selection
- Responsive design

### Admin Features
- Admin login with separate credentials
- User management dashboard
- View all registered users
- Delete user accounts
- User statistics

## Default Accounts

### Admin Account
- Email: admin@aalison.com
- Password: admin123
- Role: Administrator

### Test User Account
You can create new user accounts through the signup process.

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Access the application at `http://localhost:5173`

## Routes

- `/` - Home page
- `/auth` - Login/Signup page
- `/login` - Alternative login page
- `/admin` - Admin dashboard (admin only)
- `/profile` - User profile page
- `/plans` - Recharge plans
- `/history` - Recharge history
- `/payment` - Payment page

## Data Storage

All data is stored in localStorage:
- `users`: Array of registered users
- `currentUser`: Currently logged-in user
- `rechargePlans`: Available recharge plans
- `rechargeHistory`: User recharge history

## Security Notes

- This is a frontend-only demo application
- Passwords are stored in plain text in localStorage
- Not suitable for production use without proper backend security
- Admin credentials are hardcoded for demo purposes

## Future Enhancements

- Add proper password hashing
- Implement JWT tokens
- Add data export/import functionality
- Enhanced admin features
- Better error handling
- Form validation improvements