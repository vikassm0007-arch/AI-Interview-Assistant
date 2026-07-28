const BASE_URL = 'http://localhost:5000/api';

/**
 * Custom full-stack API fetch wrapper that handles:
 * - Bearer authorization header injection
 * - Cross-origin credentials passing (HttpOnly cookies)
 * - Automatic 401 token expiration interception and retry
 */
export const apiFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  // Set default JSON headers
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Inject JWT access token if present
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers,
    credentials: 'include', // Vital to enable browser HttpOnly cookie lifecycle passing
  };

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);

    // If access token has expired (401), attempt to perform token rotation
    if (response.status === 401 && endpoint !== '/auth/refresh') {
      try {
        const refreshResponse = await fetch(`${BASE_URL}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include'
        });

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          // Update short-lived token store
          localStorage.setItem('token', refreshData.accessToken);

          // Retry the original query with the new access token
          headers['Authorization'] = `Bearer ${refreshData.accessToken}`;
          const retryResponse = await fetch(`${BASE_URL}${endpoint}`, config);
          
          if (!retryResponse.ok) throw await getError(retryResponse);
          return await parseResponse(retryResponse);
        } else {
          // Refresh token expired or revoked. Clear context.
          clearAuthContext();
        }
      } catch (refreshErr) {
        clearAuthContext();
      }
    }

    if (!response.ok) {
      throw await getError(response);
    }

    return await parseResponse(response);
  } catch (error) {
    console.error(`API Client Error: ${error.message}`);
    throw error;
  }
};

// Clear local credentials on auth failure
const clearAuthContext = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('isLoggedIn');
  // Avoid loop redirects, proceed to login page
  if (window.location.pathname !== '/login') {
    window.location.href = '/login';
  }
};

// Response parser helper
const parseResponse = async (response) => {
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return null;
};

// Exception structure mapper
const getError = async (response) => {
  let errorData;
  try {
    errorData = await response.json();
  } catch (err) {
    errorData = { message: response.statusText || 'API network request failed' };
  }
  const error = new Error(errorData.message || 'API request failed');
  error.status = response.status;
  return error;
};
