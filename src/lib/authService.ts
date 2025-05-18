import { User, LoginCredentials, SignupCredentials } from "../types/auth";

// Mock user data for demonstration
let currentUser: User | null = null;

/**
 * Authentication service for handling user login, signup, and session management
 */
export const authService = {
  /**
   * Login a user with email and password
   */
  login: async ({ email, password }: LoginCredentials): Promise<User> => {
    // This is a mock implementation
    // In a real app, you would call your authentication API

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (email && password) {
          const user: User = {
            id: "user-123",
            email,
            name: "Art Enthusiast",
            createdAt: new Date().toISOString(),
          };

          // Store the user in the mock session
          currentUser = user;

          // Return the user
          resolve(user);
        } else {
          reject(new Error("Invalid credentials"));
        }
      }, 800); // Simulate network delay
    });
  },

  /**
   * Register a new user
   */
  signup: async ({
    name,
    email,
    password,
  }: SignupCredentials): Promise<User> => {
    // This is a mock implementation
    // In a real app, you would call your authentication API

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock validation
        if (name && email && password) {
          const user: User = {
            id: `user-${Date.now()}`,
            email,
            name,
            createdAt: new Date().toISOString(),
          };

          // Store the user in the mock session
          currentUser = user;

          // Return the user
          resolve(user);
        } else {
          reject(new Error("Invalid signup data"));
        }
      }, 800); // Simulate network delay
    });
  },

  /**
   * Logout the current user
   */
  logout: async (): Promise<void> => {
    // This is a mock implementation
    // In a real app, you would call your authentication API

    return new Promise((resolve) => {
      setTimeout(() => {
        // Clear the user from the mock session
        currentUser = null;
        resolve();
      }, 300);
    });
  },

  /**
   * Get the current user
   */
  getCurrentUser: (): User | null => {
    return currentUser;
  },

  /**
   * Check if a user is authenticated
   */
  isAuthenticated: (): boolean => {
    return currentUser !== null;
  },
};
