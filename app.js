const express = require("express")
const cors = require("cors")

const rotaLivro = require("./rotas/livro")
const rotaFavorito = require("./rotas/favoritos")
const rotaUsuario = require("./rotas/usuario")
const rotaLivrosLidos = require("./rotas/livrosLidos")

const rotaReviews = require("./rotas/Reviews")
const rotaPostagem = require("./rotas/postagem")


const app = express()
app.use(express.json())
app.use(cors({origin: "*"}))


app.use('/livros', rotaLivro)
app.use('/favoritos', rotaFavorito)
app.use('/usuarios', rotaUsuario)
app.use('/livros-lidos', rotaLivrosLidos)

app.use('/reviews', rotaReviews)
app.use('/postagens', rotaPostagem)

const port = 8000


app.listen(port, () => {
    console.log(`Server rodando na porta ${port}`);
})