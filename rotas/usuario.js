const express = require('express');
const router = express.Router();
const { cadastrarUsuario, loginUsuario, editarUsuario, addFavoritoUsuario, getFavoritosUsuario, removeFavoritoUsuario, seguirUsuario, deixarDeSeguirUsuario, listarUsuarios, getSeguidores, getSeguidos } = require('../controllers/usuario');
// Listar todos os usuários
router.get('/', listarUsuarios);
// Seguir usuário
router.post('/seguir', seguirUsuario);
// Deixar de seguir usuário
router.post('/deixar-de-seguir', deixarDeSeguirUsuario);
// Cadastro de usuário
router.post('/', cadastrarUsuario);
// Login de usuário
router.post('/login', loginUsuario);
// Edição de perfil
router.put('/:email', editarUsuario);

router.get('/:email/favoritos', getFavoritosUsuario);
router.post('/:email/favoritos/:id', addFavoritoUsuario);
router.delete('/:email/favoritos/:id', removeFavoritoUsuario);

// Rotas para seguidores e seguidos
router.get('/:email/seguidores', getSeguidores);
router.get('/:email/seguidos', getSeguidos);

module.exports = router;