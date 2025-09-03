const { Router } = require('express');
const livrosLidosController = require('../controllers/livrosLidos');

const router = Router();

// POST /livros-lidos - Adicionar livro como lido
router.post('/', livrosLidosController.adicionarLivroLido);

// GET /livros-lidos/:usuario - Buscar livros lidos por usuário
router.get('/:usuario', livrosLidosController.buscarLivrosLidos);

// DELETE /livros-lidos/:id/:usuario - Remover livro da lista de lidos
router.delete('/:id/:usuario', livrosLidosController.removerLivroLido);

// GET /livros-lidos - Obter todos os livros lidos (admin)
router.get('/', livrosLidosController.obterTodosLivrosLidos);

module.exports = router;
