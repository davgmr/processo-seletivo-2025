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

// GET /api/navios - Listar todos os navios
router.get('/', (req, res) => {
  try {
    const navios = dataRepository.getAllNavios();
    res.json({
      success: true,
      data: navios,
      total: navios.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// GET /api/navios/:id - Buscar navio por ID
router.get('/:id', [
  param('id').notEmpty().withMessage('ID é obrigatório')
], handleValidationErrors, (req, res) => {
  try {
    const { id } = req.params;
    const navio = dataRepository.getNavioById(id);
    
    if (!navio) {
      return res.status(404).json({
        error: 'Navio não encontrado',
        message: `Navio com ID ${id} não existe`
      });
    }

    res.json({
      success: true,
      data: navio
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// POST /api/navios - Criar novo navio
router.post('/', [
  body('nome').notEmpty().withMessage('Nome do navio é obrigatório'),
  body('bandeira').notEmpty().withMessage('Bandeira é obrigatória'),
  body('imagem').optional().isURL().withMessage('Imagem deve ser uma URL válida')
], handleValidationErrors, (req, res) => {
  try {
    const newNavio = dataRepository.createNavio(req.body);
    res.status(201).json({
      success: true,
      data: newNavio,
      message: 'Navio criado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// PUT /api/navios/:id - Atualizar navio
router.put('/:id', [
  param('id').notEmpty().withMessage('ID é obrigatório'),
  body('nome').optional().notEmpty().withMessage('Nome não pode estar vazio'),
  body('bandeira').optional().notEmpty().withMessage('Bandeira não pode estar vazia'),
  body('imagem').optional().isURL().withMessage('Imagem deve ser uma URL válida')
], handleValidationErrors, (req, res) => {
  try {
    const { id } = req.params;
    const updatedNavio = dataRepository.updateNavio(id, req.body);
    
    if (!updatedNavio) {
      return res.status(404).json({
        error: 'Navio não encontrado',
        message: `Navio com ID ${id} não existe`
      });
    }

    res.json({
      success: true,
      data: updatedNavio,
      message: 'Navio atualizado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// DELETE /api/navios/:id - Deletar navio
router.delete('/:id', [
  param('id').notEmpty().withMessage('ID é obrigatório')
], handleValidationErrors, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = dataRepository.deleteNavio(id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'Navio não encontrado',
        message: `Navio com ID ${id} não existe`
      });
    }

    res.json({
      success: true,
      message: 'Navio deletado com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

module.exports = router;