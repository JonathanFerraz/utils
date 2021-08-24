import React from 'react';
import logo from './logo.svg';
import './App.css';
import { TouchRipple } from './components/Typescript/TouchRipple';
import Typography from './components/Typescript/Typography';

function App() {
  const rippleRef = React.useRef() as any;

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
      <div
        className="test"
        onMouseDown={(e) => {
          rippleRef?.current?.start(e);
        }}
        onMouseUp={(e) => {
          rippleRef?.current?.stop(e);
        }}
        onMouseLeave={(e) => {
          rippleRef?.current?.stop(e);
        }}
      >
        Teste
        <TouchRipple ref={rippleRef} />
      </div>
      <Typography>asdasdasdasdas</Typography>
    </div>
  );
}

export default App;
