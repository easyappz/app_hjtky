import React, { useEffect } from 'react';
import ErrorBoundary from './ErrorBoundary';
import './App.css';
import Calculator from './components/Calculator';

function App() {
  useEffect(() => {
    if (typeof window !== 'undefined' && typeof window.handleRoutes === 'function') {
      window.handleRoutes(['/']);
    }
  }, []);

  return (
    <ErrorBoundary>
      <div className="page" data-easytag="id1-src/App.js">
        <header className="page__header" data-easytag="id2-src/App.js">
          <h1 className="page__title" data-easytag="id3-src/App.js">Калькулятор</h1>
        </header>
        <main className="page__main" data-easytag="id4-src/App.js">
          <div className="container" data-easytag="id5-src/App.js">
            <Calculator />
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;
