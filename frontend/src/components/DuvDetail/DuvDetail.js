import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { duvService, useApiError } from '../../services/apiService';
import NavioInfo from './NavioInfo';
import PessoasList from './PessoasList';
import './DuvDetail.css';

const DuvDetail = () => {
  const { id } = useParams();
  const [duv, setDuv] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { handleError } = useApiError();

  useEffect(() => {
    loadDuvDetail();
  }, [id]);

  const loadDuvDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await duvService.getById(id);
      setDuv(response.data);
    } catch (err) {
      setError(handleError(err));
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="duv-detail">
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Carregando detalhes da DUV...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="duv-detail">
        <div className="error">
          <h2>❌ Erro ao carregar DUV</h2>
          <p>{error}</p>
          <div className="error-actions">
            <button onClick={loadDuvDetail} className="btn btn-primary">
              Tentar novamente
            </button>
            <Link to="/" className="btn btn-secondary">
              Voltar à lista
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!duv) {
    return (
      <div className="duv-detail">
        <div className="not-found">
          <h2>DUV não encontrada</h2>
          <p>A DUV solicitada não existe ou foi removida.</p>
          <Link to="/" className="btn btn-primary">
            Voltar à lista
          </Link>
        </div>
      </div>
    );
  }

  const totalPessoas = (duv.passageiros?.length || 0) + (duv.tripulantes?.length || 0);

  return (
    <div className="duv-detail">
      {/* Header da DUV */}
      <div className="duv-header card">
        <div className="duv-header-content">
          <div className="duv-title-section">
            <h1 className="duv-title">{duv.numero}</h1>
            <p className="duv-subtitle">Documento Único Virtual</p>
          </div>
          
          <div className="duv-meta">
            <div className="meta-item">
              <span className="meta-label">Data da Viagem</span>
              <span className="meta-value">📅 {formatDate(duv.data_viagem)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Total de Pessoas</span>
              <span className="meta-value">👥 {totalPessoas}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Informações do Navio */}
      <NavioInfo navio={duv.navio} />

      {/* Lista de Pessoas */}
      <div className="pessoas-section">
        <h2 className="section-title">Pessoas a Bordo</h2>
        
        <div className="pessoas-stats">
          <div className="stat-card">
            <span className="stat-number">{duv.passageiros?.length || 0}</span>
            <span className="stat-label">Passageiros</span>
          </div>
          <div className="stat-card">
            <span className="stat-number">{duv.tripulantes?.length || 0}</span>
            <span className="stat-label">Tripulantes</span>
          </div>
          <div className="stat-card total">
            <span className="stat-number">{totalPessoas}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>

        <div className="pessoas-lists">
          {duv.passageiros && duv.passageiros.length > 0 && (
            <PessoasList 
              title="Passageiros" 
              pessoas={duv.passageiros} 
              tipo="passageiro"
            />
          )}
          
          {duv.tripulantes && duv.tripulantes.length > 0 && (
            <PessoasList 
              title="Tripulantes" 
              pessoas={duv.tripulantes} 
              tipo="tripulante"
            />
          )}
        </div>

        {totalPessoas === 0 && (
          <div className="empty-pessoas">
            <p>Nenhuma pessoa cadastrada para esta viagem.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DuvDetail;