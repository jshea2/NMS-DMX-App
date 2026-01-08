import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import SettingsPage from './pages/SettingsPage';
import DmxOutputPage from './pages/DmxOutputPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/dmx-output" element={<DmxOutputPage />} />
      </Routes>
    </Router>
  );
}

export default App;
