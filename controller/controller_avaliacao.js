const avaliacaoDAO = require('../model/DAO/avaliacao.js')

const message = require('../modulo/config.js')

const setInserirNovaAvaliacao = async (dadosAvaliacao, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novaAvaliacaoJSON = {}

            // Verifica se as estrelas estão entre 1 e 5
            if (
                dadosAvaliacao.estrelas < 1 || dadosAvaliacao.estrelas > 5 ||
                dadosAvaliacao.estrelas == '' || dadosAvaliacao.estrelas == undefined || dadosAvaliacao.estrelas == null || 
                dadosAvaliacao.comentario == '' || dadosAvaliacao.comentario == undefined || dadosAvaliacao.comentario == null
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400

            } else {
                let novaAvaliacao = await avaliacaoDAO.insertAvaliacao(dadosAvaliacao)

                if (novaAvaliacao) {
                    let id = await avaliacaoDAO.selectId()

                    novaAvaliacaoJSON.status = message.SUCESS_CREATED_ITEM.status
                    novaAvaliacaoJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novaAvaliacaoJSON.message = message.SUCESS_CREATED_ITEM.message
                    novaAvaliacaoJSON.id = parseInt(id)
                    novaAvaliacaoJSON.avaliacao = dadosAvaliacao

                    return novaAvaliacaoJSON // 201
                } else {
                    console.log("Erro interno do servidor ao inserir Avaliacao no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}


const setAtualizarAvaliacao = async (dadosAvaliacao, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateAvaliacaoJSON = {}

            if (
                dadosAvaliacao.estrelas == '' || dadosAvaliacao.estrelas == undefined || dadosAvaliacao.estrelas == null || 
                dadosAvaliacao.comentario == '' || dadosAvaliacao.comentario == undefined || dadosAvaliacao.comentario == null
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
               
                let avaliacao = await avaliacaoDAO.updateAvaliacao(id, dadosAvaliacao)

                if (avaliacao) {
                    let updatedAvaliacao = await avaliacaoDAO.selectByIdAvaliacao(id) 
                    let updatedId = updatedAvaliacao[0].id 

                    updateAvaliacaoJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateAvaliacaoJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateAvaliacaoJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateAvaliacaoJSON.id = updatedId // Usa o id atualizado aqui
                    updateAvaliacaoJSON.avaliacao = dadosAvaliacao

                    return updateAvaliacaoJSON

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }

        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }
}

const setExcluirAvaliacao = async (id) => {

    try {

        let idAvaliacao = id

        let validaAvaliacao = await getBuscarAvaliacao(idAvaliacao)

        let dadosAvaliacao = await avaliacaoDAO.deleteAvaliacao(idAvaliacao)

        if (idAvaliacao == '' || idAvaliacao == undefined || isNaN(idAvaliacao)) {

            return message.ERROR_INVALID_ID //400

        } else if (validaAvaliacao.status == false) {
            return message.ERROR_NOT_FOUND

        } else {

            if (dadosAvaliacao)
                return message.SUCESS_DELETE_ITEM // 200
            else
                return message.ERROR_INTERNAL_SERVER_DB

        }


    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}

const getListarAvaliacoes = async () => {

    //Cria o objeto JSON
    let avaliacoesJSON = {}

    let dadosAvaliacoes = await avaliacaoDAO.selectAllAvaliacoes()

    if (dadosAvaliacoes) {
        if (dadosAvaliacoes.length > 0) {
            avaliacoesJSON.avaliacoes = dadosAvaliacoes
            avaliacoesJSON.quantidade = dadosAvaliacoes.length
            avaliacoesJSON.status_code = 200

            return avaliacoesJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarAvaliacao = async (id) => {

    let idAvaliacao = id

    let avaliacaoJSON = {}

    if (idAvaliacao == '' || idAvaliacao == undefined || isNaN(idAvaliacao)) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosAvaliacao = await avaliacaoDAO.selectByIdAvaliacao(idAvaliacao)

        if (dadosAvaliacao) {

            if (dadosAvaliacao.length > 0) {
                avaliacaoJSON.avaliacao = dadosAvaliacao
                avaliacaoJSON.status_code = 200

                return avaliacaoJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovaAvaliacao,
    setAtualizarAvaliacao,
    setExcluirAvaliacao,
    getListarAvaliacoes,
    getBuscarAvaliacao
}