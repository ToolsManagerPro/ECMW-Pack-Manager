import React from 'https://esm.sh/react@18.2.0';
import { createRoot } from 'https://esm.sh/react-dom@18.2.0/client';
import App from './App.js'; // Note the .js extension

const container = document.getElementById('root');
if (container) {
    const root = createRoot(container);
    root.render(<App />);
}
