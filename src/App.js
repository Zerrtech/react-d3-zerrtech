import React, { Component } from 'react';
import logo from './logo.png';
import './App.css';
import Population from './components/population'

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Using D3.js with React</h1>
        </header>
        <Population/>
        <p className="App-intro">

        </p>
      </div>
    );
  }
}

export default App;
