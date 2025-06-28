import React from 'react';
import PessoaCard from './PessoaCard';

const PessoasList = ({ title, pessoas, tipo }) => {
  const getIcon = () => {
    return tipo === 'tripulante' ? '👨‍✈️' : '🧳';
  };

  const getTypeColor = () => {
    return tipo === 'tripulante' ? 'tripulante' : 'passageiro';
  };

  return (
    <div className={`pessoas-list ${getTypeColor()}`}>
      <div className="pessoas-list-header">
        <h3 className="pessoas-list-title">
          <span className="title-icon">{getIcon()}</span>
          {title}
          <span className="count-badge">{pessoas.length}</span>
        </h3>
      </div>
      
      <div className="pessoas-grid">
        {pessoas.map(pessoa => (
          <PessoaCard 
            key={pessoa.id} 
            pessoa={pessoa} 
            tipo={tipo}
          />
        ))}
      </div>
    </div>
  );
};

export default PessoasList;