const nivelExperienciaDAO = require('../model/DAO/nivel_experiencia.js')

const message = require('../modulo/config.js')

const setInserirNovoNivelExperiencia = async (dadosNivelExperiencia, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novoNivelExperienciaJSON = {}

            if (
                dadosNivelExperiencia.nivel_experiencia == '' || dadosNivelExperiencia.nivel_experiencia == undefined || dadosNivelExperiencia.nivel_experiencia == null || dadosNivelExperiencia.nivel_experiencia.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
                let novoNivelExperiencia = await nivelExperienciaDAO.insertNivelExperiencia(dadosNivelExperiencia)

                if (novoNivelExperiencia) {

                    let id = await nivelExperienciaDAO.selectId()

                    novoNivelExperienciaJSON.status = message.SUCESS_CREATED_ITEM.status
                    novoNivelExperienciaJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novoNivelExperienciaJSON.message = message.SUCESS_CREATED_ITEM.message
                    novoNivelExperienciaJSON.id = parseInt(id)
                    novoNivelExperienciaJSON.nivelExperiencia = dadosNivelExperiencia

                    return novoNivelExperienciaJSON //201

                } else {
                    console.log("Erro interno do servidor ao inserir nivel de experiencia no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB //500
                }
            }

        }

    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER
    }
}

const setAtualizarNivelExperiencia = async (dadosNivelExperiencia, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateNivelExperienciaJSON = {}

            if (
                dadosNivelExperiencia.nivel_experiencia == '' || dadosNivelExperiencia.nivel_experiencia == undefined || dadosNivelExperiencia.nivel_experiencia == null || dadosNivelExperiencia.nivel_experiencia.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
               
                let nivelExperienciaAtualizado = await nivelExperienciaDAO.updateNivelExperiencia(id, dadosNivelExperiencia)

                if (nivelExperienciaAtualizado) {
                    let updatedNivelExperiencia = await nivelExperienciaDAO.selectByIdNivelExperiencia(id) 
                    let updatedId = updatedNivelExperiencia[0].id 

                    updateNivelExperienciaJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateNivelExperienciaJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateNivelExperienciaJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateNivelExperienciaJSON.id = updatedId // Usa o id atualizado aqui
                    updateNivelExperienciaJSON.nivelExperiencia = dadosNivelExperiencia

                    return updateNivelExperienciaJSON

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }

        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }
}

const setExcluirNivelExperiencia = async (id) => {

    try {

        let idNivelExperiencia = id

        let validaNivelExperiencia = await getBuscarNivelExperiencia(idNivelExperiencia)

        let dadosNivelExperiencia = await nivelExperienciaDAO.deleteNivelExperiencia(idNivelExperiencia)

        if (idNivelExperiencia == '' || idNivelExperiencia == undefined || isNaN(idNivelExperiencia)) {

            return message.ERROR_INVALID_ID //400

        } else if (validaNivelExperiencia.status == false) {
            return message.ERROR_NOT_FOUND

        } else {

            if (dadosNivelExperiencia)
                return message.SUCESS_DELETE_ITEM // 200
            else
                return message.ERROR_INTERNAL_SERVER_DB

        }


    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}

const getListarNivelExperiencias = async () => {

    //Cria o objeto JSON
    let nivelExperienciaJSON = {}

    let dadosNivelExperiencia = await nivelExperienciaDAO.selectAllNivelExperiencia()

    if (dadosNivelExperiencia) {
        if (dadosNivelExperiencia.length > 0) {
            nivelExperienciaJSON.nivelExperiencias = dadosNivelExperiencia
            nivelExperienciaJSON.quantidade = dadosNivelExperiencia.length
            nivelExperienciaJSON.status_code = 200

            return nivelExperienciaJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarNivelExperiencia = async (id) => {

    let idNivelExperiencia = id

    let nivelExperienciaJSON = {}

    if (idNivelExperiencia == '' || idNivelExperiencia == undefined || isNaN(idNivelExperiencia)) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosNivelExperiencia = await nivelExperienciaDAO.selectByIdNivelExperiencia(idNivelExperiencia)

        if (dadosNivelExperiencia) {

            if (dadosNivelExperiencia.length > 0) {
                nivelExperienciaJSON.nivelExperiencia = dadosNivelExperiencia
                nivelExperienciaJSON.status_code = 200

                return nivelExperienciaJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovoNivelExperiencia,
    setAtualizarNivelExperiencia,
    setExcluirNivelExperiencia,
    getListarNivelExperiencias,
    getBuscarNivelExperiencia
}