const fs = require('fs');
const path = require('path');

const livrosLidosPath = path.join(__dirname, '../livrosLidos.json');

function lerLivrosLidos() {
    try {
        const data = fs.readFileSync(livrosLidosPath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function salvarLivrosLidos(livrosLidos) {
    fs.writeFileSync(livrosLidosPath, JSON.stringify(livrosLidos, null, 2));
}

function adicionarLivroLido(livroLido) {
    const livrosLidos = lerLivrosLidos();
    
    // Verifica se o livro já foi lido pelo usuário
    const jaLido = livrosLidos.find(l => 
        l.id === livroLido.id && 
        l.usuario === livroLido.usuario
    );
    
    if (jaLido) {
        throw new Error('Este livro já está marcado como lido!');
    }
    
    // Adiciona data de leitura se não foi fornecida
    if (!livroLido.dataLeitura) {
        livroLido.dataLeitura = new Date().toISOString();
    }
    
    livrosLidos.push(livroLido);
    salvarLivrosLidos(livrosLidos);
    return livroLido;
}

function buscarLivrosLidosPorUsuario(usuario) {
    const livrosLidos = lerLivrosLidos();
    return livrosLidos.filter(l => l.usuario === usuario);
}

function removerLivroLido(id, usuario) {
    const livrosLidos = lerLivrosLidos();
    const novaLista = livrosLidos.filter(l => 
        !(l.id === id && l.usuario === usuario)
    );
    
    if (novaLista.length === livrosLidos.length) {
        throw new Error('Livro lido não encontrado!');
    }
    
    salvarLivrosLidos(novaLista);
    return { message: 'Livro removido da lista de lidos!' };
}

module.exports = {
    adicionarLivroLido,
    buscarLivrosLidosPorUsuario,
    removerLivroLido,
    lerLivrosLidos
};
