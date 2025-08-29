const fs = require("fs");


function getTodosFavoritos() {
    return JSON.parse(fs.readFileSync("favoritos.json"));
}

function deletaFavorito(id) {
    const livros = JSON.parse(fs.readFileSync("favoritos.json"));
    const livrosFiltrados = livros.filter(livro => livro.id !== id);
    fs.writeFileSync("favoritos.json", JSON.stringify(livrosFiltrados));
}

function adicionaFavorito(id) {
    const livros = JSON.parse(fs.readFileSync("livros.json"));
    const favoritos = JSON.parse(fs.readFileSync("favoritos.json"));

    // Procura o livro correto pelo id recebido
    const livroAdicionado = livros.find(livro => livro.id === id);

    if (!livroAdicionado) {
        throw new Error('Livro não encontrado');
    }

    const novaListaLivrosFavoritos = [...favoritos, livroAdicionado];
    fs.writeFileSync("favoritos.json", JSON.stringify(novaListaLivrosFavoritos));
}

module.exports = {
    getTodosFavoritos,
    deletaFavorito,
    adicionaFavorito
};