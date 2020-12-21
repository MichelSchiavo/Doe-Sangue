//Configurando o servidor
const express = require("express")//Faz o chamado para o express
const server = express()//Permite usar as funcionalidades do express

//Configurar o servidor para apresentar arquivos estáticos
server.use(express.static('public'))

//Habilitar body do formulário
server.use(express.urlencoded({ extended: true}))

//Configurar a conexão com o banco de dados
const Pool = require('pg').Pool
const db = new Pool({//NEW adiciona como um novo objeto, pode-se usar {} no lugar
    user: 'postgres',
    password: 'senha',
    host: 'localhost',
    port: '5432',
    database: 'doe'
})


//configurando a template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true//Faz o navegador não viver de cache para mostrar as coisas
})

//Configurar a apresentação da página
server.get("/", function (req, res) {
    //return res.send('ok, cheguei aqui com nodemon')
    
    db.query('SELECT * FROM donors', function(err, result) {
        if (err) return res.send('Erro de banco de dados')

    const donors = result.rows//Pega as linhas cadastradas no banco de dados

    return res.render("index.html", { donors })
    })
    
})

server.post("/", function(req, res) {
    //Pegar dados do form.
    const name = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatórios")
    }//Return para o resto da função, agora sim eu entendi :D

    const query = `INSERT INTO donors ("name", "email", "blood")
    VALUES ($1, $2, $3)`

    const values = [name, email, blood]

    db.query(query, values, function (err) {
        //Fluxo de erro
        if (err) return res.send('Erro no banco de dados')
        //Fluxo ideal
        return res.redirect('/')
    })
    
})

//Ligar o servidor e permitir o acesso na porta
var porta = 3000
server.listen(porta, function() {
    console.log("iniciei a caceta na porta "+porta);
})//Seleciona a porta
