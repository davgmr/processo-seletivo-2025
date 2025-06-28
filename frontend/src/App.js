import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import DuvList from './components/DuvList/DuvList';
import DuvDetail from './components/DuvDetail/DuvDetail';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<DuvList />} />
            <Route path="/duv/:id" element={<DuvDetail />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;