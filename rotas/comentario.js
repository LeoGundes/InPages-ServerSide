const express = require('express');
const router = express.Router();
const comentarioController = require('../controllers/comentario');

// Listar comentários de uma postagem
router.get('/postagem/:postagemId', comentarioController.listarComentarios);

// Adicionar comentário
router.post('/', comentarioController.adicionarComentario);

// Editar comentário
router.put('/:id', comentarioController.editarComentario);

// Deletar comentário
router.delete('/:id', comentarioController.deletarComentario);

module.exports = router;
