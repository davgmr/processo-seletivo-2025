const { DUV, Navio, Pessoa } = require('../models');
const mockData = require('../data/mockData.json');

class DataRepository {
  constructor() {
    this.duvs = [];
    this.navios = [];
    this.pessoas = [];
    this.loadMockData();
  }

  loadMockData() {
    // Carregar dados do mock
    this.duvs = mockData.duvs.map(duv => DUV.fromJSON(duv));
    this.pessoas = mockData.pessoas.map(pessoa => Pessoa.fromJSON(pessoa));
    
    // Extrair navios únicos das DUVs
    const naviosMap = new Map();
    mockData.duvs.forEach(duv => {
      if (!naviosMap.has(duv.navio.id)) {
        naviosMap.set(duv.navio.id, Navio.fromJSON(duv.navio));
      }
    });
    this.navios = Array.from(naviosMap.values());
  }

  // DUV CRUD
  getAllDuvs() {
    return this.duvs.map(duv => duv.toJSON());
  }

  getDuvById(id) {
    const duv = this.duvs.find(d => d.id === id);
    if (!duv) return null;

    const duvData = duv.toJSON();
    // Incluir dados completos das pessoas
    duvData.pessoas_completas = duv.listaPessoas.map(pessoaId => {
      const pessoa = this.pessoas.find(p => p.id === pessoaId);
      return pessoa ? pessoa.toJSON() : null;
    }).filter(Boolean);

    return duvData;
  }

  createDuv(duvData) {
    const newDuv = new DUV(
      duvData.id || this.generateId(),
      duvData.numero,
      duvData.data_viagem,
      duvData.navio,
      duvData.lista_pessoas || []
    );
    this.duvs.push(newDuv);
    return newDuv.toJSON();
  }

  updateDuv(id, duvData) {
    const index = this.duvs.findIndex(d => d.id === id);
    if (index === -1) return null;

    this.duvs[index] = new DUV(
      id,
      duvData.numero || this.duvs[index].numero,
      duvData.data_viagem || this.duvs[index].dataViagem,
      duvData.navio || this.duvs[index].navio,
      duvData.lista_pessoas || this.duvs[index].listaPessoas
    );

    return this.duvs[index].toJSON();
  }

  deleteDuv(id) {
    const index = this.duvs.findIndex(d => d.id === id);
    if (index === -1) return false;
    
    this.duvs.splice(index, 1);
    return true;
  }

  // NAVIO CRUD
  getAllNavios() {
    return this.navios.map(navio => navio.toJSON());
  }

  getNavioById(id) {
    const navio = this.navios.find(n => n.id === id);
    return navio ? navio.toJSON() : null;
  }

  createNavio(navioData) {
    const newNavio = new Navio(
      navioData.id || this.generateId(),
      navioData.nome,
      navioData.bandeira,
      navioData.imagem
    );
    this.navios.push(newNavio);
    return newNavio.toJSON();
  }

  updateNavio(id, navioData) {
    const index = this.navios.findIndex(n => n.id === id);
    if (index === -1) return null;

    this.navios[index] = new Navio(
      id,
      navioData.nome || this.navios[index].nome,
      navioData.bandeira || this.navios[index].bandeira,
      navioData.imagem || this.navios[index].imagem
    );

    return this.navios[index].toJSON();
  }

  deleteNavio(id) {
    const index = this.navios.findIndex(n => n.id === id);
    if (index === -1) return false;
    
    this.navios.splice(index, 1);
    return true;
  }

  // PESSOA CRUD
  getAllPessoas() {
    return this.pessoas.map(pessoa => pessoa.toJSON());
  }

  getPessoaById(id) {
    const pessoa = this.pessoas.find(p => p.id === id);
    return pessoa ? pessoa.toJSON() : null;
  }

  createPessoa(pessoaData) {
    const newPessoa = new Pessoa(
      pessoaData.id || this.generateId(),
      pessoaData.nome,
      pessoaData.tipo,
      pessoaData.nacionalidade,
      pessoaData.sid,
      pessoaData.foto
    );
    this.pessoas.push(newPessoa);
    return newPessoa.toJSON();
  }

  updatePessoa(id, pessoaData) {
    const index = this.pessoas.findIndex(p => p.id === id);
    if (index === -1) return null;

    this.pessoas[index] = new Pessoa(
      id,
      pessoaData.nome || this.pessoas[index].nome,
      pessoaData.tipo || this.pessoas[index].tipo,
      pessoaData.nacionalidade || this.pessoas[index].nacionalidade,
      pessoaData.sid !== undefined ? pessoaData.sid : this.pessoas[index].sid,
      pessoaData.foto || this.pessoas[index].foto
    );

    return this.pessoas[index].toJSON();
  }

  deletePessoa(id) {
    const index = this.pessoas.findIndex(p => p.id === id);
    if (index === -1) return false;
    
    this.pessoas.splice(index, 1);
    return true;
  }

  // Métodos auxiliares
  generateId() {
    return require('uuid').v4();
  }

  getPassageirosByDuv(duvId) {
    const duv = this.duvs.find(d => d.id === duvId);
    if (!duv) return [];

    return duv.listaPessoas
      .map(pessoaId => this.pessoas.find(p => p.id === pessoaId))
      .filter(Boolean)
      .map(pessoa => pessoa.toJSON());
  }

  getTripulantesByDuv(duvId) {
    const passageiros = this.getPassageirosByDuv(duvId);
    return passageiros.filter(p => p.tipo === 'tripulante');
  }

  getPassageirosPorTipo(duvId) {
    const pessoas = this.getPassageirosByDuv(duvId);
    return {
      passageiros: pessoas.filter(p => p.tipo === 'passageiro'),
      tripulantes: pessoas.filter(p => p.tipo === 'tripulante')
    };
  }
}

// Singleton instance
const dataRepository = new DataRepository();

module.exports = dataRepository;