import { useEffect, useRef, useState, useCallback } from 'react';
import { getClientId } from '../utils/clientIdentity';

const useWebSocket = () => {
  const [state, setState] = useState({
    blackout: false,
    looks: {
      look1: 0,
      look2: 0,
      look3: 0
    },
    fixtures: {
      panel1: { hue: 0, brightness: 0 },
      panel2: { hue: 0, brightness: 0 },
      par1: { intensity: 0 },
      par2: { intensity: 0 }
    }
  });

  const [connected, setConnected] = useState(false);
  const [role, setRole] = useState('viewer'); // viewer or editor
  const [shortId, setShortId] = useState('');
  const [activeClients, setActiveClients] = useState([]);
  const [showConnectedUsers, setShowConnectedUsers] = useState(true);

  const ws = useRef(null);
  const reconnectTimeout = useRef(null);
  const authenticated = useRef(false);

  const connect = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // In dev mode, React runs on 3001 but backend/WebSocket is on 3000
    const wsPort = process.env.NODE_ENV === 'development' ? 3000 : (window.location.port || 3000);
    const wsUrl = `${protocol}//${window.location.hostname}:${wsPort}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      authenticated.current = false;

      // Send authentication
      const clientId = getClientId();
      ws.current.send(JSON.stringify({
        type: 'auth',
        clientId: clientId
      }));
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        if (message.type === 'state') {
          setState(message.data);
        } else if (message.type === 'authResult') {
          authenticated.current = true;
          setRole(message.role);
          setShortId(message.shortId);
          console.log(`Authenticated as ${message.role} (${message.shortId})`);
        } else if (message.type === 'roleUpdate') {
          console.log(`[WebSocket] Role update received: ${message.role}`);
          setRole(message.role);
          // Force a page reload to ensure all UI elements update with new permissions
          console.log('[WebSocket] Reloading page to apply new permissions');
          setTimeout(() => window.location.reload(), 500);
        } else if (message.type === 'activeClients') {
          setActiveClients(message.clients || []);
          setShowConnectedUsers(message.showConnectedUsers !== false);
        } else if (message.type === 'permissionDenied') {
          console.warn('Permission denied:', message.message);
          alert(message.message);
        } else if (message.type === 'accessDenied') {
          console.warn('Access denied:', message.message);
          alert(message.message);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
      authenticated.current = false;

      // Attempt to reconnect after 2 seconds
      reconnectTimeout.current = setTimeout(() => {
        console.log('Attempting to reconnect...');
        connect();
      }, 2000);
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
  }, []);

  useEffect(() => {
    connect();

    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [connect]);

  const sendUpdate = useCallback((updates) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'update',
        data: updates
      }));
    }
  }, []);

  const requestAccess = useCallback(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({
        type: 'requestAccess'
      }));
    }
  }, []);

  return {
    state,
    sendUpdate,
    connected,
    role,
    shortId,
    requestAccess,
    activeClients,
    showConnectedUsers
  };
};

export default useWebSocket;
