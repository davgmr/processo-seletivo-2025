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

// GET /api/duvs - Listar todas as DUVs
router.get('/', (req, res) => {
  try {
    const duvs = dataRepository.getAllDuvs();
    res.json({
      success: true,
      data: duvs,
      total: duvs.length
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// GET /api/duvs/:id - Buscar DUV por ID com passageiros
router.get('/:id', [
  param('id').notEmpty().withMessage('ID é obrigatório')
], handleValidationErrors, (req, res) => {
  try {
    const { id } = req.params;
    const duv = dataRepository.getDuvById(id);
    
    if (!duv) {
      return res.status(404).json({
        error: 'DUV não encontrada',
        message: `DUV com ID ${id} não existe`
      });
    }

    // Separar passageiros por tipo
    const pessoasPorTipo = dataRepository.getPassageirosPorTipo(id);
    
    res.json({
      success: true,
      data: {
        ...duv,
        passageiros: pessoasPorTipo.passageiros,
        tripulantes: pessoasPorTipo.tripulantes
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// POST /api/duvs - Criar nova DUV
router.post('/', [
  body('numero').notEmpty().withMessage('Número da DUV é obrigatório'),
  body('data_viagem').isISO8601().withMessage('Data da viagem deve estar no formato ISO 8601'),
  body('navio').isObject().withMessage('Dados do navio são obrigatórios'),
  body('navio.id').notEmpty().withMessage('ID do navio é obrigatório'),
  body('navio.nome').notEmpty().withMessage('Nome do navio é obrigatório'),
  body('navio.bandeira').notEmpty().withMessage('Bandeira do navio é obrigatória')
], handleValidationErrors, (req, res) => {
  try {
    const newDuv = dataRepository.createDuv(req.body);
    res.status(201).json({
      success: true,
      data: newDuv,
      message: 'DUV criada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// PUT /api/duvs/:id - Atualizar DUV
router.put('/:id', [
  param('id').notEmpty().withMessage('ID é obrigatório'),
  body('numero').optional().notEmpty().withMessage('Número da DUV não pode estar vazio'),
  body('data_viagem').optional().isISO8601().withMessage('Data da viagem deve estar no formato ISO 8601')
], handleValidationErrors, (req, res) => {
  try {
    const { id } = req.params;
    const updatedDuv = dataRepository.updateDuv(id, req.body);
    
    if (!updatedDuv) {
      return res.status(404).json({
        error: 'DUV não encontrada',
        message: `DUV com ID ${id} não existe`
      });
    }

    res.json({
      success: true,
      data: updatedDuv,
      message: 'DUV atualizada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// DELETE /api/duvs/:id - Deletar DUV
router.delete('/:id', [
  param('id').notEmpty().withMessage('ID é obrigatório')
], handleValidationErrors, (req, res) => {
  try {
    const { id } = req.params;
    const deleted = dataRepository.deleteDuv(id);
    
    if (!deleted) {
      return res.status(404).json({
        error: 'DUV não encontrada',
        message: `DUV com ID ${id} não existe`
      });
    }

    res.json({
      success: true,
      message: 'DUV deletada com sucesso'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

// GET /api/duvs/:id/passageiros - Listar passageiros de uma DUV
router.get('/:id/passageiros', [
  param('id').notEmpty().withMessage('ID é obrigatório')
], handleValidationErrors, (req, res) => {
  try {
    const { id } = req.params;
    const pessoasPorTipo = dataRepository.getPassageirosPorTipo(id);
    
    if (!pessoasPorTipo.passageiros.length && !pessoasPorTipo.tripulantes.length) {
      return res.status(404).json({
        error: 'DUV não encontrada ou sem passageiros',
        message: `Nenhum passageiro encontrado para a DUV ${id}`
      });
    }

    res.json({
      success: true,
      data: pessoasPorTipo,
      total: {
        passageiros: pessoasPorTipo.passageiros.length,
        tripulantes: pessoasPorTipo.tripulantes.length,
        total: pessoasPorTipo.passageiros.length + pessoasPorTipo.tripulantes.length
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro interno do servidor',
      message: error.message
    });
  }
});

module.exports = router;