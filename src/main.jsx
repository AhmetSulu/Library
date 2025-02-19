import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.jsx';

const rootElement = document.getElementById('root');

if (process.env.NODE_ENV === 'production') {
  try {
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (error) {
    console.error('Application failed to start:', error);
    rootElement.innerHTML = `
      <div style="padding: 20px; text-align: center;">
        <h1>Something went wrong</h1>
        <p>The application failed to start. Please try refreshing the page.</p>
      </div>
    `;
  }
} else {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}