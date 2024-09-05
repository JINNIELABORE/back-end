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

app.listen(8080, function () {
    console.log('servidor rodando na porta 8080')

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

app.listen(8080, function () {
    console.log('servidor rodando na porta 8080')
})