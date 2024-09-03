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

app.listen(8080, function () {
    console.log('servidor rodando na porta 8080')

})