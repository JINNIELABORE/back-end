const solicitacaoDao = require('../model/DAO/solicitacao_pagamento.js')
const message = require('../modulo/config.js')

const setInserirNovaSolicitacao = async (dadosSolicitacaoPagamento, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novaSolicitacaoJson = {}

            // Atualizando validações
            if (
                dadosSolicitacaoPagamento.id_freelancer == '' || dadosSolicitacaoPagamento.id_freelancer == undefined || dadosSolicitacaoPagamento.id_freelancer == null ||
                dadosSolicitacaoPagamento.valor_solicitado == '' || dadosSolicitacaoPagamento.valor_solicitado == undefined || dadosSolicitacaoPagamento.valor_solicitado == null ||
                dadosSolicitacaoPagamento.banco == '' || dadosSolicitacaoPagamento.banco == undefined || dadosSolicitacaoPagamento.banco == null ||
                dadosSolicitacaoPagamento.agencia == '' || dadosSolicitacaoPagamento.agencia == undefined || dadosSolicitacaoPagamento.agencia == null ||
                dadosSolicitacaoPagamento.numero_conta == '' || dadosSolicitacaoPagamento.numero_conta == undefined || dadosSolicitacaoPagamento.numero_conta == null ||
                dadosSolicitacaoPagamento.tipo_conta == '' || dadosSolicitacaoPagamento.tipo_conta == undefined || dadosSolicitacaoPagamento.tipo_conta == null ||
                dadosSolicitacaoPagamento.nome_completo_titular == '' || dadosSolicitacaoPagamento.nome_completo_titular == undefined || dadosSolicitacaoPagamento.nome_completo_titular == null ||
                dadosSolicitacaoPagamento.cpf == '' || dadosSolicitacaoPagamento.cpf == undefined || dadosSolicitacaoPagamento.cpf == null ||
                dadosSolicitacaoPagamento.id_freelancer.length > 45 || 
                dadosSolicitacaoPagamento.cpf.length != 11 || 
                dadosSolicitacaoPagamento.valor_solicitado.length > 400
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                let novaSolicitacao = await solicitacaoDao.insertSolicitacaoPagamento(dadosSolicitacaoPagamento)

                if (novaSolicitacao) {
                    let id = await solicitacaoDao.selectId()

                    novaSolicitacaoJson.status = message.SUCESS_CREATED_ITEM.status
                    novaSolicitacaoJson.status_code = message.SUCESS_CREATED_ITEM.status_code
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

            // Atualizando validações
            if (
                dadosSolicitacaoPagamento.status_pago == '' || dadosSolicitacaoPagamento.status_pago == undefined || dadosSolicitacaoPagamento.status_pago == null 
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                let solicitacaoPagamentoAtualizada = await solicitacaoDao.updateSolicitacaoPagamento(id, dadosSolicitacaoPagamento)

                if (solicitacaoPagamentoAtualizada) {
                    let updatedSolicitacaoPagamento = await solicitacaoDao.selectByIdSolicitacao(id) 
                    let updatedId = updatedSolicitacaoPagamento[0].id 

                    updateSolicitacaoPagamentoJson.status = message.SUCESS_UPDATE_ITEM.status
                    updateSolicitacaoPagamentoJson.status_code = message.SUCESS_UPDATE_ITEM.status_code
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
            solicitacoesPagamentosJson.status_code = 200

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
                solicitacaoPagamentoJson.status_code = 200

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
