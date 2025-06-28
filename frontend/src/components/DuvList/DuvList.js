import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { duvService, useApiError } from '../../services/apiService';
import DuvCard from './DuvCard';
import './DuvList.css';

const DuvList = () => {
  const [duvs, setDuvs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { handleError } = useApiError();

  useEffect(() => {
    loadDuvs();
  }, []);

  const loadDuvs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await duvService.getAll();
      setDuvs(response.data || []);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const filteredDuvs = duvs.filter(duv =>
    duv.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
    duv.navio.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    duv.navio.bandeira.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="duv-list">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando DUVs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="duv-list">
      <div className="duv-list-header">
        <div className="title-section">
          <h1>Documentos Únicos Virtuais</h1>
          <p className="subtitle">
            {duvs.length} {duvs.length === 1 ? 'documento encontrado' : 'documentos encontrados'}
          </p>
        </div>

        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar por número, navio ou bandeira..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>
          </div>
        </div>
      </div>

      {error && (
        <div className="error">
          <p>❌ {error}</p>
          <button onClick={loadDuvs} className="btn btn-secondary">
            Tentar novamente
          </button>
        </div>
      )}

      {!error && filteredDuvs.length === 0 && searchTerm && (
        <div className="no-results">
          <p>Nenhuma DUV encontrada para "{searchTerm}"</p>
        </div>
      )}

      {!error && filteredDuvs.length === 0 && !searchTerm && duvs.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>Nenhuma DUV cadastrada</h3>
          <p>Ainda não há documentos únicos virtuais no sistema.</p>
        </div>
      )}

      <div className="duv-grid">
        {filteredDuvs.map(duv => (
          <DuvCard key={duv.id} duv={duv} />
        ))}
      </div>
    </div>
  );
};

export default DuvList;