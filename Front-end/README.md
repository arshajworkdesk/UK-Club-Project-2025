# UK Sports Club Frontend - Angular Application

A modern Angular application for UK Sports Club with membership registration, member management, and admin dashboard features.

## Prerequisites

- **Node.js**: v18 (LTS) - Required for Angular 16 compatibility
- **npm**: v9+ (comes with Node 18)
- **Angular CLI**: v16.2.0+
- **Angular**: v16.2.0+

### Setting Up Node.js Version

This project uses Node.js 18 (specified in `.nvmrc`). If you have `nvm` installed:

```bash
# Navigate to the project directory
cd UK-Club-Project-2025/Front-end

# Use the correct Node version (automatically reads .nvmrc)
nvm use

# Or manually switch to Node 18
nvm use 18
```

If you don't have `nvm`, install it first:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Then restart your terminal and run `nvm install 18 && nvm use 18`.

**Note**: Angular 16 requires Node.js 18 LTS for full compatibility. Node.js 20.19.5 may show compatibility warnings.

## Installation

1. Install Angular CLI globally (if not already installed):
```bash
npm install -g @angular/cli@16
```

2. Navigate to the project directory:
```bash
cd UK-Club-Project-2025/Front-end
```

3. Ensure you're using the correct Node version:
```bash
nvm use  # If using nvm
```

4. Install dependencies:
```bash
npm install
```

## Development Server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

```bash
ng serve
```

Or use the shorthand:
```bash
ng serve -o
```

The `-o` flag automatically opens your default browser.

## Current Versions

This project is configured with the following versions:

- **Node.js**: 18 (LTS)
- **npm**: 9+
- **Angular CLI**: 16.2.0
- **Angular Core**: 16.2.0
- **TypeScript**: 5.1.3
- **RxJS**: 7.8.0
- **Zone.js**: 0.13.3

## Project Structure

```
src/
├── app/
│   ├── pages/
│   │   ├── home/                    # Home page
│   │   ├── registration/            # Membership registration
│   │   ├── members/                 # Members listing
│   │   ├── contact/                 # Contact form
│   │   ├── admin-login/            # Admin authentication
│   │   └── admin-dashboard/         # Admin management panel
│   ├── components/
│   │   ├── navigation/              # Navigation bar
│   │   ├── toast/                   # Toast notification component
│   │   └── confirmation-dialog/     # Confirmation dialog component
│   ├── services/
│   │   ├── api.service.ts           # API service for backend
│   │   ├── auth.service.ts          # Authentication service
│   │   ├── toast.service.ts         # Toast notification service
│   │   └── confirmation-dialog.service.ts  # Dialog service
│   ├── constants/
│   │   ├── app.constants.ts         # Application constants
│   │   └── app.messages.ts          # Centralized messages
│   ├── guards/
│   │   └── admin.guard.ts           # Route guard for admin
│   ├── animations/                  # Reusable animations
│   ├── app.module.ts
│   ├── app-routing.module.ts
│   └── app.component.*
├── assets/
│   └── images/                      # Static images
└── styles.scss                      # Global styles
```

## Features

### User Features
- ✅ Fully responsive design (Mobile, Tablet, Desktop)
- ✅ Modern UI with glassmorphism effects
- ✅ Smooth animations and transitions
- ✅ Membership registration with profile picture upload
- ✅ Member directory with search functionality
- ✅ Contact form with validation
- ✅ Toast notifications for user feedback

### Admin Features
- ✅ Admin login and authentication
- ✅ Admin dashboard for member management
- ✅ Approve/Reject membership requests
- ✅ Assign admin roles
- ✅ Confirmation dialogs for critical actions
- ✅ Toast notifications for action feedback

### Technical Features
- ✅ Reactive Forms with comprehensive validation
- ✅ Centralized constants and messages
- ✅ Profile picture upload (JPG/PNG, max 2MB)
- ✅ Password visibility toggle
- ✅ Real-time form validation
- ✅ Loading states and animations
- ✅ Route guards for protected pages
- ✅ Image preview functionality

## Pages & Routes

- **`/`** - Home page with club information
- **`/membership`** - Membership registration form
- **`/members`** - Public members directory
- **`/contact`** - Contact form
- **`/admin/login`** - Admin login page
- **`/admin/dashboard`** - Admin dashboard (protected)

## Form Validation

### Registration Form
- **Full Name**: Required, minimum 2 characters
- **Email**: Required, valid email format
- **Password**: Required, minimum 8 characters
- **Confirm Password**: Required, must match password
- **Date of Birth**: Required, valid date
- **Gender**: Required selection
- **Profile Picture**: Optional, JPG/PNG only, max 2MB

### Contact Form
- **Name**: Required, minimum 2 characters
- **Email**: Required, valid email format
- **Subject**: Required, minimum 3 characters
- **Message**: Required, minimum 10 characters

## Centralized Configuration

### Constants (`app.constants.ts`)
- Brand name and app title
- Club contact information
- File upload constraints
- API base URL
- Image asset paths

### Messages (`app.messages.ts`)
- Success messages
- Error messages
- Validation messages
- Form labels
- UI text
- Confirmation messages
- Button labels

All user-facing strings are centralized for easy maintenance and future localization.

## API Integration

The `ApiService` is configured to connect to a Spring Boot backend at `http://localhost:8080/api`. Update the `apiUrl` in `src/app/constants/app.constants.ts` when your backend is ready.

### API Endpoints (Placeholder)
- `POST /api/membership/register` - Register new membership
- `GET /api/members/approved` - Get approved members
- `GET /api/members/pending` - Get pending members
- `POST /api/admin/approve-member/:id` - Approve member
- `POST /api/admin/reject-member/:id` - Reject member
- `POST /api/admin/assign-admin/:id` - Assign admin role
- `POST /api/auth/login` - Admin login
- `POST /api/contact` - Submit contact form

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

```bash
ng build
```

For production build:
```bash
ng build --configuration production
```

## Testing

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

```bash
ng test
```

## Code Organization

### Services
- **ApiService**: Handles all HTTP requests to backend
- **AuthService**: Manages authentication state
- **ToastService**: Manages toast notifications
- **ConfirmationDialogService**: Manages confirmation dialogs

### Components
- **NavigationComponent**: Responsive navigation bar
- **ToastComponent**: Toast notification display
- **ConfirmationDialogComponent**: Reusable confirmation dialogs

### Constants
- **app.constants.ts**: Application-wide constants (brand name, API URLs, file limits)
- **app.messages.ts**: All user-facing messages and labels

## Styling

- **Global Styles**: `src/styles.scss` - Theme variables and global styles
- **Component Styles**: Each component has its own SCSS file
- **Theme Variables**: CSS custom properties for colors, shadows, animations
- **Responsive Design**: Mobile-first approach with breakpoints

## Further Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
