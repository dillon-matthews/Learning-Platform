## Getting Started

1. Install dependencies:
   npm install

2. Start development server:
   npm run dev

## Custom Hooks

### useAuth Hook

A hook that provides easy access to authentication context throughout the application. Used to check current user status and manage authentication state.

### usePermission Hook

Built on top of useAuth, this hook handles checking user permissions and authentication status. It provides functionality to verify if users are logged in and check their role-based access.

## Context Providers

### AuthProvider

Manages authentication state across the application. Handles user data persistence through localStorage, manages login/logout states, and provides loading states during authentication checks.

### UIProvider

Handles application-wide UI state management. Controls dark mode settings and navbar visibility preferences across components.

## Extra Credit: Homepage Management

The application implements a single-instance homepage system where users are given options through a modal popup to either:

- Delete the existing homepage and create a new one
- Edit the current homepage

This ensures only one homepage exists at any time.
