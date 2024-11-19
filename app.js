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
const controllerFreelancerCategoria = require('./controller/controller_categoria_freelancer.js')
const controllerFreelancerHabilidade = require('./controller/controller_habilidade_freelancer.js')
const controllerNivelExperiencia = require('./controller/controller_nivel_experiencia.js')
const controllerPublicacaoProjeto = require('./controller/controller_publicacao_projeto.js')
const controllerCategoriaProjeto = require('./controller/controller_categoria_publicacao_projeto.js')
const controllerHabilidadeProjeto = require('./controller/controller_habilidade_publicacao_projeto.js')
const controllerDescricaoPerfil = require('./controller/controller_descricao_perfil.js')
const controllerFotoPerfil = require('./controller/controller_foto_perfil.js')
const controllerPortfolio = require('./controller/controller_portfolio.js')
const controllerPortfolioFreelancer = require('./controller/controller_portfolio_freelancer.js')
const controllerAvaliacao = require('./controller/controller_avaliacao.js')
const controllerPagamentos = require('./controller/controller_pagamento.js')
const controllerFreelancerProjeto = require('./controller/controller_freelancer_projeto')
const controllerDenuncia = require('./controller/controller_denuncia.js')

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

app.put('/v1/jinni/categoria/:id',  cors(), bodyParserJSON, async (request, response, next) => {

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
    let dadosHabilidade = await controllerHabilidades.setExcluirHabilidade(idHabilidade)

    response.status(dadosHabilidade.status_code)
    response.json(dadosHabilidade)
})


app.post('/v1/jinni/freelancer/categoria', cors(), bodyParserJSON, async(request, response) => {
    let contentType = request.headers['content-type']
    let dados = request.body
    let resultDados = await controllerFreelancerCategoria.setInserirNovaCategoriaFreelancer(dados, contentType)

    response.status(resultDados.status)
    response.json(resultDados)

    
})
// Categoria para freelancer

app.post('/v1/jinni/categoria/freelancer',  cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerFreelancerCategoria.setInserirNovaCategoriaFreelancer(dadosBody, contentType)

    response.status(resultDados.status_code)
    response.json(resultDados)


})

app.get('/v1/jinni/categorias/freelancers', cors(), async (request, response, next) => {

    let dadosCategoriasFreelancers = await controllerFreelancerCategoria.getListarCategoriasFreelancers()

    //Validação para retornar os dados ou o erro 404
    if (dadosCategoriasFreelancers) {
        response.json(dadosCategoriasFreelancers)
        response.status(200)
    } else {
        response.json({ message: 'Nenhum resgistro encontrado' })
        response.status(404)
    }

})

app.get('/v1/jinni/categoria/freelancer/:id', cors(), async (request, response, next) => {
  
    //Recebe o ID encaminhando a requisição
    let idCategoriaFreelancer = request.params.id

    let dadosCategoriaFreelancer = await controllerFreelancerCategoria.getBuscarCategoriaFreelancer(idCategoriaFreelancer)

    response.status(dadosCategoriaFreelancer.status_code)
    response.json(dadosCategoriaFreelancer)
})

app.delete('/v1/jinni/categoria/freelancer/:id',  cors(), bodyParserJSON, async (request, response, next) => {
   
    let idCategoriaFreelancer = request.params.id
    let dadosCategoriaFreelancer = await controllerFreelancerCategoria.setExcluirCategoriaFreelancer(idCategoriaFreelancer)

    response.status(dadosCategoriaFreelancer.status_code)
    response.json(dadosCategoriaFreelancer)
})

app.put ('/v1/jinni/categoria/freelancer/:id',  cors(), bodyParserJSON, async (request, response, next) => {

    let idCategoriaFreelancer = request.params.id

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    let resultDados = await controllerFreelancerCategoria.setAtualizarCategoriaFreelancer(dadosBody, contentType, idCategoriaFreelancer)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

// Habilidade para Freelancer

app.post('/v1/jinni/habilidade/freelancer',  cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerFreelancerHabilidade.setInserirNovaHabilidadeFreelancer(dadosBody, contentType)

    response.status(resultDados.status_code)
    response.json(resultDados)


})

app.get('/v1/jinni/habilidades/freelancers', cors(), async (request, response, next) => {

    let dadosHabilidadesFreelancers = await controllerFreelancerHabilidade.getListarHabilidadesFreelancer()

    //Validação para retornar os dados ou o erro 404
    if (dadosHabilidadesFreelancers) {
        response.json(dadosHabilidadesFreelancers)
        response.status(200)
    } else {
        response.json({ message: 'Nenhum registro encontrado' })
        response.status(404)
    }

})

app.get('/v1/jinni/habilidade/freelancer/:id', cors(), async (request, response, next) => {
  
    //Recebe o ID encaminhando a requisição
    let idHabilidadeFreelancer = request.params.id

    let dadosHabilidadeFreelancer = await controllerFreelancerHabilidade.getBuscarHabilidadeFreelancer(idHabilidadeFreelancer)

    response.status(dadosHabilidadeFreelancer.status_code)
    response.json(dadosHabilidadeFreelancer)
})

app.delete('/v1/jinni/habilidade/freelancer/:id',  cors(), bodyParserJSON, async (request, response, next) => {
   
    let idHabilidadeFreelancer = request.params.id
    let dadosHabilidadeFreelancer = await controllerFreelancerHabilidade.setExcluirHabilidadeFreelancer(idHabilidadeFreelancer)

    response.status(dadosHabilidadeFreelancer.status_code)
    response.json(dadosHabilidadeFreelancer)
})

app.put ('/v1/jinni/habilidade/freelancer/:id',  cors(), bodyParserJSON, async (request, response, next) => {

    let idHabilidadeFreelancer = request.params.id

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    let resultDados = await controllerFreelancerHabilidade.setAtualizarHabilidadeFreelancer(dadosBody, contentType, idHabilidadeFreelancer)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

app.post('v1/jinni/freelancer/nome', async (req, res) => {
    const { email_freelancer } = req.body

    if (!email_freelancer) {
        return res.status(400).json({ error: 'Email é obrigatório.' })
    }

    const nomeFreelancer = await controllerFreelancers.getFreelancerByEmail(email_freelancer)

    if (nomeFreelancer) {
        return res.status(200).json({ nome: nomeFreelancer })
    } else {
        return res.status(404).json({ error: 'Freelancer não encontrado.' })
    }
})

app.get('/v1/jinni/nome/cliente', async (req, res) => {


    const emailPesquisado = req.query.emailDigitado
console.log(emailPesquisado)


    const nomeCliente = await controllerClientes.getClienteByEmail(emailPesquisado)

    if (nomeCliente) {
        return res.status(200).json({ nome: nomeCliente})
    } else {
        return res.status(404).json({ error: 'Cliente não encontrado.' })
    }
})

app.get('/v1/jinni/nome/freelancer', async (req, res) => {


    const emailPesquisado = req.query.emailDigitado
console.log(emailPesquisado)


    const nomeCliente = await controllerFreelancers.getFreelancerByEmail(emailPesquisado)

    if (nomeCliente) {
        return res.status(200).json({ nome: nomeCliente})
    } else {
        return res.status(404).json({ error: 'Cliente não encontrado.' })
    }
})

// Níveis de experiência

app.get('/v1/jinni/nivel/experiencias', cors(), async (request, response, next) => {
  
    //Recebe o ID encaminhando a requisição
    let idNivelExperiencia = request.params.id

    let dadosNivelExperiencia = await controllerNivelExperiencia.getListarNivelExperiencias(idNivelExperiencia)

    response.status(dadosNivelExperiencia.status_code)
    response.json(dadosNivelExperiencia)
})


app.get('/v1/jinni/nivel/experiencia/:id', cors(), async (request, response, next) => {
  
    //Recebe o ID encaminhando a requisição
    let idNivelExperiencia = request.params.id

    let dadosNivelExperiencia = await controllerNivelExperiencia.getBuscarNivelExperiencia(idNivelExperiencia)

    response.status(dadosNivelExperiencia.status_code)
    response.json(dadosNivelExperiencia)
})

app.delete('/v1/jinni/nivel/experiencia/:id',  cors(), bodyParserJSON, async (request, response, next) => {
   
    let idNivelExperiencia = request.params.id
    let dadosNivelExperiencia = await controllerNivelExperiencia.setExcluirNivelExperiencia(idNivelExperiencia)

    response.status(dadosNivelExperiencia.status_code)
    response.json(dadosNivelExperiencia)
})

app.put ('/v1/jinni/nivel/experiencia/:id',  cors(), bodyParserJSON, async (request, response, next) => {

    let idNivelExperiencia = request.params.id

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    let resultDados = await controllerNivelExperiencia.setAtualizarNivelExperiencia(dadosBody, contentType, idNivelExperiencia)

    response.status(resultDados.status_code)
    response.json(resultDados)

})

app.post('/v1/jinni/nivel/experiencia',  cors(), bodyParserJSON, async (request, response, next) =>{

    let contentType = request.headers['content-type']

    //Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    //Encaminha os dados para cotroller inserir no BD
    let resultDados = await controllerNivelExperiencia.setInserirNovoNivelExperiencia(dadosBody, contentType)

    response.status(resultDados.status_code)
    response.json(resultDados)


})

// Publicação Projeto

app.get('/v1/jinni/projetos', cors(), async (request, response, next) => {
  
    let dadosProjetos = await controllerPublicacaoProjeto.getListarPublicacaoProjetos()

    response.status(dadosProjetos.status_code)
    response.json(dadosProjetos)
})

app.get('/v1/jinni/projeto/:id', cors(), async (request, response, next) => {
  
    let idProjeto = request.params.id

    let dadosProjeto = await controllerPublicacaoProjeto.getBuscarPublicacaoProjeto(idProjeto)

    response.status(dadosProjeto.status_code)
    response.json(dadosProjeto)
})

app.delete('/v1/jinni/projeto/:id', cors(), bodyParserJSON, async (request, response, next) => {
  
    let idProjeto = request.params.id

    let resultado = await controllerPublicacaoProjeto.setExcluirPublicacaoProjeto(idProjeto)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.put('/v1/jinni/projeto/:id', cors(), bodyParserJSON, async (request, response, next) => {

    let idProjeto = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerPublicacaoProjeto.setAtualizarPublicacaoProjeto(dadosBody, contentType, idProjeto)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.post('/v1/jinni/projeto', cors(), bodyParserJSON, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerPublicacaoProjeto.setInserirNovaPublicacaoProjeto(dadosBody, contentType)

    response.status(resultado.status_code)
    response.json(resultado)
})

// Categorias Publicacão Projeto

app.get('/v1/jinni/categorias/projetos', cors(), async (request, response, next) => {
  
    let dadosCategoriaProjetos = await controllerCategoriaProjeto.getListarCategoriasProjetos()

    response.status(dadosCategoriaProjetos.status_code)
    response.json(dadosCategoriaProjetos)
})

app.get('/v1/jinni/categoria/projeto/:id', cors(), async (request, response, next) => {
  
    let idCatgoriaProjeto = request.params.id

    let dadosCategoriaProjeto = await controllerCategoriaProjeto.getBuscarCategoriaProjeto(idCatgoriaProjeto)

    response.status(dadosCategoriaProjeto.status_code)
    response.json(dadosCategoriaProjeto)
})

app.delete('/v1/jinni/categoria/projeto/:id', cors(), bodyParserJSON, async (request, response, next) => {
  
    let idCatgoriaProjeto = request.params.id

    let resultado = await controllerCategoriaProjeto.setExcluirCategoriaProjeto(idCatgoriaProjeto)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.put('/v1/jinni/categoria/projeto/:id', cors(), bodyParserJSON, async (request, response, next) => {

    let idCatgoriaProjeto = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerCategoriaProjeto.setAtualizarCategoriaProjeto(dadosBody, contentType, idCatgoriaProjeto)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.post('/v1/jinni/categoria/projeto', cors(), bodyParserJSON, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerCategoriaProjeto.setInserirNovaCategoriaProjeto(dadosBody, contentType)

    response.status(resultado.status_code)
    response.json(resultado)
})

// Habilidades Publicação Projeto

app.get('/v1/jinni/habilidades/projetos', cors(), async (request, response, next) => {
  
    let dadosHabilidadeProjetos = await controllerHabilidadeProjeto.getListarHabilidadesProjetos()

    response.status(dadosHabilidadeProjetos.status_code)
    response.json(dadosHabilidadeProjetos)
})

app.get('/v1/jinni/habilidade/projeto/:id', cors(), async (request, response, next) => {
  
    let idHabilidadeProjeto = request.params.id

    let dadosHabilidadeProjeto = await controllerHabilidadeProjeto.getBuscarHabilidadeProjeto(idHabilidadeProjeto)

    response.status(dadosHabilidadeProjeto.status_code)
    response.json(dadosHabilidadeProjeto)
})

app.delete('/v1/jinni/habilidade/projeto/:id', cors(), bodyParserJSON, async (request, response, next) => {
  
    let idHabilidadeProjeto = request.params.id

    let resultado = await controllerHabilidadeProjeto.setExcluirHabilidadeProjeto(idHabilidadeProjeto)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.put('/v1/jinni/habilidade/projeto/:id', cors(), bodyParserJSON, async (request, response, next) => {

    let idHabilidadeProjeto = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerHabilidadeProjeto.setAtualizarHabilidadeProjeto(dadosBody, contentType, idHabilidadeProjeto)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.post('/v1/jinni/habilidade/projeto', cors(), bodyParserJSON, async (request, response, next) => {

    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerHabilidadeProjeto.setInserirNovaHabilidadeProjeto(dadosBody, contentType)

    response.status(resultado.status_code)
    response.json(resultado)
})

// Descrição Perfil

app.get('/v1/jinni/descricoes/perfis', cors(), async (request, response, next) => {
    let dadosDescricaoPerfis = await controllerDescricaoPerfil.getListarDescricoesPerfis()

    response.status(dadosDescricaoPerfis.status_code)
    response.json(dadosDescricaoPerfis)
})

app.get('/v1/jinni/descricao/perfil/:id', cors(), async (request, response, next) => {
    let idDescricaoPerfil = request.params.id

    let dadosDescricaoPerfil = await controllerDescricaoPerfil.getBuscarDescricaoPerfil(idDescricaoPerfil)

    response.status(dadosDescricaoPerfil.status_code)
    response.json(dadosDescricaoPerfil)
})

app.delete('/v1/jinni/descricao/perfil/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idDescricaoPerfil = request.params.id

    let resultado = await controllerDescricaoPerfil.setExcluirDescricaoPerfil(idDescricaoPerfil)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.put('/v1/jinni/descricao/perfil/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idDescricaoPerfil = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerDescricaoPerfil.setAtualizarDescricaoPerfil(dadosBody, contentType, idDescricaoPerfil)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.post('/v1/jinni/descricao/perfil', cors(), bodyParserJSON, async (request, response, next) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerDescricaoPerfil.setInserirNovaDescricaoPerfil(dadosBody, contentType)

    response.status(resultado.status_code)
    response.json(resultado)
})

// Foto de Perfil

app.get('/v1/jinni/fotos/perfis', cors(), async (request, response, next) => {
    let dadosFotoPerfis = await controllerFotoPerfil.getListarFotosPerfis()

    response.status(dadosFotoPerfis.status_code)
    response.json(dadosFotoPerfis)
})

app.get('/v1/jinni/foto/perfil/:id', cors(), async (request, response, next) => {
    let idFotoPerfil = request.params.id

    let dadosFotoPerfil = await controllerFotoPerfil.getBuscarFotoPerfil(idFotoPerfil)

    response.status(dadosFotoPerfil.status_code)
    response.json(dadosFotoPerfil)
})

app.delete('/v1/jinni/foto/perfil/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idFotoPerfil = request.params.id

    let resultado = await controllerFotoPerfil.setExcluirFotoPerfil(idFotoPerfil)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.put('/v1/jinni/foto/perfil/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idFotoPerfil = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerFotoPerfil.setAtualizarFotoPerfil(dadosBody, contentType, idFotoPerfil)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.post('/v1/jinni/foto/perfil', cors(), bodyParserJSON, async (request, response, next) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerFotoPerfil.setInserirNovaFotoPerfil(dadosBody, contentType)

    response.status(resultado.status_code)
    response.json(resultado)
})

// Portfolio

app.get('/v1/jinni/portfolios', cors(), bodyParserJSON, async (request, response, next) => {
    let dadosPortfolios = await controllerPortfolio.getListarPortfolios()

    response.status(dadosPortfolios.status_code)
    response.json(dadosPortfolios)
})

app.get('/v1/jinni/portfolio/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idPortfolio = request.params.id

    let dadosPortfolio = await controllerPortfolio.getBuscarPortfolio(idPortfolio)

    response.status(dadosPortfolio.status_code)
    response.json(dadosPortfolio)
})

app.delete('/v1/jinni/portfolio/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idPortfolio = request.params.id

    let resultado = await controllerPortfolio.setExcluirPortfolio(idPortfolio)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.put('/v1/jinni/portfolio/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idPortfolio = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerPortfolio.setAtualizarPortfolio(dadosBody, contentType, idPortfolio)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.post('/v1/jinni/portfolio', cors(), bodyParserJSON, async (request, response, next) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerPortfolio.setInserirNovoPortfolio(dadosBody, contentType)

    response.status(resultado.status_code)
    response.json(resultado)
})

// Associar Portfolio ao Freelancer

app.get('/v1/jinni/portfolios/freelancers', cors(), bodyParserJSON, async (request, response, next) => {
    let dadosPortfoliosFreelancers = await controllerPortfolioFreelancer.getListarPortfolioFreelancer()

    response.status(dadosPortfoliosFreelancers.status_code)
    response.json(dadosPortfoliosFreelancers)
})

app.get('/v1/jinni/portfolio/freelancer/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idPortfolioFreelancer = request.params.id

    let dadosPortfolioFreelancer = await controllerPortfolioFreelancer.getBuscarPortfolioFreelancer(idPortfolioFreelancer)

    response.status(dadosPortfolioFreelancer.status_code)
    response.json(dadosPortfolioFreelancer)
})

app.delete('/v1/jinni/portfolio/freelancer/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idPortfolioFreelancer = request.params.id

    let resultado = await controllerPortfolioFreelancer.setExcluirPortfolioFreelancer(idPortfolioFreelancer)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.put('/v1/jinni/portfolio/freelancer/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idPortfolioFreelancer = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerPortfolioFreelancer.setAtualizarPortfolioFreelancer(dadosBody, contentType, idPortfolioFreelancer)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.post('/v1/jinni/portfolio/freelancer', cors(), bodyParserJSON, async (request, response, next) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerPortfolioFreelancer.setInserirNovoPortfolioFreelancer(dadosBody, contentType)

    response.status(resultado.status_code)
    response.json(resultado)
})

// Avaliação

app.get('/v1/jinni/avaliacoes', cors(), bodyParserJSON, async (request, response, next) => {
    let dadosAvaliacoes = await controllerAvaliacao.getListarAvaliacoes()

    response.status(dadosAvaliacoes.status_code)
    response.json(dadosAvaliacoes)
})

app.get('/v1/jinni/avaliacao/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idAvaliacao = request.params.id

    let dadosAvaliacao = await controllerAvaliacao.getBuscarAvaliacao(idAvaliacao)

    response.status(dadosAvaliacao.status_code)
    response.json(dadosAvaliacao)
})

app.delete('/v1/jinni/avaliacao/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idAvaliacao = request.params.id

    let resultado = await controllerAvaliacao.setExcluirAvaliacao(idAvaliacao)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.put('/v1/jinni/avaliacao/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idAvaliacao = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerAvaliacao.setAtualizarAvaliacao(dadosBody, contentType, idAvaliacao)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.post('/v1/jinni/avaliacao', cors(), bodyParserJSON, async (request, response, next) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerAvaliacao.setInserirNovaAvaliacao(dadosBody, contentType)

    response.status(resultado.status_code)
    response.json(resultado)
})

// Pagamento

app.post('/v1/jinni/pagamento', cors(), bodyParserJSON, async (request, response, next) => {
    let contentType = request.headers['content-type']

    // Recebe os dados encaminhados no Body da requisição
    let dadosBody = request.body

    // Encaminha os dados para o controller inserir no BD
    
    let resultDados = await controllerPagamentos.setInserirNovoPagamento(dadosBody, contentType)

    response.status(resultDados.status_code)
    response.json(resultDados)
})

app.get('/v1/jinni/pagamentos', cors(), async (request, response, next) => {
    // Chama o controller para listar todos os pagamentos
    let dadosPagamentos = await controllerPagamentos.getListarPagamentos()

    if (dadosPagamentos) {
        response.json(dadosPagamentos)
        response.status(200)
    } else {
        response.json({ message: 'Nenhum registro encontrado' })
        response.status(404)
    }
})

app.get('/v1/jinni/pagamento/:id', cors(), async (request, response, next) => {
    // Recebe o ID do pagamento encaminhado na requisição
    let idPagamento = request.params.id

    let dadosPagamento = await controllerPagamentos.getBuscarPagamento(idPagamento)

    response.status(dadosPagamento.status_code)
    response.json(dadosPagamento)
})

app.put('/v1/jinni/pagamento/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idPagamento = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultDados = await controllerPagamentos.setAtualizarPagamento(dadosBody, contentType, idPagamento)

    response.status(resultDados.status_code)
    response.json(resultDados)
})

app.delete('/v1/jinni/pagamento/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idPagamento = request.params.id
    let dadosPagamento = await controllerPagamentos.setExcluirPagamento(idPagamento)

    response.status(dadosPagamento.status_code)
    response.json(dadosPagamento)
})

// Freelancer projeto

app.get('/v1/jinni/freelancers/projetos', cors(), async (request, response, next) => {
    try {
        let dadosFreelancerProjetos = await controllerFreelancerProjeto.getListarFreelancersProjetos()

        response.status(dadosFreelancerProjetos.status_code)
        response.json(dadosFreelancerProjetos)
    } catch (error) {
        next(error)
    }
})

// Rota para buscar um freelancer em um projeto específico
app.get('/v1/jinni/freelancer/projeto/:id', cors(), async (request, response, next) => {
    try {
        let idFreelancerProjeto = request.params.id

        let dadosFreelancerProjeto = await controllerFreelancerProjeto.getBuscarFreelancerProjeto(idFreelancerProjeto)

        response.status(dadosFreelancerProjeto.status_code)
        response.json(dadosFreelancerProjeto)
    } catch (error) {
        next(error)
    }
})

// Rota para excluir um freelancer de um projeto
app.delete('/v1/jinni/freelancer/projeto/:id', cors(), bodyParserJSON, async (request, response, next) => {
    try {
        let idFreelancerProjeto = request.params.id

        let resultado = await controllerFreelancerProjeto.setExcluirFreelancerProjeto(idFreelancerProjeto)

        response.status(resultado.status_code)
        response.json(resultado)
    } catch (error) {
        next(error)
    }
})

// Rota para atualizar os dados de um freelancer em um projeto
app.put('/v1/jinni/freelancer/projeto/:id', cors(), bodyParserJSON, async (request, response, next) => {
    try {
        let idFreelancerProjeto = request.params.id
        let contentType = request.headers['content-type']
        let dadosBody = request.body

        let resultado = await controllerFreelancerProjeto.setAtualizarFreelancerProjeto(dadosBody, contentType, idFreelancerProjeto)

        response.status(resultado.status_code)
        response.json(resultado)
    } catch (error) {
        next(error)
    }
})

// Rota para inserir um novo freelancer em um projeto
app.post('/v1/jinni/freelancer/projeto', cors(), bodyParserJSON, async (request, response, next) => {
    try {
        let contentType = request.headers['content-type']
        let dadosBody = request.body

        let resultado = await controllerFreelancerProjeto.setInserirNovoFreelancerProjeto(dadosBody, contentType)

        response.status(resultado.status_code)
        response.json(resultado)
    } catch (error) {
        next(error)
    }
})

// Denuncia

app.get('/v1/jinni/denuncias', cors(), bodyParserJSON, async (request, response, next) => {
    let dadosDenuncias = await controllerDenuncia.getListarDenuncias()

    response.status(dadosDenuncias.status_code)
    response.json(dadosDenuncias)
})

app.get('/v1/jinni/denuncia/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idDenuncia = request.params.id

    let dadosDenuncia = await controllerDenuncia.getBuscarDenuncia(idDenuncia)

    response.status(dadosDenuncia.status_code)
    response.json(dadosDenuncia)
})

app.delete('/v1/jinni/denuncia/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idDenuncia = request.params.id

    let resultado = await controllerDenuncia.setExcluirDenuncia(idDenuncia)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.put('/v1/jinni/denuncia/:id', cors(), bodyParserJSON, async (request, response, next) => {
    let idDenuncia = request.params.id
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerDenuncia.setAtualizarDenuncia(dadosBody, contentType, idDenuncia)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.post('/v1/jinni/denuncia', cors(), bodyParserJSON, async (request, response, next) => {
    let contentType = request.headers['content-type']
    let dadosBody = request.body

    let resultado = await controllerDenuncia.setInserirNovaDenuncia(dadosBody, contentType)

    response.status(resultado.status_code)
    response.json(resultado)
})

app.listen(8080, function () {
    console.log('servidor rodando na porta 8080')
})