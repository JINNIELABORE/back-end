// Import do arquivo DAO para manipular dados das descrições de perfil
const descricaoPerfilDAO = require('../model/DAO/descricao_perfil.js')

const message = require('../modulo/config.js')

const setInserirNovaDescricaoPerfil = async (dadosDescricaoPerfil, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novaDescricaoPerfilJSON = {}

            if (
                dadosDescricaoPerfil.descricao == undefined || dadosDescricaoPerfil.descricao == null ||
                (dadosDescricaoPerfil.id_cliente == undefined && dadosDescricaoPerfil.id_freelancer == undefined) ||
                (dadosDescricaoPerfil.id_cliente != undefined && isNaN(dadosDescricaoPerfil.id_cliente)) ||
                (dadosDescricaoPerfil.id_freelancer != undefined && isNaN(dadosDescricaoPerfil.id_freelancer))
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO inserir
                let novaDescricaoPerfil = await descricaoPerfilDAO.insertDescricaoPerfil(dadosDescricaoPerfil)

                if (novaDescricaoPerfil) {
                    let id = await descricaoPerfilDAO.selectId()
                    novaDescricaoPerfilJSON.status = message.SUCESS_CREATED_ITEM.status
                    novaDescricaoPerfilJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novaDescricaoPerfilJSON.message = message.SUCESS_CREATED_ITEM.message
                    novaDescricaoPerfilJSON.id = parseInt(id)
                    novaDescricaoPerfilJSON.descricao_Perfil = dadosDescricaoPerfil

                    return novaDescricaoPerfilJSON // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

const setAtualizarDescricaoPerfil = async (dadosDescricaoPerfil, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateDescricaoPerfil = {}

            if (
                dadosDescricaoPerfil.descricao == undefined || dadosDescricaoPerfil.descricao == null ||
                (dadosDescricaoPerfil.id_cliente == undefined && dadosDescricaoPerfil.id_freelancer == undefined) ||
                (dadosDescricaoPerfil.id_cliente != undefined && isNaN(dadosDescricaoPerfil.id_cliente)) ||
                (dadosDescricaoPerfil.id_freelancer != undefined && isNaN(dadosDescricaoPerfil.id_freelancer))
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            }

            let descricaoPerfilAtualizada = await descricaoPerfilDAO.updateDescricaoPerfil(id, dadosDescricaoPerfil)

            if (descricaoPerfilAtualizada) {
                let updatedDescricaoPerfil = await descricaoPerfilDAO.selectByIdDescricaoPerfil(id)

                if (updatedDescricaoPerfil && updatedDescricaoPerfil.length > 0) {
                    let updatedId = updatedDescricaoPerfil[0].id

                    updateDescricaoPerfil.status = message.SUCESS_UPDATE_ITEM.status
                    updateDescricaoPerfil.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateDescricaoPerfil.message = message.SUCESS_UPDATE_ITEM.message
                    updateDescricaoPerfil.id = updatedId
                    updateDescricaoPerfil.descricao_Perfil = dadosDescricaoPerfil

                    return updateDescricaoPerfil // Retorna a resposta JSON atualizada
                } else {
                    console.error("Descrição de perfil não encontrada após atualização, ID:", id)
                    return message.ERROR_NOT_FOUND // 404 caso não encontre o item
                }
            } else {
                console.error("Falha na atualização da descrição de perfil, ID:", id)
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }
        }
    } catch (error) {
        console.error("Erro ao atualizar a descrição de perfil:", error)
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

const setExcluirDescricaoPerfil = async (id) => {
    try {
        let idDescricaoPerfil = id

        if (idDescricaoPerfil === '' || idDescricaoPerfil === undefined || isNaN(idDescricaoPerfil)) {
            return message.ERROR_INVALID_ID
        }

        let validaDescricaoPerfil = await getBuscarDescricaoPerfil(idDescricaoPerfil)

        if (validaDescricaoPerfil.status === false) {
            return message.ERROR_NOT_FOUND
        }

        let dadosDescricaoPerfil = await descricaoPerfilDAO.deleteDescricaoPerfil(idDescricaoPerfil)

        if (dadosDescricaoPerfil) {
            return message.SUCESS_DELETE_ITEM
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    } catch (error) {
        console.error("Erro ao excluir a descrição de perfil:", error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const getListarDescricoesPerfis = async () => {
    let descricaoPerfisJSON = {}

    let dadosDescricaoPerfil = await descricaoPerfilDAO.selectAllDescricaoPerfis()

    if (dadosDescricaoPerfil) {
        if (dadosDescricaoPerfil.length > 0) {
            descricaoPerfisJSON.descricao_Perfil = dadosDescricaoPerfil
            descricaoPerfisJSON.quantidade = dadosDescricaoPerfil.length
            descricaoPerfisJSON.status_code = 200

            return descricaoPerfisJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarDescricaoPerfil = async (id) => {
    let idDescricaoPerfil = id
    let descricaoPerfilJSON = {}

    if (idDescricaoPerfil == '' || idDescricaoPerfil == undefined || isNaN(idDescricaoPerfil)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosDescricaoPerfil = await descricaoPerfilDAO.selectByIdDescricaoPerfil(idDescricaoPerfil)

        if (dadosDescricaoPerfil) {
            if (dadosDescricaoPerfil.length > 0) {
                descricaoPerfilJSON.descricao_Perfil = dadosDescricaoPerfil
                descricaoPerfilJSON.status_code = 200

                return descricaoPerfilJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovaDescricaoPerfil,
    setAtualizarDescricaoPerfil,
    setExcluirDescricaoPerfil,
    getListarDescricoesPerfis,
    getBuscarDescricaoPerfil
}
