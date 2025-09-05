const fs = require('fs');
const path = require('path');
const postagensPath = path.resolve(__dirname, '../postagens.json');
const usuariosPath = path.resolve(__dirname, '../usuarios.json');

// Criar uma nova postagem
function criarPostagem(req, res) {
    const { email, conteudo, tipo, livro, nota, capaLivro } = req.body;
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
        data: new Date().toISOString(),
        tipo: tipo || 'postagem', // 'postagem' ou 'review'
        ...(tipo === 'review' && { livro, nota, capaLivro }) // Adiciona campos de review se for review
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
    
    console.log('Deletar postagem - ID:', id, 'Email:', email);
    
    let postagens = JSON.parse(fs.readFileSync(postagensPath) || '[]');
    const postagem = postagens.find(p => p.id === id);
    
    console.log('Postagem encontrada:', postagem);
    
    if (!postagem) {
        console.log('Postagem não encontrada');
        return res.status(404).send('Postagem não encontrada');
    }
    
    console.log('Comparando emails - Postagem:', postagem.email, 'Requisição:', email);
    
    if (postagem.email !== email) {
        console.log('Email não confere');
        return res.status(403).send('Você só pode deletar suas próprias postagens');
    }
    
    postagens = postagens.filter(p => p.id !== id);
    fs.writeFileSync(postagensPath, JSON.stringify(postagens, null, 2));
    
    console.log('Postagem deletada com sucesso');
    res.status(200).send('Postagem deletada');
}

// Curtir uma postagem
function curtirPostagem(req, res) {
    const { id } = req.params;
    const { email } = req.body;
    
    console.log('Curtir - ID:', id, 'Email:', email, 'Body:', req.body);
    
    if (!email) {
        return res.status(400).send('Email é obrigatório');
    }
    
    let postagens = JSON.parse(fs.readFileSync(postagensPath) || '[]');
    const postagemIndex = postagens.findIndex(p => p.id === id);
    
    if (postagemIndex === -1) {
        return res.status(404).send('Postagem não encontrada');
    }
    
    // Inicializa array de curtidas se não existir
    if (!postagens[postagemIndex].curtidas) {
        postagens[postagemIndex].curtidas = [];
    }
    
    // Verifica se o usuário já curtiu
    const jaCurtiu = postagens[postagemIndex].curtidas.includes(email);
    
    if (jaCurtiu) {
        return res.status(400).send('Você já curtiu esta postagem');
    }
    
    // Adiciona curtida
    postagens[postagemIndex].curtidas.push(email);
    
    fs.writeFileSync(postagensPath, JSON.stringify(postagens, null, 2));
    res.status(200).json({
        message: 'Postagem curtida',
        curtidas: postagens[postagemIndex].curtidas.length
    });
}

// Descurtir uma postagem
function descurtirPostagem(req, res) {
    const { id } = req.params;
    // Aceita email tanto do body quanto de query parameter
    const email = req.body.email || req.query.email;
    
    console.log('Descurtir - ID:', id, 'Email:', email, 'Body:', req.body, 'Query:', req.query);
    
    if (!email) {
        return res.status(400).send('Email é obrigatório');
    }
    
    let postagens = JSON.parse(fs.readFileSync(postagensPath) || '[]');
    const postagemIndex = postagens.findIndex(p => p.id === id);
    
    if (postagemIndex === -1) {
        return res.status(404).send('Postagem não encontrada');
    }
    
    // Inicializa array de curtidas se não existir
    if (!postagens[postagemIndex].curtidas) {
        postagens[postagemIndex].curtidas = [];
    }
    
    // Verifica se o usuário curtiu
    const jaCurtiu = postagens[postagemIndex].curtidas.includes(email);
    
    if (!jaCurtiu) {
        return res.status(400).send('Você não curtiu esta postagem');
    }
    
    // Remove curtida
    postagens[postagemIndex].curtidas = postagens[postagemIndex].curtidas.filter(e => e !== email);
    
    fs.writeFileSync(postagensPath, JSON.stringify(postagens, null, 2));
    res.status(200).json({
        message: 'Curtida removida',
        curtidas: postagens[postagemIndex].curtidas.length
    });
}

// Editar uma postagem/review
function editarPostagem(req, res) {
    const { id } = req.params;
    const { email, conteudo, nota, livro, capaLivro } = req.body;
    
    if (!email) {
        return res.status(400).send('Email é obrigatório');
    }
    
    let postagens = JSON.parse(fs.readFileSync(postagensPath) || '[]');
    const postagemIndex = postagens.findIndex(p => p.id === id);
    
    if (postagemIndex === -1) {
        return res.status(404).send('Postagem não encontrada');
    }
    
    // Verifica se é o dono da postagem
    if (postagens[postagemIndex].email !== email) {
        return res.status(403).send('Você só pode editar suas próprias postagens');
    }
    
    // Atualiza os dados
    if (conteudo !== undefined) postagens[postagemIndex].conteudo = conteudo;
    if (nota !== undefined) postagens[postagemIndex].nota = nota;
    if (livro !== undefined) postagens[postagemIndex].livro = livro;
    if (capaLivro !== undefined) postagens[postagemIndex].capaLivro = capaLivro;
    
    // Atualiza a data de modificação
    postagens[postagemIndex].dataEdicao = new Date().toISOString();
    
    fs.writeFileSync(postagensPath, JSON.stringify(postagens, null, 2));
    res.status(200).json({
        message: 'Postagem editada com sucesso',
        postagem: postagens[postagemIndex]
    });
}

module.exports = {
    criarPostagem,
    listarPostagens,
    listarPostagensSeguidos,
    deletarPostagem,
    curtirPostagem,
    descurtirPostagem,
    editarPostagem
};
