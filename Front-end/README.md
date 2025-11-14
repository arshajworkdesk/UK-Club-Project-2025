# UK Sports Club Frontend - Angular Application

A futuristic, animated Angular registration page with glassmorphism design and neon accents.

## Prerequisites

- **Node.js**: v20.19.5 (LTS) - **Important**: Angular 16 does not support Node 25+
- **npm**: v10.8.2 (comes with Node 20.19.5)
- **Angular CLI**: v16.2.16
- **Angular**: v16.2.12

### Setting Up Node.js Version

This project uses Node.js 20.19.5 (specified in `.nvmrc`). If you have `nvm` installed:

```bash
# Navigate to the project directory
cd UK-Club-Project-2025/Front-end

# Use the correct Node version (automatically reads .nvmrc)
nvm use

# Or manually switch to Node 20.19.5
nvm use 20.19.5
```

If you don't have `nvm`, install it first:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
```

Then restart your terminal and run `nvm install 20.19.5 && nvm use 20.19.5`.

**Note**: The Angular CLI may show a warning about Node 20.19.5 being "unsupported", but this is a false positive. Angular 16 fully supports Node.js 20.x LTS versions.

## Installation

1. Install Angular CLI globally (if not already installed):
```bash
npm install -g @angular/cli@16.2.16
```

Or install the latest Angular 16 version:
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

- **Node.js**: 20.19.5 (LTS)
- **npm**: 10.8.2
- **Angular CLI**: 16.2.16
- **Angular Core**: 16.2.12
- **TypeScript**: 5.1.3
- **RxJS**: 7.8.0
- **Zone.js**: 0.13.3

## Project Structure

```
src/
├── app/
│   ├── pages/
│   │   └── registration/
│   │       ├── registration.component.ts
│   │       ├── registration.component.html
│   │       └── registration.component.scss
│   ├── components/          # Ready for future components
│   ├── services/
│   │   └── api.service.ts   # API service placeholder
│   ├── app.module.ts
│   ├── app-routing.module.ts
│   └── app.component.*
└── styles.scss              # Global styles
```

## Features

- ✅ Fully responsive design (Mobile, Tablet, Desktop)
- ✅ Futuristic UI with glassmorphism effects
- ✅ Neon color accents (cyan, purple, pink)
- ✅ Smooth animations and transitions
- ✅ Reactive Forms with validation
- ✅ Password visibility toggle
- ✅ Real-time form validation
- ✅ Loading states and animations

## Form Validation

- **Full Name**: Required, minimum 2 characters
- **Email**: Required, valid email format
- **Password**: Required, minimum 8 characters
- **Confirm Password**: Required, must match password

## API Integration

The `ApiService` is configured to connect to a Spring Boot backend at `http://localhost:8080/api`. Update the `apiUrl` in `src/app/services/api.service.ts` when your backend is ready.

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

## Further Help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.

