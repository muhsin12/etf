// Auth Service for handling all authentication-related API calls

export interface LoginCredentials {
  email: string;
  password: string;
}

/**
 * Login to admin panel
 */
export const login = async (credentials: LoginCredentials): Promise<{ success: boolean }> => {
  try {
    const response = await fetch('/api/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Login failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error in login:', error);
    throw error;
  }
};

/**
 * Logout from admin panel
 */
export const logout = async (): Promise<{ success: boolean }> => {
  try {
    const response = await fetch('/api/admin/logout', {
      method: 'POST',
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Logout failed');
    }
    
    return data;
  } catch (error) {
    console.error('Error in logout:', error);
    throw error;
  }
};