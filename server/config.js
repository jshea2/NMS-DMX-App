const fs = require('fs');
const path = require('path');

const CONFIG_FILE = path.join(__dirname, 'config.json');

const DEFAULT_CONFIG = {
  fixtureProfiles: [
    {
      id: 'rgb-3ch',
      name: 'LED Par (3ch RGB)',
      channels: [
        { name: 'red', offset: 0 },
        { name: 'green', offset: 1 },
        { name: 'blue', offset: 2 }
      ]
    },
    {
      id: 'intensity-1ch',
      name: 'Dimmer (1ch)',
      channels: [
        { name: 'intensity', offset: 0 }
      ]
    },
    {
      id: 'rgbw-4ch',
      name: 'LED Par (4ch RGBW)',
      channels: [
        { name: 'red', offset: 0 },
        { name: 'green', offset: 1 },
        { name: 'blue', offset: 2 },
        { name: 'white', offset: 3 }
      ]
    }
  ],
  network: {
    protocol: 'sacn', // 'sacn' or 'artnet'
    sacn: {
      universe: 1,
      priority: 100,
      multicast: true,
      unicastDestinations: [], // Array of IP addresses for unicast
      bindAddress: '' // Optional: bind to specific network interface (e.g., '192.168.1.100')
    },
    artnet: {
      net: 0,
      subnet: 0,
      universe: 0,
      destination: '255.255.255.255', // Broadcast or specific IP
      port: 6454,
      bindAddress: '' // Optional: bind to specific network interface (e.g., '192.168.1.100')
    },
    outputFps: 30
  },
  server: {
    port: 3000,
    bindAddress: '0.0.0.0' // 0.0.0.0 = all interfaces, or specify IP for one interface
  },
  fixtures: [
    {
      id: 'panel1',
      name: 'RGB Panel 1',
      profileId: 'rgb-3ch',
      universe: 1,
      startAddress: 1,
      showOnMain: true
    },
    {
      id: 'panel2',
      name: 'RGB Panel 2',
      profileId: 'rgb-3ch',
      universe: 1,
      startAddress: 4,
      showOnMain: true
    },
    {
      id: 'par1',
      name: 'Backlight PAR 1',
      profileId: 'intensity-1ch',
      universe: 1,
      startAddress: 7,
      showOnMain: true
    },
    {
      id: 'par2',
      name: 'Backlight PAR 2',
      profileId: 'intensity-1ch',
      universe: 1,
      startAddress: 8,
      showOnMain: true
    }
  ],
  looks: [
    {
      id: 'look1',
      name: 'Warm Dramatic',
      targets: {
        panel1: { hue: 30, brightness: 75 },
        panel2: { hue: 30, brightness: 75 },
        par1: { intensity: 60 },
        par2: { intensity: 60 }
      }
    },
    {
      id: 'look2',
      name: 'Cool Dramatic',
      targets: {
        panel1: { hue: 200, brightness: 70 },
        panel2: { hue: 200, brightness: 70 },
        par1: { intensity: 50 },
        par2: { intensity: 50 }
      }
    },
    {
      id: 'look3',
      name: 'Vibrant',
      targets: {
        panel1: { hue: 280, brightness: 85 },
        panel2: { hue: 120, brightness: 85 },
        par1: { intensity: 70 },
        par2: { intensity: 70 }
      }
    }
  ],
  settings: {
    requirePassword: false,
    password: ''
  }
};

class Config {
  constructor() {
    this.config = this.load();
  }

  load() {
    try {
      if (fs.existsSync(CONFIG_FILE)) {
        const data = fs.readFileSync(CONFIG_FILE, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.error('Error loading config:', error);
    }
    return JSON.parse(JSON.stringify(DEFAULT_CONFIG));
  }

  save() {
    try {
      fs.writeFileSync(CONFIG_FILE, JSON.stringify(this.config, null, 2));
      return true;
    } catch (error) {
      console.error('Error saving config:', error);
      return false;
    }
  }

  get() {
    return this.config;
  }

  update(newConfig) {
    this.config = newConfig;
    return this.save();
  }

  reset() {
    this.config = JSON.parse(JSON.stringify(DEFAULT_CONFIG));
    return this.save();
  }

  exportConfig() {
    return JSON.stringify(this.config, null, 2);
  }

  importConfig(configJson) {
    try {
      const imported = JSON.parse(configJson);
      this.config = imported;
      return this.save();
    } catch (error) {
      console.error('Error importing config:', error);
      return false;
    }
  }
}

module.exports = new Config();
