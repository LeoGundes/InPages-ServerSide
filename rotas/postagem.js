const express = require('express');
const router = express.Router();
const { criarPostagem, listarPostagens, listarPostagensSeguidos, deletarPostagem } = require('../controllers/postagem');

// Criar nova postagem
router.post('/', criarPostagem);
// Listar todas as postagens
router.get('/', listarPostagens);
// Listar postagens dos seguidos (feed)
router.get('/feed/:email', listarPostagensSeguidos);
// Deletar uma postagem
router.delete('/:id/:email', deletarPostagem);

module.exports = router;
