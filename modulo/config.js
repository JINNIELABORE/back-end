/**********************************************************************************************************************************************************
 * Objetivo: Arquivo responsável pelas variaveis globais do projeto, onde haverão mensagens, status_code e outros conteúdos                               *
 * Data: 05/09/2024                                                                                                                                       *
 * Autor: Gustavo Henrique e Matheus Zanoni                                                                                                               *
 * 1.0                                                                                                                                                    *
 *********************************************************************************************************************************************************/

/************************ MENSAGENS DE ERRO DO PROJETO ************************/

const ERROR_INVALID_ID = {status: false, status_code: 400, message: 'O ID encaminhado na requisão não é válido!'}
const ERROR_REQUIRED_FIELDS = {status: false, status_code: 400, message: 'Existem campos obrigatórios que não foram preenchidos, ou ultrapassaram o limite de caracteres!'}
const ERROR_NOT_FOUND = {status: false, status_code: 404, message: 'Nenhum item encontrado na requisão!'}
const ERROR_INTERNAL_SERVER_DB = {status: false, status_code: 500, message: 'Ocorreram Erros no processamento do Banco de dados. Contate o administrador da API!'}
const ERROR_INTERNAL_SERVER = {status: false, status_code: 500, message: 'Ocorreram erros no servidor back-end na camada de serviços, portanto não foi possível processar a requisição. Contate o administrador da API!'}
const ERROR_CONTENT_TYPE= {status: false, status_code: 415, message: 'O content-type da requisição não é suportado na API. Deve-se encaminhar dados em formato application/json!'}


/************************ MENSAGENS DE SUCESSO DO PROJETO ************************/
const SUCESS_CREATED_ITEM = {status: true, status_code: 201, message: 'O item foi criado com sucesso no banco de dados!'}
const SUCESS_DELETE_ITEM = {status: true, status_code: 200, message: 'O item foi deletado com sucesso no banco de dados!'}
const SUCESS_UPDATE_ITEM = {status: true, status_code: 200, message: 'O item foi atualizado com sucesso no banco de dados!'}

module.exports = {
    ERROR_INVALID_ID,
    ERROR_REQUIRED_FIELDS,
    ERROR_NOT_FOUND,
    ERROR_INTERNAL_SERVER_DB,
    ERROR_INTERNAL_SERVER,
    ERROR_CONTENT_TYPE,
    SUCESS_CREATED_ITEM,
    SUCESS_DELETE_ITEM,
    SUCESS_UPDATE_ITEM
}