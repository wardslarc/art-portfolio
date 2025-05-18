/**
 * User interface representing an authenticated user
 */
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  avatarUrl?: string;
}

/**
 * Login credentials for authentication
 */
export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Signup credentials for registration
 */
export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

/**
 * Authentication state interface
 */
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
