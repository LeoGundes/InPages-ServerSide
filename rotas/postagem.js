const express = require('express');
const router = express.Router();
const { criarPostagem, listarPostagens, listarPostagensSeguidos, deletarPostagem, curtirPostagem, descurtirPostagem, editarPostagem } = require('../controllers/postagem');

// Criar nova postagem
router.post('/', criarPostagem);
// Listar todas as postagens
router.get('/', listarPostagens);
// Listar postagens dos seguidos (feed)
router.get('/feed/:email', listarPostagensSeguidos);

// ROTAS DE CURTIDA (mais específicas primeiro)
// Curtir uma postagem
router.post('/:id/curtir', curtirPostagem);
// Descurtir uma postagem
router.delete('/:id/curtir', descurtirPostagem);

// ROTA DE EDITAR
// Editar uma postagem
router.put('/:id', editarPostagem);

// ROTA DE DELETAR (mais genérica por último)
// Deletar uma postagem
router.delete('/:id/:email', deletarPostagem);

module.exports = router;
