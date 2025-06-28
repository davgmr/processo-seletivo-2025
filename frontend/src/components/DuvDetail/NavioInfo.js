import React from 'react';

const NavioInfo = ({ navio }) => {
  const getBandeiraFlag = (bandeira) => {
    const flags = {
      'Brasil': '🇧🇷',
      'Panamá': '🇵🇦', 
      'Panama': '🇵🇦',
      'Noruega': '🇳🇴',
      'EUA': '🇺🇸',
      'Estados Unidos': '🇺🇸'
    };
    return flags[bandeira] || '🏴';
  };

  return (
    <div className="navio-info card">
      <h2 className="section-title">Informações da Embarcação</h2>
      
      <div className="navio-content">
        <div className="navio-image-section">
          <div className="navio-image-container">
            <img 
              src={navio.imagem} 
              alt={navio.nome}
              className="navio-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300/e5e7eb/6b7280?text=Embarcação';
              }}
            />
          </div>
        </div>
        
        <div className="navio-details-section">
          <div className="navio-details">
            <h3 className="navio-name">{navio.nome}</h3>
            
            <div className="navio-info-grid">
              <div className="info-item">
                <span className="info-label">ID da Embarcação</span>
                <span className="info-value">{navio.id}</span>
              </div>
              
              <div className="info-item">
                <span className="info-label">Bandeira</span>
                <span className="info-value">
                  <span className="flag-icon">{getBandeiraFlag(navio.bandeira)}</span>
                  {navio.bandeira}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavioInfo;