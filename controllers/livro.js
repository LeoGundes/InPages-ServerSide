const e = require('express');
const { getTodosLivros, getLivroPorID, insereLivro, modificaLivro, apagaLivro } = require('../services/livro');

function getLivros(req, res) {
    try {
        const livros = getTodosLivros();
        res.send(livros);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}

function getLivro(req, res) {
    try {
        const id = req.params.id;

        if(id && Number(id)) {
            const livro = getLivroPorID(id);
            res.send(livro);
        } else {
            res.status(422).send('ID inválido! Deve ser um número.');
        }
        const livro = getLivroPorID(id);
        res.send(livro);
    } catch (error) {
        console.error(error);
        res.status(500).send(error.message);
    }
}

function postLivro(req, res) {
    try {
        const livroNovo = req.body;
        if(req.body.nome) {
            insereLivro(livroNovo);
            res.status(201).send('Livro adicionado com sucesso!');  
        } else {
            res.status(422).send('Dados inválidos! O campo "nome" é obrigatório.');
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
}

function patchLivro(req, res) {
    try {
        const id = req.params.id

        if(id && Number(id)) {
            const body = req.body;
            modificaLivro(body, id);
            res.send('Livro modificado com sucesso!')
        } else {
            res.status(422).send('ID inválido! Deve ser um número.');
        }
    } catch(error) {
        res.status(500).send(error.message);
    }
}

function deleteLivro(req, res) {
    try {
        const id = req.params.id;

        if(id && Number(id)) {
            apagaLivro(id);
            res.send('Livro removido com sucesso!');
        } else {
            res.status(422).send('ID inválido! Deve ser um número.');
        }
    } catch(error) {
        res.status(500).send(error.message);
    }
}

module.exports = {
    getLivros,
    getLivro,
    postLivro,
    patchLivro,
    deleteLivro
}