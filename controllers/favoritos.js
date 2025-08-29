const { getTodosFavoritos, deletaFavorito, adicionaFavorito } = require("../services/favoritos");

function getFavoritos(req, res) {
    try {
        const livros = getTodosFavoritos();
        res.send(livros);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}

function postFavorito(req, res) {
    try {
        const id = req.params.id;
        adicionaFavorito(id);
        res.status(201).send('Favorito adicionado com sucesso!');  
    } catch (error) {
        res.status(500).send(error.message);
    }
}

function deleteFavorito(req, res) {
    try {
        const id = req.params.id;

        if(id && Number(id)) {
            deletaFavorito(id);
            res.send('Favorito removido com sucesso!');
        } else {
            res.status(422).send('ID inválido! Deve ser um número.');
        }
    } catch(error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    getFavoritos,
    postFavorito,
    deleteFavorito
}