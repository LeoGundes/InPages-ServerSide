const fs = require('fs');
const path = require('path');

const usuariosPath = path.resolve(__dirname, '../usuarios.json');

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
    const usuarios = JSON.parse(fs.readFileSync(usuariosPath));
    const usuario = usuarios.find(u => u.email === email && u.senha === senha);
    if (!usuario) {
        return res.status(401).send('E-mail ou senha inválidos');
    }
    res.status(200).json({ mensagem: 'Login realizado com sucesso', nome: usuario.nome, email: usuario.email });
}

module.exports = { cadastrarUsuario, loginUsuario };