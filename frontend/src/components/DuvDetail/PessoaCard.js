import React from 'react';

const PessoaCard = ({ pessoa, tipo }) => {
  const getNacionalidadeFlag = (nacionalidade) => {
    const flags = {
      'Brasil': '🇧🇷',
      'EUA': '🇺🇸',
      'Estados Unidos': '🇺🇸',
      'Alemanha': '🇩🇪',
      'França': '🇫🇷',
      'Itália': '🇮🇹',
      'Noruega': '🇳🇴',
      'Panamá': '🇵🇦',
      'Panama': '🇵🇦'
    };
    return flags[nacionalidade] || '🌍';
  };

  const getTypeIcon = () => {
    return tipo === 'tripulante' ? '👨‍✈️' : '🧳';
  };

  return (
    <div className={`pessoa-card ${tipo}`}>
      <div className="pessoa-avatar">
        <img 
          src={pessoa.foto} 
          alt={pessoa.nome}
          className="avatar-image"
          onError={(e) => {
            e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(pessoa.nome)}&background=random&color=fff&size=80`;
          }}
        />
        <div className="pessoa-type-badge">
          {getTypeIcon()}
        </div>
      </div>
      
      <div className="pessoa-info">
        <h4 className="pessoa-name">{pessoa.nome}</h4>
        
        <div className="pessoa-details">
          <div className="detail-item">
            <span className="detail-label">Nacionalidade</span>
            <span className="detail-value">
              <span className="flag-icon">{getNacionalidadeFlag(pessoa.nacionalidade)}</span>
              {pessoa.nacionalidade}
            </span>
          </div>
          
          {pessoa.sid && (
            <div className="detail-item">
              <span className="detail-label">SID</span>
              <span className="detail-value sid">{pessoa.sid}</span>
            </div>
          )}
          
          <div className="detail-item">
            <span className="detail-label">Tipo</span>
            <span className={`detail-value type-badge ${tipo}`}>
              {tipo === 'tripulante' ? 'Tripulante' : 'Passageiro'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PessoaCard;