import logo from './logo.svg';
import './App.css';
import React, { Component } from 'react';
import Sidebar from './components/Sidebar.js';
import Dashboard from './components/Dashboard.js';
// import dashboard from './components/dashboard.js';
class App extends Component {
  render() {
    return (
      <div className="layout">
        <Sidebar />
        <Dashboard />
      </div>
    );
  }
}

export default App;
