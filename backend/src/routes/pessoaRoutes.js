const express = require('express');
const { body, param, validationResult } = require('express-validator');
const dataRepository = require('../repositories/dataRepository');

const router = express.Router();

// Middleware de validação
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: 'Dados inválidos',
      details: errors.array()
    });
  }
  next();
};

// GET /api/pessoas - Listar todas as pessoas
router.get('/', (req, res) => {
  try {
    const pessoas = dataRepository.getAllPessoas();
    const tripulantes = pessoas.filter(p => p.tipo === 'tripulante');
    const passageiros = pessoas.filter(p => p.tipo === 'passageiro');
    
    res.json({
      success: true,
      data: pessoas,
      summary: {
        total: pessoas.length,
        tripulantes: tripulantes.length,
        passageiros: passageiros.length
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// GET /api/pessoas/:id - Buscar pessoa por ID
router.get('/:id', [
  param('id').notEmpty().withMessage('ID é obrigatório')
], handleValidationErrors, (req, res) => {
  try {
    const { id } = req.params;
    const pessoa = dataRepository.getPessoaById(id);
    
    if (!pessoa) {
      return res.status(404).json({
        error: 'Pessoa não encontrada',
        message: `Pessoa com ID ${id} não existe`
      });
    }

    res.json({
      success: true,
      data: pessoa
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// POST /api/pessoas - Criar nova pessoa
router.post('/', [
  body('nome').notEmpty().withMessage('Nome é obrigatório'),
  body('tipo').isIn(['passageiro', 'tripulante']).withMessage('Tipo deve ser "passageiro" ou "tripulante"'),
  body('nacionalidade').notEmpty().withMessage('Nacionalidade é obrigatória'),
  body('foto').optional().isURL().withMessage('Foto deve ser uma URL válida'),
  body('sid').optional().matches(/^SID\d+$/).withMessage('SID deve ter formato SIDxxxxx')
], handleValidationErrors, (req, res) => {
  try {
    const newPessoa = dataRepository.createPessoa(req.body);
    res.status(201).json({
      success: true,
      data: newPessoa,
      message: 'Pessoa criada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// PUT /api/pessoas/:id - Atualizar pessoa
router.put('/:id', [
  param('id').notEmpty().withMessage('ID é obrigatório'),
  body('nome').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('tipo').optional().isIn(['passageiro', 'tripulante']).withMessage('Tipo deve ser "passageiro" ou "tripulante"'),
  body('nacionalidade').optional().notEmpty().withMessage('Nacionalidade não pode estar vazia'),
  body('foto').optional().isURL().withMessage('Foto deve ser uma URL válida'),
  body('sid').optional().matches(/^SID\d+$/).withMessage('SID deve ter formato SIDxxxxx')
], handleValidationErrors, (req, res) => {
  try {
    const { id } = req.params;
    const updatedPessoa = dataRepository.updatePessoa(id, req.body);
    
    if (!updatedPessoa) {
      return res.status(404).json({
        error: 'Pessoa não encontrada',
        message: `Pessoa com ID ${id} não existe`
      });
    }

    res.json({
      success: true,
      data: updatedPessoa,
      message: 'Pessoa atualizada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// DELETE /api/pessoas/:id - Deletar pessoa
router.delete('/:id', [
  param('id').notEmpty().withMessage('ID é obrigatório')
], handleValidationErrors, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = dataRepository.deletePessoa(id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Pessoa não encontrada',
        message: `Pessoa com ID ${id} não existe`
      });
    }

    res.json({
      success: true,
      message: 'Pessoa deletada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// GET /api/pessoas/tipo/:tipo - Filtrar pessoas por tipo
router.get('/tipo/:tipo', [
  param('tipo').isIn(['passageiro', 'tripulante']).withMessage('Tipo deve ser "passageiro" ou "tripulante"')
], handleValidationErrors, (req, res) => {
  try {
    const { tipo } = req.params;
    const pessoas = dataRepository.getAllPessoas();
    const pessoasFiltradas = pessoas.filter(p => p.tipo === tipo);
    
    res.json({
      success: true,
      data: pessoasFiltradas,
      total: pessoasFiltradas.length,
      tipo: tipo
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

module.exports = router;