const solicitacaoDao = require('../model/DAO/solicitacao_pagamento.js')
const message = require('../modulo/config.js')

const setInserirNovaSolicitacao = async (dadosSolicitacaoPagamento, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novaSolicitacaoJson = {}

            if (
                dadosSolicitacaoPagamento.idFreelancer == '' || dadosSolicitacaoPagamento.idFreelancer == undefined || dadosSolicitacaoPagamento.idFreelancer == null || dadosSolicitacaoPagamento.idFreelancer.length > 45 ||
                dadosSolicitacaoPagamento.valorSolicitado == '' || dadosSolicitacaoPagamento.valorSolicitado == undefined || dadosSolicitacaoPagamento.valorSolicitado == null || dadosSolicitacaoPagamento.valorSolicitado.length > 400
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                let novaSolicitacao = await solicitacaoDao.insertSolicitacaoPagamento(dadosSolicitacaoPagamento)

                if (novaSolicitacao) {
                    let id = await solicitacaoDao.selectId()

                    novaSolicitacaoJson.status = message.SUCESS_CREATED_ITEM.status
                    novaSolicitacaoJson.statusCode = message.SUCESS_CREATED_ITEM.status_code
                    novaSolicitacaoJson.message = message.SUCESS_CREATED_ITEM.message
                    novaSolicitacaoJson.id = parseInt(id)
                    novaSolicitacaoJson.solicitacaoPagamento = dadosSolicitacaoPagamento

                    return novaSolicitacaoJson // 201
                } else {
                    console.log("Erro interno do servidor ao inserir solicitação de pagamento no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }

    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER
    }
}

const setAtualizarSolicitacaoPagamento = async (dadosSolicitacaoPagamento, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateSolicitacaoPagamentoJson = {}

            if (
                dadosSolicitacaoPagamento.idFreelancer == '' || dadosSolicitacaoPagamento.idFreelancer == undefined || dadosSolicitacaoPagamento.idFreelancer == null || dadosSolicitacaoPagamento.idFreelancer.length > 45 ||
                dadosSolicitacaoPagamento.valorSolicitado == '' || dadosSolicitacaoPagamento.valorSolicitado == undefined || dadosSolicitacaoPagamento.valorSolicitado == null || dadosSolicitacaoPagamento.valorSolicitado.length > 400
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                let solicitacaoPagamentoAtualizada = await solicitacaoDao.updateSolicitacaoPagamento(id, dadosSolicitacaoPagamento)

                if (solicitacaoPagamentoAtualizada) {
                    let updatedSolicitacaoPagamento = await solicitacaoDao.selectByIdSolicitacao(id) 
                    let updatedId = updatedSolicitacaoPagamento[0].id 

                    updateSolicitacaoPagamentoJson.status = message.SUCESS_UPDATE_ITEM.status
                    updateSolicitacaoPagamentoJson.statusCode = message.SUCESS_UPDATE_ITEM.status_code
                    updateSolicitacaoPagamentoJson.message = message.SUCESS_UPDATE_ITEM.message
                    updateSolicitacaoPagamentoJson.id = updatedId // Usa o id atualizado aqui
                    updateSolicitacaoPagamentoJson.solicitacaoPagamento = dadosSolicitacaoPagamento

                    return updateSolicitacaoPagamentoJson
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

const setExcluirSolicitacaoPagamento = async (id) => {
    try {
        let idSolicitacaoPagamento = id
        let validaSolicitacaoPagamento = await getBuscarSolicitacaoPagamento(idSolicitacaoPagamento)

        let dadosSolicitacaoPagamento = await solicitacaoDao.deleteSolicitacaoPagamento(idSolicitacaoPagamento)

        if (idSolicitacaoPagamento == '' || idSolicitacaoPagamento == undefined || isNaN(idSolicitacaoPagamento)) {
            return message.ERROR_INVALID_ID // 400
        } else if (validaSolicitacaoPagamento.status == false) {
            return message.ERROR_NOT_FOUND
        } else {
            if (dadosSolicitacaoPagamento)
                return message.SUCESS_DELETE_ITEM // 200
            else
                return message.ERROR_INTERNAL_SERVER_DB
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getListarSolicitacao = async () => {
    // Cria o objeto JSON
    let solicitacoesPagamentosJson = {}

    let dadosSolicitacaoPagamentos = await solicitacaoDao.selectAllSolicitacaoPagamento()

    if (dadosSolicitacaoPagamentos) {
        if (dadosSolicitacaoPagamentos.length > 0) {
            solicitacoesPagamentosJson.solicitacoesPagamentos = dadosSolicitacaoPagamentos
            solicitacoesPagamentosJson.quantidade = dadosSolicitacaoPagamentos.length
            solicitacoesPagamentosJson.statusCode = 200

            return solicitacoesPagamentosJson
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarSolicitacaoPagamento = async (id) => {
    let idSolicitacaoPagamento = id
    let solicitacaoPagamentoJson = {}

    if (idSolicitacaoPagamento == '' || idSolicitacaoPagamento == undefined || isNaN(idSolicitacaoPagamento)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosSolicitacaoPagamento = await solicitacaoDao.selectByIdSolicitacao(idSolicitacaoPagamento)

        if (dadosSolicitacaoPagamento) {
            if (dadosSolicitacaoPagamento.length > 0) {
                solicitacaoPagamentoJson.solicitacaoPagamento = dadosSolicitacaoPagamento
                solicitacaoPagamentoJson.statusCode = 200

                return solicitacaoPagamentoJson
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovaSolicitacao,
    setAtualizarSolicitacaoPagamento,
    setExcluirSolicitacaoPagamento,
    getListarSolicitacao,
    getBuscarSolicitacaoPagamento
}
