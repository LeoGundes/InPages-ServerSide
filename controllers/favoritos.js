const fs = require('fs');
const path = require('path');
const livrosPath = path.resolve(__dirname, '../livros.json');
const favoritosPath = path.resolve(__dirname, '../favoritos.json');


function getFavoritos(req, res) {
    try {
        const favoritos = JSON.parse(fs.readFileSync(favoritosPath));
        res.status(200).json(favoritos);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}

function postFavorito(req, res) {
    try {
        const id = req.params.id;
        const livros = JSON.parse(fs.readFileSync(livrosPath));
        const favoritos = JSON.parse(fs.readFileSync(favoritosPath));
        const livroAdicionado = livros.find(livro => livro.id === id);
        if (!livroAdicionado) {
            return res.status(404).send('Livro não encontrado');
        }
        if (favoritos.find(fav => fav.id === id)) {
            return res.status(409).send('Livro já está nos favoritos');
        }
        favoritos.push(livroAdicionado);
        fs.writeFileSync(favoritosPath, JSON.stringify(favoritos, null, 2));
        res.status(201).send('Favorito adicionado com sucesso!');  
    } catch (error) {
        res.status(500).send(error.message);
    }
}

function deleteFavorito(req, res) {
    try {
        const id = req.params.id;
        let favoritos = JSON.parse(fs.readFileSync(favoritosPath));
        const novoFavoritos = favoritos.filter(fav => fav.id !== id);
        fs.writeFileSync(favoritosPath, JSON.stringify(novoFavoritos, null, 2));
        res.status(200).send('Favorito removido com sucesso!');
    } catch(error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    getFavoritos,
    postFavorito,
    deleteFavorito
}