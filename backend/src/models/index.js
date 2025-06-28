class DUV {
  constructor(id, numero, dataViagem, navio, listaPessoas = []) {
    this.id = id;
    this.numero = numero;
    this.dataViagem = dataViagem;
    this.navio = navio;
    this.listaPessoas = listaPessoas;
  }

  static fromJSON(json) {
    return new DUV(
      json.id,
      json.numero,
      json.data_viagem,
      json.navio,
      json.lista_pessoas || []
    );
  }

  toJSON() {
    return {
      id: this.id,
      numero: this.numero,
      data_viagem: this.dataViagem,
      navio: this.navio,
      lista_pessoas: this.listaPessoas
    };
  }
}

class Navio {
  constructor(id, nome, bandeira, imagem) {
    this.id = id;
    this.nome = nome;
    this.bandeira = bandeira;
    this.imagem = imagem;
  }

  static fromJSON(json) {
    return new Navio(
      json.id,
      json.nome,
      json.bandeira,
      json.imagem
    );
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      bandeira: this.bandeira,
      imagem: this.imagem
    };
  }
}

class Pessoa {
  constructor(id, nome, tipo, nacionalidade, sid = null, foto) {
    this.id = id;
    this.nome = nome;
    this.tipo = tipo;
    this.nacionalidade = nacionalidade;
    this.sid = sid;
    this.foto = foto;
  }

  static fromJSON(json) {
    return new Pessoa(
      json.id,
      json.nome,
      json.tipo,
      json.nacionalidade,
      json.sid,
      json.foto
    );
  }

  toJSON() {
    return {
      id: this.id,
      nome: this.nome,
      tipo: this.tipo,
      nacionalidade: this.nacionalidade,
      sid: this.sid,
      foto: this.foto
    };
  }

  isTripulante() {
    return this.tipo === 'tripulante' && this.sid !== null;
  }

  isPassageiro() {
    return this.tipo === 'passageiro';
  }
}

module.exports = {
  DUV,
  Navio,
  Pessoa
};