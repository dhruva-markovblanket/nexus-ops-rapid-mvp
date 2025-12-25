import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const rootElement = document.getElementById('root');

if (!rootElement) {
  // Fallback if HTML is malformed
  document.body.innerHTML = '<div style="color:red; font-family:sans-serif; padding:20px;"><h1>Fatal Error</h1><p>Could not find root element to mount application.</p></div>';
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
} catch (error) {
  console.error("Failed to mount React application:", error);
  rootElement.innerHTML = `
    <div style="padding: 2rem; font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto; text-align: center;">
      <h2 style="color: #ef4444; margin-bottom: 1rem;">Application Failed to Start</h2>
      <p style="color: #374151; margin-bottom: 1rem;">An unexpected error occurred while initializing the application.</p>
      <pre style="background: #f3f4f6; padding: 1rem; border-radius: 0.5rem; text-align: left; overflow: auto; font-size: 0.875rem;">${error instanceof Error ? error.message : String(error)}</pre>
      <button onclick="window.location.reload()" style="margin-top: 1.5rem; padding: 0.5rem 1rem; background: #4f46e5; color: white; border: none; border-radius: 0.375rem; cursor: pointer;">Reload Application</button>
    </div>
  `;
}