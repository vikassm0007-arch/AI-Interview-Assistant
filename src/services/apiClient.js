import { apiFetch } from '../api';

/**
 * Exponential Backoff Delay Helper
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Robust API Client Wrapper with Retry & Resilience
 * @param {string} endpoint - API route path
 * @param {object} options - Fetch options
 * @param {number} maxRetries - Maximum retry attempts (default 3)
 */
export async function resilientApiFetch(endpoint, options = {}, maxRetries = 3) {
  // Check browser network status
  if (!navigator.onLine) {
    throw new Error('Network connection offline. Please check your internet connection.');
  }

  let attempt = 0;
  let lastError = null;

  while (attempt < maxRetries) {
    try {
      attempt++;
      const result = await apiFetch(endpoint, options);
      return result;
    } catch (error) {
      lastError = error;
      console.warn(`[apiClient] Request attempt ${attempt} failed for ${endpoint}:`, error.message);

      if (attempt < maxRetries) {
        // Exponential backoff: 500ms, 1000ms, 2000ms
        const backoffMs = Math.pow(2, attempt - 1) * 500;
        await delay(backoffMs);
      }
    }
  }

  throw lastError || new Error(`API Request to ${endpoint} failed after ${maxRetries} attempts.`);
}

/**
 * Global Network Offline Listener Registration
 * @param {function} onOfflineStatusChange - Callback(isOnline)
 */
export function registerNetworkStatusListener(onOfflineStatusChange) {
  const handleOnline = () => onOfflineStatusChange(true);
  const handleOffline = () => onOfflineStatusChange(false);

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}

/**
 * Audio / Microphone Media Permission Check & Fallback Helper
 * Checks if browser audio mic permissions are available or denied.
 */
export async function checkMicrophonePermission() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    return { available: false, reason: 'MediaDevices API not supported in browser environment.' };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    // Stop tracks immediately after checking
    stream.getTracks().forEach(track => track.stop());
    return { available: true };
  } catch (err) {
    return { 
      available: false, 
      reason: err.name === 'NotAllowedError' 
        ? 'Microphone permission was denied.' 
        : 'Microphone hardware device not found.' 
    };
  }
}
