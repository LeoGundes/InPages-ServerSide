const fs = require('fs');
const path = require('path');
const postagensPath = path.resolve(__dirname, '../postagens.json');
const usuariosPath = path.resolve(__dirname, '../usuarios.json');

// Criar uma nova postagem
function criarPostagem(req, res) {
    const { email, conteudo } = req.body;
    if (!email || !conteudo) {
        return res.status(400).send('Informe email e conteúdo da postagem');
    }
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) return res.status(404).send('Usuário não encontrado');
    const postagens = JSON.parse(fs.readFileSync(postagensPath) || '[]');
    const novaPostagem = {
        id: Date.now().toString(),
        email,
        nome: usuario.nome,
        conteudo,
        data: new Date().toISOString()
    };
    postagens.unshift(novaPostagem);
    fs.writeFileSync(postagensPath, JSON.stringify(postagens, null, 2));
    res.status(201).json(novaPostagem);
}

// Listar postagens de todos os usuários
function listarPostagens(req, res) {
    const postagens = JSON.parse(fs.readFileSync(postagensPath) || '[]');
    res.status(200).json(postagens);
}

// Listar postagens de usuários seguidos
function listarPostagensSeguidos(req, res) {
    const { email } = req.params;
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
    const usuario = usuarios.find(u => u.email === email);
    if (!usuario) return res.status(404).send('Usuário não encontrado');
    const postagens = JSON.parse(fs.readFileSync(postagensPath) || '[]');
    const seguidos = usuario.seguidos || [];
    const feed = postagens.filter(p => seguidos.includes(p.email) || p.email === email);
    res.status(200).json(feed);
}

// Deletar uma postagem
function deletarPostagem(req, res) {
    const { id, email } = req.params;
    let postagens = JSON.parse(fs.readFileSync(postagensPath) || '[]');
    const postagem = postagens.find(p => p.id === id);
    if (!postagem) return res.status(404).send('Postagem não encontrada');
    if (postagem.email !== email) return res.status(403).send('Você só pode deletar suas próprias postagens');
    postagens = postagens.filter(p => p.id !== id);
    fs.writeFileSync(postagensPath, JSON.stringify(postagens, null, 2));
    res.status(200).send('Postagem deletada');
}

module.exports = {
    criarPostagem,
    listarPostagens,
    listarPostagensSeguidos,
    deletarPostagem
};
