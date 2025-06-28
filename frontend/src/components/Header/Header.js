import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-content">
          <Link to="/" className="logo">
            <img 
              src="/Logo.png" 
              alt="DUV System Logo" 
              className="logo-icon"
              onError={(e) => {
                // Fallback para emoji se a imagem não carregar
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'inline-block';
              }}
            />
            <span className="logo-icon-fallback" style={{display: 'none'}}>⚓</span>
            <span className="logo-text">DUV System</span>
          </Link>
          
          <nav className="nav">
            {!isHome && (
              <Link to="/" className="nav-link">
                ← Voltar para DUVs
              </Link>
            )}
          </nav>
        </div>
        
        <div className="header-subtitle">
          <p>Sistema de Gerenciamento de Documentos Únicos Virtuais</p>
        </div>
      </div>
    </header>
  );
};

export default Header;