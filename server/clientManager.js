// Client authentication and authorization manager
const config = require('./config');

class ClientManager {
  constructor() {
    this.activeConnections = new Map(); // clientId -> { ws, lastSeen, ip, userAgent }
  }

  // Check if connection is from localhost
  isLocalhost(req) {
    const ip = req.socket.remoteAddress || req.connection.remoteAddress;
    const hostname = req.hostname;

    // Check for IPv4 and IPv6 localhost
    const isLoopback = ip === '127.0.0.1' ||
                       ip === '::1' ||
                       ip === '::ffff:127.0.0.1';

    const isLocalhostHostname = hostname === 'localhost' ||
                                hostname === '127.0.0.1' ||
                                hostname === '::1';

    return isLoopback || isLocalhostHostname;
  }

  // Get or create client entry
  getOrCreateClient(clientId, req) {
    const currentConfig = config.get();

    if (!currentConfig.clients) {
      currentConfig.clients = [];
    }

    let client = currentConfig.clients.find(c => c.id === clientId);

    const ip = req.socket.remoteAddress || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const now = Date.now();
    const isLocalhost = this.isLocalhost(req);

    if (!client) {
      // New client - create entry with default role from config
      const defaultRole = currentConfig.webServer?.defaultClientRole || 'viewer';
      client = {
        id: clientId,
        role: defaultRole,
        nickname: isLocalhost ? 'Server' : '', // Default nickname for localhost
        pendingRequest: false,
        firstSeen: now,
        lastSeen: now,
        lastIp: ip,
        userAgent: userAgent
      };

      currentConfig.clients.push(client);
      config.update(currentConfig);
      console.log(`New client registered: ${clientId.substring(0, 6)} from ${ip} with role ${defaultRole}`);
    } else {
      // Update existing client
      client.lastSeen = now;
      client.lastIp = ip;
      client.userAgent = userAgent;
      config.update(currentConfig);
    }

    // Override to editor if localhost
    if (isLocalhost) {
      client.role = 'editor';
      console.log(`Localhost detected: ${clientId.substring(0, 6)} auto-promoted to editor`);
    }

    return client;
  }

  // Mark connection as active
  setActive(clientId, ws, ip, userAgent) {
    this.activeConnections.set(clientId, {
      ws,
      lastSeen: Date.now(),
      ip,
      userAgent
    });
  }

  // Remove active connection
  setInactive(clientId) {
    this.activeConnections.delete(clientId);
  }

  // Get active connection
  getActive(clientId) {
    return this.activeConnections.get(clientId);
  }

  // Check if client is currently connected
  isActive(clientId) {
    return this.activeConnections.has(clientId);
  }

  // Get all active clients
  getActiveClients() {
    return Array.from(this.activeConnections.keys());
  }

  // Request editor access
  requestAccess(clientId) {
    const currentConfig = config.get();
    const client = currentConfig.clients.find(c => c.id === clientId);

    if (client && client.role === 'viewer') {
      client.pendingRequest = true;
      config.update(currentConfig);
      console.log(`Access requested by: ${clientId.substring(0, 6)}`);
      return true;
    }

    return false;
  }

  // Approve client (promote to controller)
  approveClient(clientId) {
    const currentConfig = config.get();
    const client = currentConfig.clients.find(c => c.id === clientId);

    if (client) {
      client.role = 'controller';
      client.pendingRequest = false;
      config.update(currentConfig);
      console.log(`Client approved: ${clientId.substring(0, 6)} promoted to controller`);

      // Notify the client if they're connected
      const connection = this.getActive(clientId);
      if (connection && connection.ws) {
        connection.ws.send(JSON.stringify({
          type: 'roleUpdate',
          role: 'controller'
        }));
      }

      return true;
    }

    return false;
  }

  // Update client role
  updateRole(clientId, role) {
    const currentConfig = config.get();
    const client = currentConfig.clients.find(c => c.id === clientId);

    if (client) {
      client.role = role;
      if (role === 'controller' || role === 'editor') {
        client.pendingRequest = false;
      }
      config.update(currentConfig);

      // Notify the client if they're connected
      const connection = this.getActive(clientId);
      if (connection && connection.ws) {
        connection.ws.send(JSON.stringify({
          type: 'roleUpdate',
          role: role
        }));
      }

      return true;
    }

    return false;
  }

  // Update client nickname
  updateNickname(clientId, nickname) {
    const currentConfig = config.get();
    const client = currentConfig.clients.find(c => c.id === clientId);

    if (client) {
      client.nickname = nickname;
      config.update(currentConfig);
      return true;
    }

    return false;
  }

  // Check if client has permission for an action
  hasPermission(clientId, action = 'edit') {
    const currentConfig = config.get();
    const client = currentConfig.clients.find(c => c.id === clientId);

    if (!client) {
      return false; // Unknown client
    }

    if (action === 'edit') {
      // Both controller and editor can edit lights/looks
      return client.role === 'controller' || client.role === 'editor';
    }

    if (action === 'settings') {
      // Only editor can access settings
      return client.role === 'editor';
    }

    // Viewers can view
    return true;
  }

  // Get all clients with connection status
  getAllClientsWithStatus() {
    const currentConfig = config.get();
    const clients = currentConfig.clients || [];

    return clients.map(client => ({
      ...client,
      isActive: this.isActive(client.id),
      shortId: client.id.substring(0, 6).toUpperCase()
    }));
  }

  // Remove a client
  removeClient(clientId) {
    const currentConfig = config.get();
    currentConfig.clients = currentConfig.clients.filter(c => c.id !== clientId);
    config.update(currentConfig);

    // Disconnect if active
    const connection = this.getActive(clientId);
    if (connection && connection.ws) {
      connection.ws.close();
    }
    this.setInactive(clientId);

    return true;
  }
}

module.exports = new ClientManager();
