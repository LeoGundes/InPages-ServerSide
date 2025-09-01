const express = require("express")
const rotaLivro = require("./rotas/livro")
const rotaFavorito = require("./rotas/favoritos")
const rotaUsuario = require("./rotas/usuario")

const cors = require("cors")

const app = express()
app.use(express.json())
app.use(cors({origin: "*"}))

app.use('/livros', rotaLivro)
app.use('/favoritos', rotaFavorito)
app.use('/usuarios', rotaUsuario)

const port = 8000


app.listen(port, () => {
    console.log(`Server rodando na porta ${port}`);
})