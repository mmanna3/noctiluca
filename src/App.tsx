import React from 'react';
import logo from './logo.svg';
import './App.css';
import {crearEscrito} from './firebase';

function App() {

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Cami <strong>te amo mucho</strong>.
        </p>
        <p>¿Querés comer picadita y después empanadas conmigo?</p>
      </header>
      <button onClick={() => crearEscrito('Otro título', 'bla sa dlba cuerpito eas das as ')}>Crear escrito</button>
    </div>
  );
}

export default App;
