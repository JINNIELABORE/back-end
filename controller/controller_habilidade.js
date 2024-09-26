const habilidadeDAO = require('../model/DAO/habilidade.js')

const message = require('../modulo/config.js')

const setInserirNovaHabilidade = async (dadosHabilidade, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novaHabilidadeJSON = {}

            if (
                dadosHabilidade.nome_habilidade == '' || dadosHabilidade.nome_habilidade == undefined || dadosHabilidade.nome_habilidade == null || dadosHabilidade.nome_habilidade.length > 45 ||
                dadosHabilidade.icon_habilidade == '' || dadosHabilidade.icon_habilidade == undefined || dadosHabilidade.icon_habilidade == null || dadosHabilidade.icon_habilidade.length > 400
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
                let novaHabilidade = await habilidadeDAO.insertHabilidade(dadosHabilidade)

                if (novaHabilidade) {

                    let id = await habilidadeDAO.selectId()

                    novaHabilidadeJSON.status = message.SUCESS_CREATED_ITEM.status
                    novaHabilidadeJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novaHabilidadeJSON.message = message.SUCESS_CREATED_ITEM.message
                    novaHabilidadeJSON.id = parseInt(id)
                    novaHabilidadeJSON.habilidade = dadosHabilidade

                    return novaHabilidadeJSON //201

                } else {
                    console.log("Erro interno do servidor ao inserir habilidade no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB //500
                }
            }

        }

    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER
    }
}

const setAtualizarHabilidade = async (dadosHabilidade, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateHabilidadeJSON = {}

            if (
                dadosHabilidade.nome_habilidade == '' || dadosHabilidade.nome_habilidade == undefined || dadosHabilidade.nome_habilidade == null || dadosHabilidade.nome_habilidade.length > 45 ||
                dadosHabilidade.icon_habilidade == '' || dadosHabilidade.icon_habilidade == undefined || dadosHabilidade.icon_habilidade == null || dadosHabilidade.icon_habilidade.length > 400
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
               
                let habilidadeAtualizada = await habilidadeDAO.updateHabilidade(id, dadosHabilidade)

                if (habilidadeAtualizada) {
                    let updatedHabilidade = await habilidadeDAO.selectByIdHabilidade(id) 
                    let updatedId = updatedHabilidade[0].id 

                    updateHabilidadeJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateHabilidadeJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateHabilidadeJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateHabilidadeJSON.id = updatedId // Usa o id atualizado aqui
                    updateHabilidadeJSON.habilidade = dadosHabilidade

                    return updateHabilidadeJSON

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }

        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }
}

const setExcluirHabilidade = async (id) => {

    try {

        let idHabilidade = id

        let validaHabilidade = await getBuscarHabilidade(idHabilidade)

        let dadosHabilidade = await habilidadeDAO.deleteHabilidade(idHabilidade)

        if (idHabilidade == '' || idHabilidade == undefined || isNaN(idHabilidade)) {

            return message.ERROR_INVALID_ID //400

        } else if (validaHabilidade.status == false) {
            return message.ERROR_NOT_FOUND

        } else {

            if (dadosHabilidade)
                return message.SUCESS_DELETE_ITEM // 200
            else
                return message.ERROR_INTERNAL_SERVER_DB

        }


    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}

const getListarHabilidades = async () => {

    //Cria o objeto JSON
    let habilidadesJSON = {}

    let dadosHabilidades = await habilidadeDAO.selectAllhabilidades()

    if (dadosHabilidades) {
        if (dadosHabilidades.length > 0) {
            habilidadesJSON.habilidades = dadosHabilidades
            habilidadesJSON.quantidade = dadosHabilidades.length
            habilidadesJSON.status_code = 200

            return habilidadesJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarHabilidade = async (id) => {

    let idHabilidade = id

    let habilidadeJSON = {}

    if (idHabilidade == '' || idHabilidade == undefined || isNaN(idHabilidade)) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosHabilidade = await habilidadeDAO.selectByIdHabilidade(idHabilidade)

        if (dadosHabilidade) {

            if (dadosHabilidade.length > 0) {
                habilidadeJSON.habilidade = dadosHabilidade
                habilidadeJSON.status_code = 200

                return habilidadeJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovaHabilidade,
    setAtualizarHabilidade,
    setExcluirHabilidade,
    getListarHabilidades,
    getBuscarHabilidade
}