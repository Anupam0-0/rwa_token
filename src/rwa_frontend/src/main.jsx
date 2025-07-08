import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { Connect2ICProvider } from '@connect2ic/react';
import { client } from './hooks/useWallet';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Connect2ICProvider client={client}>
        <App />
      </Connect2ICProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
