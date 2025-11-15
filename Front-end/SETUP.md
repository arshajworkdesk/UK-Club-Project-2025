# Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- Node.js (v18 LTS) installed: `node --version`
- npm (v9+) installed: `npm --version`

If not installed, download from [nodejs.org](https://nodejs.org/)

### Using NVM (Recommended)

This project uses Node.js 18 (specified in `.nvmrc`). If you have `nvm`:

```bash
# Navigate to project directory
cd UK-Club-Project-2025/Front-end

# Use the correct Node version (automatically reads .nvmrc)
nvm use
```

If you don't have `nvm`, install it:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Then restart terminal and run: `nvm install 18 && nvm use 18`

## Installation Steps

### 1. Install Angular CLI (if not already installed)
```bash
npm install -g @angular/cli@16
```

### 2. Navigate to Front-end directory
```bash
cd "UK-Club-Project-2025/Front-end"
```

### 3. Install project dependencies
```bash
npm install
```

### 4. Run the development server
```bash
ng serve
```

Or to automatically open in browser:
```bash
ng serve -o
```

The application will be available at: **http://localhost:4200**

## Project Structure

```
Front-end/
├── src/
│   ├── app/
│   │   ├── pages/
│   │   │   ├── home/                    # Home page
│   │   │   ├── registration/            # Membership registration
│   │   │   ├── members/                 # Members listing
│   │   │   ├── contact/                  # Contact form
│   │   │   ├── admin-login/             # Admin authentication
│   │   │   └── admin-dashboard/          # Admin management panel
│   │   ├── components/
│   │   │   ├── navigation/              # Navigation bar
│   │   │   ├── toast/                   # Toast notifications
│   │   │   └── confirmation-dialog/     # Confirmation dialogs
│   │   ├── services/
│   │   │   ├── api.service.ts           # API service
│   │   │   ├── auth.service.ts          # Authentication
│   │   │   ├── toast.service.ts         # Toast notifications
│   │   │   └── confirmation-dialog.service.ts
│   │   ├── constants/
│   │   │   ├── app.constants.ts         # Application constants
│   │   │   └── app.messages.ts          # Centralized messages
│   │   ├── guards/
│   │   │   └── admin.guard.ts           # Route guards
│   │   ├── animations/                  # Reusable animations
│   │   ├── app.module.ts
│   │   └── app-routing.module.ts
│   ├── assets/
│   │   └── images/                      # Static images
│   └── styles.scss                      # Global styles
├── package.json                          # Dependencies
└── angular.json                          # Angular configuration
```

## Features Implemented

✅ **Responsive Design**
- Mobile-first approach
- Breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)
- Optimized for all screen sizes

✅ **Modern UI**
- Glassmorphism effects
- Dark theme with neon accents
- Smooth animations and transitions
- Pop-up animations for dialogs

✅ **User Features**
- Membership registration with profile picture upload
- Member directory with search functionality
- Contact form with validation
- Toast notifications for feedback

✅ **Admin Features**
- Admin login and authentication
- Admin dashboard for member management
- Approve/Reject membership requests
- Assign admin roles
- Confirmation dialogs for critical actions

✅ **Form Features**
- Reactive Forms with comprehensive validation
- Real-time error messages
- Password visibility toggle
- Profile picture upload (JPG/PNG, max 2MB)
- Image preview functionality
- Loading states and animations

✅ **Technical Features**
- Centralized constants and messages
- Toast notification system
- Confirmation dialog system
- Route guards for protected pages
- Centralized API service

## Testing the Application

### Registration Form (`/membership`)
1. Navigate to http://localhost:4200/membership
2. Try submitting empty form to see validation
3. Test email validation
4. Test password matching
5. Upload a profile picture (JPG/PNG, max 2MB)
6. Toggle password visibility
7. Submit form to see loading animation and toast notification

### Members Page (`/members`)
1. Navigate to http://localhost:4200/members
2. View member directory
3. Test search functionality
4. See profile pictures or initials

### Contact Form (`/contact`)
1. Navigate to http://localhost:4200/contact
2. Fill out and submit contact form
3. See success/error toast notifications

### Admin Dashboard (`/admin/dashboard`)
1. Navigate to http://localhost:4200/admin/login
2. Login as admin (currently in testing mode)
3. View pending/approved members
4. Test approve/reject actions with confirmation dialogs
5. See toast notifications for actions

## Configuration

### API Configuration
Update the API base URL in `src/app/constants/app.constants.ts`:
```typescript
API: {
  BASE_URL: 'http://localhost:8080/api'
}
```

### Branding & Messages
- **Constants**: Edit `src/app/constants/app.constants.ts` for brand name, contact info, file limits
- **Messages**: Edit `src/app/constants/app.messages.ts` for all user-facing text

### Background Image
Update the background image path in `src/styles.scss`:
```scss
$bg-image-path: './assets/images/membershipPage.jpg';
```

## Next Steps

1. **Backend Integration**: Connect to Spring Boot backend at `http://localhost:8080/api`
2. **Environment Variables**: Set up environment files for different configurations
3. **Customize Theme**: Modify color variables in `src/styles.scss`
4. **Add Features**: Extend functionality as needed

## Troubleshooting

**Port 4200 already in use?**
```bash
ng serve --port 4201
```

**Dependencies not installing?**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Angular CLI not found?**
Make sure Angular CLI is installed globally:
```bash
npm install -g @angular/cli@16
```

