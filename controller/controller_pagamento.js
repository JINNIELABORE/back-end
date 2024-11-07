const pagamentoDAO = require('../model/DAO/pagamento.js')
const message = require('../modulo/config.js')

// Função para inserir um novo pagamento
const setInserirNovoPagamento = async (dadosPagamento, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novoPagamentoJSON = {}

            // Valida se os campos estão corretos
            if (
                dadosPagamento.id_usuario == '' || dadosPagamento.id_usuario == undefined || dadosPagamento.id_usuario == null ||
                dadosPagamento.valor == '' || dadosPagamento.valor == undefined || dadosPagamento.valor == null ||
                dadosPagamento.metodo_pagamento == '' || dadosPagamento.metodo_pagamento == undefined || dadosPagamento.metodo_pagamento == null ||
                dadosPagamento.status_pagamento == '' || dadosPagamento.status_pagamento == undefined || dadosPagamento.status_pagamento == null ||
                dadosPagamento.codigo_transacao == '' || dadosPagamento.codigo_transacao == undefined || dadosPagamento.codigo_transacao == null
            ) {
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                // Insere o novo pagamento
                let novoPagamento = await pagamentoDAO.insertPagamento(dadosPagamento)

                if (novoPagamento) {
                    let id = await pagamentoDAO.selectUltimoIdPagamento()

                    novoPagamentoJSON.status = message.SUCESS_CREATED_ITEM.status
                    novoPagamentoJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novoPagamentoJSON.message = message.SUCESS_CREATED_ITEM.message
                    novoPagamentoJSON.id = parseInt(id)
                    novoPagamentoJSON.pagamento = dadosPagamento

                    return novoPagamentoJSON // 201
                } else {
                    console.log("Erro interno do servidor ao inserir pagamento no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }

        }

    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER
    }
}

// Função para atualizar um pagamento existente
const setAtualizarPagamento = async (dadosPagamento, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updatePagamentoJSON = {}

            // Valida os campos do pagamento
            if (
                dadosPagamento.id_usuario == '' || dadosPagamento.id_usuario == undefined || dadosPagamento.id_usuario == null ||
                dadosPagamento.valor == '' || dadosPagamento.valor == undefined || dadosPagamento.valor == null ||
                dadosPagamento.metodo_pagamento == '' || dadosPagamento.metodo_pagamento == undefined || dadosPagamento.metodo_pagamento == null ||
                dadosPagamento.status_pagamento == '' || dadosPagamento.status_pagamento == undefined || dadosPagamento.status_pagamento == null ||
                dadosPagamento.codigo_transacao == '' || dadosPagamento.codigo_transacao == undefined || dadosPagamento.codigo_transacao == null
            ) {
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                // Atualiza o pagamento
                let pagamentoAtualizado = await pagamentoDAO.updatePagamento(id, dadosPagamento)

                if (pagamentoAtualizado) {
                    let updatedPagamento = await pagamentoDAO.selectByIdPagamento(id)
                    let updatedId = updatedPagamento[0].id

                    updatePagamentoJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updatePagamentoJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updatePagamentoJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updatePagamentoJSON.id = updatedId // Usa o id atualizado aqui
                    updatePagamentoJSON.pagamento = dadosPagamento

                    return updatePagamentoJSON
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }

        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

// Função para excluir um pagamento
const setExcluirPagamento = async (id) => {
    try {
        let idPagamento = id

        let validaPagamento = await getBuscarPagamento(idPagamento)

        let dadosPagamento = await pagamentoDAO.deletePagamento(idPagamento)

        if (idPagamento == '' || idPagamento == undefined || isNaN(idPagamento)) {
            return message.ERROR_INVALID_ID // 400
        } else if (validaPagamento.status == false) {
            return message.ERROR_NOT_FOUND
        } else {
            if (dadosPagamento)
                return message.SUCESS_DELETE_ITEM // 200
            else
                return message.ERROR_INTERNAL_SERVER_DB
        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

// Função para listar todos os pagamentos
const getListarPagamentos = async () => {
    let pagamentosJSON = {}

    let dadosPagamentos = await pagamentoDAO.selectAllPagamentos()

    if (dadosPagamentos) {
        if (dadosPagamentos.length > 0) {
            pagamentosJSON.pagamentos = dadosPagamentos
            pagamentosJSON.quantidade = dadosPagamentos.length
            pagamentosJSON.status_code = 200

            return pagamentosJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

// Função para buscar um pagamento por ID
const getBuscarPagamento = async (id) => {
    let idPagamento = id

    let pagamentoJSON = {}

    if (idPagamento == '' || idPagamento == undefined || isNaN(idPagamento)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosPagamento = await pagamentoDAO.selectByIdPagamento(idPagamento)

        if (dadosPagamento) {
            if (dadosPagamento.length > 0) {
                pagamentoJSON.pagamento = dadosPagamento
                pagamentoJSON.status_code = 200

                return pagamentoJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovoPagamento,
    setAtualizarPagamento,
    setExcluirPagamento,
    getListarPagamentos,
    getBuscarPagamento
}
