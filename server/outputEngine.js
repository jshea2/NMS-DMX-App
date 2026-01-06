const e131 = require('e131');
const dgram = require('dgram');
const config = require('./config');
const dmxEngine = require('./dmxEngine');

class OutputEngine {
  constructor() {
    this.clients = {};
    this.interval = null;
    this.running = false;
  }

  start() {
    if (this.running) {
      this.stop();
    }

    const cfg = config.get();
    const fps = cfg.network.outputFps || 30;
    const intervalMs = 1000 / fps;

    this.running = true;

    this.interval = setInterval(() => {
      this.sendFrame();
    }, intervalMs);

    console.log(`Output engine started at ${fps} fps`);
  }

  stop() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }

    // Close all clients/sockets properly
    Object.entries(this.clients).forEach(([key, client]) => {
      try {
        if (client) {
          if (key.startsWith('artnet_') && client.close) {
            // dgram socket - unref first to allow process to exit
            client.unref();
            client.close();
            console.log(`Closed Art-Net socket: ${key}`);
          } else if (key.startsWith('sacn_') && client.close) {
            client.close();
            console.log(`Closed sACN client: ${key}`);
          }
        }
      } catch (err) {
        console.error(`Error closing ${key}:`, err.message);
      }
    });

    this.clients = {};
    this.running = false;
    console.log('Output engine stopped');
  }

  sendFrame() {
    const cfg = config.get();
    const universes = dmxEngine.computeOutput();

    if (cfg.network.protocol === 'sacn') {
      this.sendSACN(universes);
    } else if (cfg.network.protocol === 'artnet') {
      this.sendArtNet(universes);
    }
  }

  sendSACN(universes) {
    const cfg = config.get();
    const sacnCfg = cfg.network.sacn;

    Object.keys(universes).forEach(universeNum => {
      const universeInt = parseInt(universeNum);
      const dmxData = universes[universeNum];

      // Create or reuse client for this universe
      const clientKey = `sacn_${universeNum}`;
      if (!this.clients[clientKey]) {
        const clientOptions = { universe: universeInt };

        // Bind to specific interface if specified
        if (sacnCfg.bindAddress) {
          clientOptions.reuseAddr = true;
          console.log(`sACN will bind to interface: ${sacnCfg.bindAddress}`);
        }

        this.clients[clientKey] = new e131.Client(universeInt);

        // Note: e131 library doesn't directly support interface binding in constructor
        // For production, you may need to use a different library or fork e131
      }

      const client = this.clients[clientKey];
      const packet = client.createPacket(512);
      const slotsData = packet.getSlotsData();

      // Copy DMX data into packet
      for (let i = 0; i < 512; i++) {
        slotsData[i] = dmxData[i];
      }

      packet.setSourceName('NMS DMX Control');
      packet.setPriority(sacnCfg.priority || 100);

      if (sacnCfg.multicast) {
        // Send multicast
        client.send(packet);
      } else {
        // Send unicast to specified destinations
        if (sacnCfg.unicastDestinations && sacnCfg.unicastDestinations.length > 0) {
          sacnCfg.unicastDestinations.forEach(dest => {
            client.send(packet, () => {}, dest);
          });
        }
      }
    });
  }

  sendArtNet(universes) {
    const cfg = config.get();
    const artnetCfg = cfg.network.artnet;

    Object.keys(universes).forEach(universeNum => {
      const dmxData = universes[universeNum];

      // Create Art-Net packet
      const packet = this.createArtNetPacket(
        artnetCfg.net || 0,
        artnetCfg.subnet || 0,
        parseInt(universeNum),
        dmxData
      );

      // Create or reuse UDP socket
      const clientKey = `artnet_${universeNum}`;
      if (!this.clients[clientKey]) {
        const socket = dgram.createSocket('udp4');

        // Bind to specific interface if specified
        if (artnetCfg.bindAddress) {
          socket.bind(0, artnetCfg.bindAddress, () => {
            console.log(`Art-Net bound to interface: ${artnetCfg.bindAddress}`);
            // Enable broadcast after binding completes
            if (artnetCfg.destination === '255.255.255.255' ||
                artnetCfg.destination.endsWith('.255')) {
              socket.setBroadcast(true);
            }
          });
        } else {
          // No specific bind address - bind to default and enable broadcast
          socket.bind(() => {
            // Enable broadcast after binding
            if (artnetCfg.destination === '255.255.255.255' ||
                artnetCfg.destination.endsWith('.255')) {
              socket.setBroadcast(true);
            }
          });
        }

        // Store socket
        this.clients[clientKey] = socket;
      }

      const socket = this.clients[clientKey];
      const port = artnetCfg.port || 6454;
      const destination = artnetCfg.destination || '255.255.255.255';

      // Log non-zero channels for debugging
      const nonZeroChannels = [];
      for (let i = 0; i < dmxData.length; i++) {
        if (dmxData[i] > 0) {
          nonZeroChannels.push(`Ch${i + 1}=${dmxData[i]}`);
        }
      }

      if (nonZeroChannels.length > 0) {
        const portAddress = ((artnetCfg.net & 0x7F) << 8) | ((artnetCfg.subnet & 0x0F) << 4) | (parseInt(universeNum) & 0x0F);
        console.log(`[Art-Net TX] → ${destination}:${port} | Net:${artnetCfg.net} Sub:${artnetCfg.subnet} Univ:${universeNum} (Port:${portAddress}) | ${nonZeroChannels.join(', ')}`);
      }

      socket.send(packet, port, destination, (err) => {
        if (err) {
          console.error('Art-Net send error:', err);
        }
      });
    });
  }

  createArtNetPacket(net, subnet, universe, dmxData) {
    // Art-Net packet structure
    const packet = Buffer.alloc(18 + 512);

    // Header
    packet.write('Art-Net\0', 0, 8);

    // OpCode (0x5000 = OpDmx in little-endian)
    packet.writeUInt16LE(0x5000, 8);

    // Protocol version (14)
    packet.writeUInt16BE(14, 10);

    // Sequence (0 = no sequencing)
    packet.writeUInt8(0, 12);

    // Physical port
    packet.writeUInt8(0, 13);

    // Universe (SubUni combined)
    const portAddress = ((net & 0x7F) << 8) | ((subnet & 0x0F) << 4) | (universe & 0x0F);
    packet.writeUInt16LE(portAddress, 14);

    // Length (512 in big-endian)
    packet.writeUInt16BE(512, 16);

    // DMX data
    for (let i = 0; i < 512; i++) {
      packet.writeUInt8(dmxData[i], 18 + i);
    }

    return packet;
  }

  restart() {
    this.stop();
    setTimeout(() => {
      this.start();
    }, 100);
  }
}

module.exports = new OutputEngine();
