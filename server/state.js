const config = require('./config');

// Helper to get profile for a fixture
function getProfile(cfg, fixture) {
  return cfg.fixtureProfiles?.find(p => p.id === fixture.profileId);
}

// Generate default state dynamically from config
function generateDefaultState() {
  const cfg = config.get();
  
  const fixtures = {};
  cfg.fixtures.forEach(fixture => {
    const profile = getProfile(cfg, fixture);
    if (!profile) return;

    // All fixtures use direct channel controls
    fixtures[fixture.id] = {};
    profile.channels.forEach(ch => {
      fixtures[fixture.id][ch.name] = 0;
    });
  });

  const looks = {};
  cfg.looks.forEach(look => {
    looks[look.id] = 0;
  });

  return { blackout: false, fixtures, looks };
}

class State {
  constructor() {
    this.state = generateDefaultState();
    this.listeners = [];
  }

  // Reinitialize state when config changes (e.g., fixtures added/removed)
  reinitialize() {
    const newDefaults = generateDefaultState();
    // Merge existing values with new structure
    const mergedFixtures = {};
    Object.keys(newDefaults.fixtures).forEach(fixtureId => {
      if (this.state.fixtures[fixtureId]) {
        // Keep existing values, add any new channels
        mergedFixtures[fixtureId] = { ...newDefaults.fixtures[fixtureId], ...this.state.fixtures[fixtureId] };
      } else {
        mergedFixtures[fixtureId] = newDefaults.fixtures[fixtureId];
      }
    });

    const mergedLooks = {};
    Object.keys(newDefaults.looks).forEach(lookId => {
      mergedLooks[lookId] = this.state.looks[lookId] !== undefined ? this.state.looks[lookId] : 0;
    });

    this.state = {
      blackout: this.state.blackout,
      fixtures: mergedFixtures,
      looks: mergedLooks
    };
    this.notifyListeners();
  }

  get() {
    return this.state;
  }

  update(updates) {
    if (updates.blackout !== undefined) {
      this.state.blackout = updates.blackout;
    }

    if (updates.looks) {
      this.state.looks = { ...this.state.looks, ...updates.looks };
    }

    if (updates.fixtures) {
      Object.keys(updates.fixtures).forEach(fixtureId => {
        this.state.fixtures[fixtureId] = {
          ...this.state.fixtures[fixtureId],
          ...updates.fixtures[fixtureId]
        };
      });
    }

    this.notifyListeners();
  }

  addListener(callback) {
    this.listeners.push(callback);
  }

  removeListener(callback) {
    this.listeners = this.listeners.filter(l => l !== callback);
  }

  notifyListeners() {
    this.listeners.forEach(callback => callback(this.state));
  }

  reset() {
    this.state = generateDefaultState();
    this.notifyListeners();
  }
}

module.exports = new State();
