const livrosLidosService = require('../services/livrosLidos');

async function adicionarLivroLido(req, res) {
    try {
        const { id, title, authors, thumbnail, usuario } = req.body;
        
        if (!id || !title || !usuario) {
            return res.status(400).json({ 
                error: 'ID, título e usuário são obrigatórios!' 
            });
        }
        
        const livroLido = {
            id,
            title,
            authors: authors || [],
            thumbnail: thumbnail || '',
            usuario,
            dataLeitura: new Date().toISOString()
        };
        
        const resultado = livrosLidosService.adicionarLivroLido(livroLido);
        res.status(201).json({
            message: 'Livro marcado como lido!',
            livro: resultado
        });
        
    } catch (error) {
        if (error.message === 'Este livro já está marcado como lido!') {
            return res.status(409).json({ error: error.message });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function buscarLivrosLidos(req, res) {
    try {
        const { usuario } = req.params;
        
        if (!usuario) {
            return res.status(400).json({ 
                error: 'Usuário é obrigatório!' 
            });
        }
        
        const livrosLidos = livrosLidosService.buscarLivrosLidosPorUsuario(usuario);
        res.json(livrosLidos);
        
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function removerLivroLido(req, res) {
    try {
        const { id, usuario } = req.params;
        
        if (!id || !usuario) {
            return res.status(400).json({ 
                error: 'ID e usuário são obrigatórios!' 
            });
        }
        
        const resultado = livrosLidosService.removerLivroLido(id, usuario);
        res.json(resultado);
        
    } catch (error) {
        if (error.message === 'Livro lido não encontrado!') {
            return res.status(404).json({ error: error.message });
        }
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

async function obterTodosLivrosLidos(req, res) {
    try {
        const livrosLidos = livrosLidosService.lerLivrosLidos();
        res.json(livrosLidos);
    } catch (error) {
        res.status(500).json({ error: 'Erro interno do servidor' });
    }
}

module.exports = {
    adicionarLivroLido,
    buscarLivrosLidos,
    removerLivroLido,
    obterTodosLivrosLidos
};
