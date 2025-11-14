# Quick Setup Guide

## Prerequisites Check

Before starting, ensure you have:
- Node.js (v18+) installed: `node --version`
- npm (v9+) installed: `npm --version`

If not installed, download from [nodejs.org](https://nodejs.org/)

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
│   │   │   └── registration/     # Registration page component
│   │   ├── components/           # Future components directory
│   │   ├── services/
│   │   │   └── api.service.ts    # API service for backend integration
│   │   └── app.module.ts         # Main app module
│   └── styles.scss               # Global styles with futuristic theme
├── package.json                  # Dependencies
└── angular.json                  # Angular configuration
```

## Features Implemented

✅ **Responsive Design**
- Mobile-first approach
- Breakpoints: Mobile (<768px), Tablet (768-1024px), Desktop (>1024px)

✅ **Futuristic UI**
- Glassmorphism effects
- Neon color accents (cyan, purple, pink)
- Smooth animations and transitions

✅ **Form Features**
- Reactive Forms with validation
- Real-time error messages
- Password visibility toggle
- Loading states

✅ **Animations**
- Page load animations
- Input focus effects
- Form field stagger animations
- Button loading spinner

## Testing the Registration Form

1. Navigate to http://localhost:4200 (automatically redirects to /register)
2. Try submitting empty form to see validation
3. Test email validation
4. Test password matching
5. Toggle password visibility
6. Submit form to see loading animation

## Next Steps

1. **Backend Integration**: Update `apiUrl` in `src/app/services/api.service.ts` when Spring Boot backend is ready
2. **Add More Pages**: Create additional components in `src/app/pages/`
3. **Customize Theme**: Modify color variables in `src/styles.scss`

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

