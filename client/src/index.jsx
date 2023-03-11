import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));

// no strict mode in dev because useEffect is called twice
root.render(<App />);
