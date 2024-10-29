// Import do arquivo DAO para manipular dados das classificações
const habilidadeProjetoDAO = require('../model/DAO/habilidade_publicacao_projeto.js')

const message = require('../modulo/config.js')
const { getBuscarHabilidade } = require('./controller_habilidade.js')

const setInserirNovaHabilidadeProjeto = async (dadosHabilidadeProjeto, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novaHabilidadeProjetoJSON = {}

            if (
                dadosHabilidadeProjeto.id_projeto == undefined || isNaN(dadosHabilidadeProjeto.id_projeto) || dadosHabilidadeProjeto.id_projeto == null ||
                dadosHabilidadeProjeto.id_habilidade == undefined || isNaN(dadosHabilidadeProjeto.id_habilidade) || dadosHabilidadeProjeto.id_habilidade == null
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO inserir
                let novaHabilidadeProjeto = await habilidadeProjetoDAO.insertHabilidadeProjeto(dadosHabilidadeProjeto)

                if (novaHabilidadeProjeto) {
                    let id = await habilidadeProjetoDAO.selectId()
                    novaHabilidadeProjetoJSON.status = message.SUCESS_CREATED_ITEM.status
                    novaHabilidadeProjetoJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novaHabilidadeProjetoJSON.message = message.SUCESS_CREATED_ITEM.message
                    novaHabilidadeProjetoJSON.id = parseInt(id)
                    novaHabilidadeProjetoJSON.habilidade_Projeto = dadosHabilidadeProjeto

                    return novaHabilidadeProjetoJSON // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

const setAtualizarHabilidadeProjeto = async (dadosHabilidadeProjeto, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateHabilidadeProjeto = {}

            // Valida os campos necessários
            if (
                dadosHabilidadeProjeto.id_projeto == undefined || isNaN(dadosHabilidadeProjeto.id_projeto) || dadosHabilidadeProjeto.id_projeto == null ||
                dadosHabilidadeProjeto.id_habilidade == undefined || isNaN(dadosHabilidadeProjeto.id_habilidade) || dadosHabilidadeProjeto.id_habilidade == null
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            }

            // Atualiza a habilidade
            let habilidadeProjetoAtualizada = await habilidadeProjetoDAO.updateHabilidadeProjeto(id, dadosHabilidadeProjeto)

            if (habilidadeProjetoAtualizada) {
                let updatedHabilidadeProjeto = await habilidadeProjetoDAO.selectByIdHabilidadeProjeto(id)

                // Verifica se a atualização realmente retornou dados
                if (updatedHabilidadeProjeto && updatedHabilidadeProjeto.length > 0) {
                    let updatedId = updatedHabilidadeProjeto[0].id

                    // Constrói o JSON de resposta com o id atualizado
                    updateHabilidadeProjeto.status = message.SUCESS_UPDATE_ITEM.status
                    updateHabilidadeProjeto.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateHabilidadeProjeto.message = message.SUCESS_UPDATE_ITEM.message
                    updateHabilidadeProjeto.id = updatedId
                    updateHabilidadeProjeto.habilidade_Projeto = dadosHabilidadeProjeto

                    return updateHabilidadeProjeto // Retorna a resposta JSON atualizada
                } else {
                    console.error("Habilidade não encontrada após atualização, ID:", id)
                    return message.ERROR_NOT_FOUND // 404 caso não encontre o item
                }
            } else {
                console.error("Falha na atualização da habilidade, ID:", id)
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }
        }
    } catch (error) {
        console.error("Erro ao atualizar a habilidade:", error) // Log do erro
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}



const setExcluirHabilidadeProjeto = async (id) => {
    try {
        let idHabilidadeProjeto = id

        // Verifica se o ID é válido antes de buscar
        if (idHabilidadeProjeto === '' || idHabilidadeProjeto === undefined || isNaN(idHabilidadeProjeto)) {
            return message.ERROR_INVALID_ID
        }

        let validaHabilidadeProjeto = await getBuscarHabilidadeProjeto(idHabilidadeProjeto)

        // Verifica se a habilidade foi encontrada
        if (validaHabilidadeProjeto.status === false) {
            return message.ERROR_NOT_FOUND
        }

        // Tenta deletar a habilidade
        let dadosHabilidadeProjeto = await habilidadeProjetoDAO.deleteHabilidadeProjeto(idHabilidadeProjeto)

        if (dadosHabilidadeProjeto) {
            return message.SUCESS_DELETE_ITEM
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    } catch (error) {
        console.error("Erro ao excluir a habilidade:", error) // Log do erro
        return message.ERROR_INTERNAL_SERVER
    }
}


const getListarHabilidadesProjetos = async () => {
    // Cria o objeto JSON
    let HabilidadeProjetosJSON = {}

    // Cria a função DAO para retornar os dados do BD
    let dadosHabilidadeProjeto = await habilidadeProjetoDAO.selectAllHabilidadeProjetos()

    // Validação para criar o JSON de dados
    if (dadosHabilidadeProjeto) {
        if (dadosHabilidadeProjeto.length > 0) {
            HabilidadeProjetosJSON.habilidade_Projeto = dadosHabilidadeProjeto
            HabilidadeProjetosJSON.quantidade = dadosHabilidadeProjeto.length
            HabilidadeProjetosJSON.status_code = 200

            return HabilidadeProjetosJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarHabilidadeProjeto = async (id) => {
    let idHabilidadeProjeto = id
    let habilidadeProjetosJSON = {}

    if (idHabilidadeProjeto == '' || idHabilidadeProjeto == undefined || isNaN(idHabilidadeProjeto)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosHabilidadeProjeto = await habilidadeProjetoDAO.selectByIdHabilidadeProjeto(idHabilidadeProjeto)

        if (dadosHabilidadeProjeto) {
            if (dadosHabilidadeProjeto.length > 0) {
                habilidadeProjetosJSON.habilidade_Projeto = dadosHabilidadeProjeto
                habilidadeProjetosJSON.status_code = 200

                return habilidadeProjetosJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}


module.exports = {
    setInserirNovaHabilidadeProjeto,
    setAtualizarHabilidadeProjeto,
    setExcluirHabilidadeProjeto,
    getListarHabilidadesProjetos,
    getBuscarHabilidadeProjeto
}
