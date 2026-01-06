import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import SettingsPage from './pages/SettingsPage';
import DmxOutputPage from './pages/DmxOutputPage';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/dmx-output" element={<DmxOutputPage />} />
      </Routes>
    </Router>
  );
}

export default App;
