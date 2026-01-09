import React from 'react';

const ConnectedUsers = ({ activeClients, show }) => {
  if (!show || !activeClients || activeClients.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        left: '16px',
        background: '#1a1a2e',
        border: '2px solid #333',
        borderRadius: '8px',
        padding: '12px',
        zIndex: 1000,
        minWidth: '180px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div style={{ marginBottom: '8px', fontSize: '12px', fontWeight: '600', color: '#888', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Connected Users
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {activeClients.map((client) => (
          <div
            key={client.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px'
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#4ae24a',
                flexShrink: 0
              }}
            />
            <span style={{ fontWeight: '500', color: '#f0f0f0' }}>
              {client.nickname || client.shortId}
            </span>
            <span
              style={{
                fontSize: '10px',
                padding: '2px 4px',
                borderRadius: '3px',
                background: client.role === 'editor' ? '#2a4a2a' :
                           client.role === 'moderator' ? '#4a2a4a' :
                           client.role === 'controller' ? '#4a3a2a' : '#2a2a4a',
                color: client.role === 'editor' ? '#4ae24a' :
                       client.role === 'moderator' ? '#e24ae2' :
                       client.role === 'controller' ? '#e2904a' : '#4a90e2',
                textTransform: 'uppercase',
                fontWeight: '600'
              }}
            >
              {client.role === 'editor' ? 'E' :
               client.role === 'moderator' ? 'M' :
               client.role === 'controller' ? 'C' : 'V'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConnectedUsers;
