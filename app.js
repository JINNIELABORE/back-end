/***********************************************************************************************
 * Objetivo: Criar uma estrutura para trazer informações sobre os dados da plataforma JINNI    *
 * Autor: Gustavo Henrique e Matheus Zanoni                                                    *
 * Data: 03/09/2024                                                                            *
 * Versão: 1.0                                                                                 *
***********************************************************************************************/

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')


const app = express()


app.use((request, response, next) => {

    response.header('Access-Control-Allow-Origin', '*')
    response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

    app.use(cors())

    next()
})

//Cria um objeto para definir o tipo de dados que irá chegar no BODY (JSON)
const bodyParserJSON = bodyParser.json()

// Imports

const controllerClientes = require('./controller/controller_cliente.js')
const controllerFreelancers = require('./controller/controller_freelancer.js')
const controllerCategorias = require('./controller/controller_categoria.js')
const controllerHabilidades = require('./controller/controller_habilidade.js')

// Clientes

app.post('/v1/jinni/cliente',  cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerClientes.setInserirCliente(dadosBody, contentType)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

app.get('/v1/jinni/clientes', cors(), async (request, response, next) => {

    let dadosClientes = await controllerClientes.getListarClientes()

    if (dadosClientes) {
        response.json(dadosClientes)
        response.status(200)
    } else {
        response.json({ message: 'Nenhum resgistro encontrado' })
        response.status(404)
    }

})


app.get('/v1/jinni/cliente/:id', cors(), async (request, response, next) => {
  
    //Recebe o ID encaminhando a requisição
    let idCliente = request.params.id

    let dadosCliente = await controllerClientes.getBuscarCliente(idCliente)

    response.status(dadosCliente.status_code)
    response.json(dadosCliente)
})

app.put('/v1/jinni/cliente/:id',  cors(), bodyParserJSON, async (request, response, next) => {

    let idCliente = request.params.id

    let contentType = request.headers['content-type']

    let dadosBody = request.body

    let resultDados = await controllerClientes.setAtualizarCliente(dadosBody, contentType, idCliente)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

app.delete('/v1/jinni/cliente/:id',  cors(), bodyParserJSON, async (request, response, next) => {
   
    let idCliente = request.params.id
    let dadosCliente = await controllerClientes.setExcluirCliente(idCliente)

    response.status(dadosCliente.status_code)
    response.json(dadosCliente)
})


// Freelancer

app.post('/v1/jinni/freelancer',  cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerFreelancers.setInserirFreelancer(dadosBody, contentType)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

app.get('/v1/jinni/freelancers', cors(), async (request, response, next) => {

    let dadosFreelancers = await controllerFreelancers.getListarFreelancers()

    if (dadosFreelancers) {
        response.json(dadosFreelancers)
        response.status(200)
    } else {
        response.json({ message: 'Nenhum resgistro encontrado' })
        response.status(404)
    }

})

app.get('/v1/jinni/freelancer/:id', cors(), async (request, response, next) => {
  
    //Recebe o ID encaminhando a requisição
    let idFreelancer = request.params.id

    let dadosFreelancer = await controllerFreelancers.getBuscarFreelancer(idFreelancer)

    response.status(dadosFreelancer.status_code)
    response.json(dadosFreelancer)
})

app.put('/v1/jinni/freelancer/:id',  cors(), bodyParserJSON, async (request, response, next) => {

    let idFreelancer = request.params.id

    let contentType = request.headers['content-type']

    let dadosBody = request.body

    let resultDados = await controllerFreelancers.setAtualizarFreelancer(dadosBody, contentType, idFreelancer)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

app.delete('/v1/jinni/freelancer/:id',  cors(), bodyParserJSON, async (request, response, next) => {
   
    let idFreelancer = request.params.id
    let dadosFreelancer = await controllerFreelancers.setExcluirFreelancer(idFreelancer)

    response.status(dadosFreelancer.status_code)
    response.json(dadosFreelancer)
})



//Categoria


app.post('/v1/jinni/categoria',  cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerCategorias.setInserirNovaCategoria(dadosBody, contentType)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

app.get('/v1/jinni/categorias', cors(), async (request, response, next) => {

    let dadosCategorias = await controllerCategorias.getListarCategorias()

    if (dadosCategorias) {
        response.json(dadosCategorias)
        response.status(200)
    } else {
        response.json({ message: 'Nenhum resgistro encontrado' })
        response.status(404)
    }

})


app.get('/v1/jinni/categoria/:id', cors(), async (request, response, next) => {
  
    //Recebe o ID encaminhando a requisição
    let idCategoria = request.params.id

    let dadosCategoria = await controllerCategorias.getBuscarCategoria(idCategoria)

    response.status(dadosCategoria.status_code)
    response.json(dadosCategoria)
})

app.put('/v1/jinni/categorias/:id',  cors(), bodyParserJSON, async (request, response, next) => {

    let idCategoria = request.params.id

    let contentType = request.headers['content-type']

    let dadosBody = request.body

    let resultDados = await controllerCategorias.setAtualizarCategoria(dadosBody, contentType, idCategoria)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

app.delete('/v1/jinni/categoria/:id',  cors(), bodyParserJSON, async (request, response, next) => {
   
    let idCategoria = request.params.id
    let dadosCategoria = await controllerCategorias.setExcluirCategoria(idCategoria)

    response.status(dadosCategoria.status_code)
    response.json(dadosCategoria)
})


//Habilidade


app.post('/v1/jinni/habilidade',  cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerHabilidades.setInserirNovaHabilidade(dadosBody, contentType)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

app.get('/v1/jinni/habilidades', cors(), async (request, response, next) => {

    let dadosHabilidades = await controllerHabilidades.getListarHabilidades()

    if (dadosHabilidades) {
        response.json(dadosHabilidades)
        response.status(200)
    } else {
        response.json({ message: 'Nenhum resgistro encontrado' })
        response.status(404)
    }

})


app.get('/v1/jinni/habilidade/:id', cors(), async (request, response, next) => {
  
    //Recebe o ID encaminhando a requisição
    let idHabilidade = request.params.id

    let dadosHabilidade = await controllerHabilidades.getBuscarHabilidade(idHabilidade)

    response.status(dadosHabilidade.status_code)
    response.json(dadosHabilidade)
})

app.put('/v1/jinni/habilidade/:id',  cors(), bodyParserJSON, async (request, response, next) => {

    let idHabilidade = request.params.id

    let contentType = request.headers['content-type']

    let dadosBody = request.body

    let resultDados = await controllerHabilidades.setAtualizarHabilidade(dadosBody, contentType, idHabilidade)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

app.delete('/v1/jinni/habilidade/:id',  cors(), bodyParserJSON, async (request, response, next) => {
   
    let idHabilidade = request.params.id
    let dadosHabilidade = await controllerHabilidades.setExcluirHablidade(idHabilidade)

    response.status(dadosHabilidade.status_code)
    response.json(dadosHabilidade)
})
app.listen(8080, function () {
    console.log('servidor rodando na porta 8080')
})