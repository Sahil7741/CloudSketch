const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export const authAPI = {
  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }
    
    return response.json();
  },

  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Signup failed');
    }
    
    return response.json();
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('jwtToken');
    
    const response = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get user info');
    }
    
    return response.json();
  },

  guestLogin: async () => {
    const guestId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const guestUsername = `Guest-${guestId}`;
    
    const fakeToken = btoa(JSON.stringify({
      username: guestUsername,
      isGuest: true,
      exp: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
    }));
    
    return {
      token: `guest.${fakeToken}`,
      username: guestUsername,
      type: 'Bearer'
    };
  }
};

export const authUtils = {

  saveToken: (token) => {
    localStorage.setItem('jwtToken', token);
  },

  getToken: () => {
    return localStorage.getItem('jwtToken');
  },

  removeToken: () => {
    localStorage.removeItem('jwtToken');
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('jwtToken');
  },

  isGuest: () => {
    const token = localStorage.getItem('jwtToken');
    return token ? token.startsWith('guest.') : false;
  },
};

export const boardAPI = {

  getBoardState: async () => {
    const response = await fetch(`${API_BASE_URL}/api/board/state`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to get board state');
    }
    
    return response.json();
  },

  clearBoard: async () => {
    const token = localStorage.getItem('jwtToken');
    
    const response = await fetch(`${API_BASE_URL}/api/board/clear`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to clear board');
    }
    
    return response.text();
  },
};
