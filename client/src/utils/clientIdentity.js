// Client identity management
// Generates and stores a unique clientId for this device

const CLIENT_ID_KEY = 'dmx_client_id';

// Generate a UUID v4
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Get or create clientId
export function getClientId() {
  let clientId = localStorage.getItem(CLIENT_ID_KEY);

  if (!clientId) {
    clientId = generateUUID();
    localStorage.setItem(CLIENT_ID_KEY, clientId);
    console.log('Generated new clientId:', clientId);
  }

  return clientId;
}

// Get short display ID (first 6 characters)
export function getShortId(clientId = null) {
  const id = clientId || getClientId();
  return id.substring(0, 6).toUpperCase();
}

// Clear clientId (for testing/debugging)
export function clearClientId() {
  localStorage.removeItem(CLIENT_ID_KEY);
}
