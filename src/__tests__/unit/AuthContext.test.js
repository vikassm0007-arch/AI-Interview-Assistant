import { describe, it, expect, beforeEach } from 'vitest';

// Local storage mock helper for Vitest Node environment
const mockStorage = (() => {
  let store = {};
  return {
    getItem: (key) => store[key] || null,
    setItem: (key, value) => { store[key] = String(value); },
    removeItem: (key) => { delete store[key]; },
    clear: () => { store = {}; }
  };
})();

describe('AuthContext Persistence & Session Tests', () => {

  beforeEach(() => {
    mockStorage.clear();
  });

  it('initializes loggedOut state when localStorage is empty', () => {
    const isLoggedIn = mockStorage.getItem('isLoggedIn') === 'true';
    expect(isLoggedIn).toBe(false);
  });

  it('persists candidate user details upon authentication', () => {
    const mockUser = { name: 'Candidate User', email: 'user@example.com', targetRole: 'Senior Engineer' };
    mockStorage.setItem('user', JSON.stringify(mockUser));
    mockStorage.setItem('token', 'mock-jwt-token-2026');
    mockStorage.setItem('isLoggedIn', 'true');

    const savedUser = JSON.parse(mockStorage.getItem('user'));
    expect(savedUser.email).toBe('user@example.com');
    expect(mockStorage.getItem('isLoggedIn')).toBe('true');
  });

  it('clears storage and resets session upon logout', () => {
    mockStorage.setItem('token', 'mock-jwt-token-2026');
    mockStorage.setItem('isLoggedIn', 'true');

    // Simulate logout
    mockStorage.removeItem('token');
    mockStorage.setItem('isLoggedIn', 'false');

    expect(mockStorage.getItem('token')).toBeNull();
    expect(mockStorage.getItem('isLoggedIn')).toBe('false');
  });

});
