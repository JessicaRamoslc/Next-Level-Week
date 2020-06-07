const express = require("express");
const server = express();

// pegar o banco de dados
const db = require("./database/db")

//config pasta public
server.use(express.static("public"));

// Habilitar uso do req.body na nossa aplicação

server.use(express.urlencoded({ extended: true }))

//utilizando template engine
const nunjucks = require("nunjucks");

nunjucks.configure("src/views", {
    express: server, 
    noCache: true
})

//path -> home
server.get("/", function(req, res){
    return res.render("index.html", { title: "Um título"});
})

server.get("/create-point", function(req, res){
    //console.log(req.query)



    return res.render("create-point.html");
})

server.post("/savepoint", function (req, res){

    //req.body: o corpo do nosso formulário
    //console.log(req.query)

   // inserir dados no db
    const query = `
        INSERT INTO places (
            image, 
            name, 
            address, 
            address2, 
            state, 
            city, 
            items
)     VALUES (?,?,?,?,?,?,?);
`
    const values = [
        req.body.image, 
        req.body.name, 
        req.body.address, 
        req.body.address2,
        req.body.state, 
        req.body.city, 
        req.body.items
    ]

    function afterInsertData(err){
        if(err){
            return console.log(err)
            return res.send("Erro no cadastro, verifique os dados e tente novamente")
        }

        console.log("Cadastrado com sucesso!")
        console.log(this)

        return res.render("create-point.html", { saved: true });
    }

    db.run(query, values, afterInsertData)


    
})

server.get("/search", function(req, res){

    const search = req.query.search

    if(search === ""){
        return res.render("search-results.html", { total: 0 });
    }

    //pegar os dados do banco de dados
    db.all(` SELECT * FROM places WHERE city LIKE '%${ search }%' `, function(err, rows){
        if(err){
            return console.log(err);
        }

        const total = rows.length;

        console.log("Aqui estão seus registros");
        console.log(rows);
    
        // Mostrar a pagina html com os dados do bd
        return res.render("search-results.html", { places: rows, total: total});
    })
    
})

//inicia o servidor
server.listen(3000);

