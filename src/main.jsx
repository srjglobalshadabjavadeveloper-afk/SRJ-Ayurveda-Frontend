// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import AppProvider from './app/Provider.jsx';
import { CartProvider } from './context/CartContext.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppProvider>
   {/* <CartProvider> */}
    <App />
   {/* </CartProvider> */}

  </AppProvider>
);