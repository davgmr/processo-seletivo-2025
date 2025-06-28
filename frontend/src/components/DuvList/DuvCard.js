import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const DuvCard = ({ duv }) => {
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: ptBR });
    } catch {
      return dateString;
    }
  };

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
    <div className="duv-card card">
      <div className="duv-card-header">
        <div className="duv-number">
          <span className="duv-badge">{duv.numero}</span>
        </div>
        <div className="duv-date">
          📅 {formatDate(duv.data_viagem)}
        </div>
      </div>

      <div className="duv-ship-info">
        <div className="ship-image-container">
          <img 
            src={duv.navio.imagem} 
            alt={duv.navio.nome}
            className="ship-image"
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x200/e5e7eb/6b7280?text=Navio';
            }}
          />
        </div>
        
        <div className="ship-details">
          <h3 className="ship-name">{duv.navio.nome}</h3>
          <div className="ship-flag">
            <span className="flag-icon">{getBandeiraFlag(duv.navio.bandeira)}</span>
            <span className="flag-text">{duv.navio.bandeira}</span>
          </div>
        </div>
      </div>

      <div className="duv-stats">
        <div className="stat">
          <span className="stat-number">{duv.lista_pessoas?.length || 0}</span>
          <span className="stat-label">
            {duv.lista_pessoas?.length === 1 ? 'Pessoa' : 'Pessoas'}
          </span>
        </div>
      </div>

      <div className="duv-actions">
        <Link to={`/duv/${duv.id}`} className="btn btn-primary">
          Ver Detalhes →
        </Link>
      </div>
    </div>
  );
};

export default DuvCard;