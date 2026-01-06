import { useEffect, useRef, useState, useCallback } from 'react';

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
  const ws = useRef(null);
  const reconnectTimeout = useRef(null);

  const connect = useCallback(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    // In dev mode, React runs on 3001 but backend/WebSocket is on 3000
    const wsPort = process.env.NODE_ENV === 'development' ? 3000 : (window.location.port || 3000);
    const wsUrl = `${protocol}//${window.location.hostname}:${wsPort}`;

    ws.current = new WebSocket(wsUrl);

    ws.current.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
    };

    ws.current.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        if (message.type === 'state') {
          setState(message.data);
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    };

    ws.current.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);

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

  return { state, sendUpdate, connected };
};

export default useWebSocket;
