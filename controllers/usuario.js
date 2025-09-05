// Listar todos os usuários
function listarUsuarios(req, res) {
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
    // Não retornar senha
    const usuariosSemSenha = usuarios.map(u => {
        const { senha, ...rest } = u;
        return rest;
    });
    res.status(200).json(usuariosSemSenha);
}
// Seguir usuário
function seguirUsuario(req, res) {
    const { email, seguirEmail } = req.body;
    if (!email || !seguirEmail) {
        return res.status(400).send('Informe seu email e o email do usuário a seguir');
    }
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
    const usuario = usuarios.find(u => u.email === email);
    const usuarioASeguir = usuarios.find(u => u.email === seguirEmail);
    if (!usuario || !usuarioASeguir) return res.status(404).send('Usuário não encontrado');
    usuario.seguidos = usuario.seguidos || [];
    usuarioASeguir.seguidores = usuarioASeguir.seguidores || [];
    if (!usuario.seguidos.includes(seguirEmail)) usuario.seguidos.push(seguirEmail);
    if (!usuarioASeguir.seguidores.includes(email)) usuarioASeguir.seguidores.push(email);
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
    
    // Retorna o usuário atualizado sem a senha
    const { senha, ...usuarioAtualizado } = usuario;
    res.status(200).json({
        message: 'Agora você está seguindo este usuário',
        usuario: usuarioAtualizado
    });
}

// Deixar de seguir usuário
function deixarDeSeguirUsuario(req, res) {
    const { email, seguirEmail } = req.body;
    if (!email || !seguirEmail) {
        return res.status(400).send('Informe seu email e o email do usuário a deixar de seguir');
    }
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
    const usuario = usuarios.find(u => u.email === email);
    const usuarioASeguir = usuarios.find(u => u.email === seguirEmail);
    if (!usuario || !usuarioASeguir) return res.status(404).send('Usuário não encontrado');
    usuario.seguidos = usuario.seguidos || [];
    usuarioASeguir.seguidores = usuarioASeguir.seguidores || [];
    usuario.seguidos = usuario.seguidos.filter(e => e !== seguirEmail);
    usuarioASeguir.seguidores = usuarioASeguir.seguidores.filter(e => e !== email);
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
    
    // Retorna o usuário atualizado sem a senha
    const { senha, ...usuarioAtualizado } = usuario;
    res.status(200).json({
        message: 'Você deixou de seguir este usuário',
        usuario: usuarioAtualizado
    });
}
const fs = require('fs');
const path = require('path');
const usuariosPath = path.resolve(__dirname, '../usuarios.json');
const livrosPath = path.resolve(__dirname, '../livros.json');

function cadastrarUsuario(req, res) {
    const { nome, email, senha } = req.body;
    if (!nome || !email || !senha) {
        return res.status(400).send('Preencha todos os campos');
    }
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
    if (usuarios.find(u => u.email === email)) {
        return res.status(409).send('E-mail já cadastrado');
    }
    usuarios.push({ nome, email, senha });
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
    res.status(201).send('Usuário cadastrado com sucesso');
}

function loginUsuario(req, res) {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).send('Preencha todos os campos');
    }
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    if (!usuario) {
        return res.status(401).send('E-mail ou senha inválidos');
    }
    res.status(200).json({ mensagem: 'Login realizado com sucesso', nome: usuario.nome, email: usuario.email });
}

function editarUsuario(req, res) {
    const { email } = req.params;
    const { nome } = req.body;
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) return res.status(404).send('Usuário não encontrado');
    usuario.nome = nome;
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
    res.status(200).send('Perfil atualizado');
}

function getFavoritosUsuario(req, res) {
    const { email } = req.params;
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) return res.status(404).send('Usuário não encontrado');
    res.status(200).json(usuario.favoritos || []);
}

function addFavoritoUsuario(req, res) {
    const { email, id } = req.params;
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) return res.status(404).send('Usuário não encontrado');
    const livros = JSON.parse(fs.readFileSync(livrosPath));
    const livro = livros.find(l => l.id === id);
    if (!livro) return res.status(404).send('Livro não encontrado');
    usuario.favoritos = usuario.favoritos || [];
    if (usuario.favoritos.find(fav => fav.id === id)) {
        return res.status(409).send('Livro já está nos favoritos');
    }
    usuario.favoritos.push(livro);
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
    res.status(201).send('Favorito adicionado');
}

function removeFavoritoUsuario(req, res) {
    const { email, id } = req.params;
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) return res.status(404).send('Usuário não encontrado');
    usuario.favoritos = (usuario.favoritos || []).filter(fav => fav.id !== id);
    fs.writeFileSync(usuariosPath, JSON.stringify(usuarios, null, 2));
    res.status(200).send('Favorito removido');
}

// Buscar seguidores de um usuário
function getSeguidores(req, res) {
    const { email } = req.params;
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) return res.status(404).send('Usuário não encontrado');
    
    const seguidores = usuario.seguidores || [];
    const seguidoresDetalhados = usuarios
        .filter(u => seguidores.includes(u.email))
        .map(u => ({ nome: u.nome, email: u.email }));
    
    res.status(200).json(seguidoresDetalhados);
}

// Buscar usuários que um usuário está seguindo
function getSeguidos(req, res) {
    const { email } = req.params;
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) return res.status(404).send('Usuário não encontrado');
    
    const seguidos = usuario.seguidos || [];
    const seguidosDetalhados = usuarios
        .filter(u => seguidos.includes(u.email))
        .map(u => ({ nome: u.nome, email: u.email }));
    
    res.status(200).json(seguidosDetalhados);
}

module.exports = {
    cadastrarUsuario,
    loginUsuario,
    editarUsuario,
    getFavoritosUsuario,
    addFavoritoUsuario,
    removeFavoritoUsuario,
    seguirUsuario,
    deixarDeSeguirUsuario,
    listarUsuarios,
    getSeguidores,
    getSeguidos
};