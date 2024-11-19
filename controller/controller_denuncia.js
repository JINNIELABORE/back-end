const denunciaDAO = require('../model/DAO/denuncia.js')
const disputaDAO = require('../model/DAO/disputa.js')
const message = require('../modulo/config.js')


const setInserirNovaDenuncia = async (dadosDenuncia, contentType) => {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            let novaDenunciaJSON = {}

            if (
                dadosDenuncia.arquivo === '' || dadosDenuncia.arquivo == undefined || dadosDenuncia.arquivo == null || 
                dadosDenuncia.descricao === '' || dadosDenuncia.descricao == undefined || dadosDenuncia.descricao == null || 
                dadosDenuncia.id_denunciante === '' || dadosDenuncia.id_denunciante == undefined || dadosDenuncia.id_denunciante == null || 
                dadosDenuncia.id_denunciado === '' || dadosDenuncia.id_denunciado == undefined || dadosDenuncia.id_denunciado == null
            ) {
                return message.ERROR_REQUIRED_FIELDS
            } else {
                let novaDenuncia = await denunciaDAO.insertDenuncia(dadosDenuncia)
                if (novaDenuncia) {
                    let idDenuncia = await denunciaDAO.selectId() 

                    let dadosDenunciaUsuario = {
                        id_denuncia: idDenuncia,
                        id_denunciante: dadosDenuncia.id_denunciante,
                        tipo_denunciante: dadosDenuncia.tipo_denunciante,
                        id_denunciado: dadosDenuncia.id_denunciado,
                        tipo_denunciado: dadosDenuncia.tipo_denunciado
                    }

                    let resultadoDenunciaUsuario = await disputaDAO.insertDisputa(dadosDenunciaUsuario)
                    if (resultadoDenunciaUsuario) {
                        
                        novaDenunciaJSON.status = true
                        novaDenunciaJSON.status_code = 201
                        novaDenunciaJSON.message = "O item foi criado com sucesso no banco de dados!"
                        novaDenunciaJSON.id = parseInt(idDenuncia)
                        
                        novaDenunciaJSON.denuncia = [{
                            arquivo: dadosDenuncia.arquivo,
                            descricao: dadosDenuncia.descricao,
                            id_denunciante: dadosDenuncia.id_denunciante,
                            tipo_denunciante: dadosDenuncia.tipo_denunciante,
                            id_denunciado: dadosDenuncia.id_denunciado,
                            tipo_denunciado: dadosDenuncia.tipo_denunciado
                        }]
                        
                        return novaDenunciaJSON // 201
                    } else {
                        console.log("Erro ao inserir na tabela 'denuncia_usuario'.")
                        return message.ERROR_INTERNAL_SERVER_DB  // 500
                    }
                } else {
                    console.log("Erro ao inserir avaliação no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB  // 500
                }
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER  // 500
    }
}

const setAtualizarDenuncia = async (dadosDenuncia, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            let updatedenunciaJSON = {}

            if (
                dadosDenuncia.arquivo === '' || dadosDenuncia.arquivo == undefined || dadosDenuncia.arquivo == null ||
                dadosDenuncia.descricao === '' || dadosDenuncia.descricao == undefined || dadosDenuncia.descricao == null ||
                dadosDenuncia.id_denunciante === '' || dadosDenuncia.id_denunciante == undefined || dadosDenuncia.id_denunciante == null ||
                dadosDenuncia.id_denunciado === '' || dadosDenuncia.id_denunciado == undefined || dadosDenuncia.id_denunciado == null
            ) {
                return message.ERROR_REQUIRED_FIELDS  // 400
            } else {
                console.log('Dados para atualizar a avaliação:', dadosDenuncia) 

                let denunciaAtualizada = await denunciaDAO.updateDenuncia(id, dadosDenuncia)

                if (denunciaAtualizada) {
                    let updatedDenuncia = await denunciaDAO.selectByIdDenuncia(id)
                    let updatedId = updatedDenuncia[0].id

                    let dadosDenunciaUsuario = {
                        id_denuncia: updatedId,
                        id_denunciante: dadosDenuncia.id_denunciante,
                        tipo_denunciante: dadosDenuncia.tipo_denunciante,
                        id_denunciado: dadosDenuncia.id_denunciado,
                        tipo_denunciado: dadosDenuncia.tipo_denunciado
                    }

                    let resultadoDenunciaUsuario = await disputaDAO.updateDisputa(updatedId, dadosDenunciaUsuario)
                    if (resultadoDenunciaUsuario) {
                        updatedenunciaJSON.status = true
                        updatedenunciaJSON.status_code = 200
                        updatedenunciaJSON.message = "A avaliação foi atualizada com sucesso!"
                        updatedenunciaJSON.id = parseInt(updatedId)

                        updatedenunciaJSON.denuncia = [{
                            arquivo: dadosDenuncia.arquivo,
                            descricao: dadosDenuncia.descricao,
                            id_denunciante: dadosDenuncia.id_denunciante,
                            tipo_denunciante: dadosDenuncia.tipo_denunciante,
                            id_denunciado: dadosDenuncia.id_denunciado,
                            tipo_denunciado: dadosDenuncia.tipo_denunciado
                        }]
                        
                        return updatedenunciaJSON  // 200
                    } else {
                        console.log("Erro ao atualizar na tabela 'denuncia_usuario'.")
                        return message.ERROR_INTERNAL_SERVER_DB  // 500
                    }
                } else {
                    console.log("Erro ao atualizar avaliação no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB  // 500
                }
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER  // 500
    }
}


const setExcluirDenuncia = async (id) => {
    try {
        if (isNaN(id) || id <= 0) {
            return {
                status: message.ERROR_INVALID_ID.status,
                status_code: message.ERROR_INVALID_ID.status_code,
                message: message.ERROR_INVALID_ID.message
            }
        }

        let validadeDenuncia = await denunciaDAO.selectByIdDenuncia(id)
        if (!validadeDenuncia) {
            return {
                status: message.ERROR_NOT_FOUND.status,
                status_code: message.ERROR_NOT_FOUND.status_code,
                message: message.ERROR_NOT_FOUND.message
            }
        }

        let resultadoIntermediaria = await disputaDAO.deleteDisputa(id)

        if (!resultadoIntermediaria) {
            return {
                status: message.ERROR_INTERNAL_SERVER_DB.status,
                status_code: message.ERROR_INTERNAL_SERVER_DB.status_code,
                message: "Erro ao excluir os registros da tabela intermediária"
            }
        }

        let resultadoDenuncia = await denunciaDAO.deleteDenuncia(id)

        if (resultadoDenuncia) {
            return {
                status: message.SUCESS_DELETE_ITEM.status,
                status_code: message.SUCESS_DELETE_ITEM.status_code,
                message: message.SUCESS_DELETE_ITEM.message
            }
        } else {
            return {
                status: message.ERROR_INTERNAL_SERVER_DB.status,
                status_code: message.ERROR_INTERNAL_SERVER_DB.status_code,
                message: "Erro ao excluir avaliação"
            }
        }

    } catch (error) {
        console.error(error)
        return {
            status: message.ERROR_INTERNAL_SERVER.status,
            status_code: message.ERROR_INTERNAL_SERVER.status_code,
            message: message.ERROR_INTERNAL_SERVER.message
        }
    }
}

const getListarDenuncias = async () => {
    let denunciasJSON = {}
    
    let dadosDenuncias = await denunciaDAO.selectAllDenunciasComUsuarios()

    if (dadosDenuncias) {
        if (dadosDenuncias.length > 0) {
            denunciasJSON.denuncias = dadosDenuncias.map(denuncia => ({
                id: denuncia.id,
                arquivo: denuncia.arquivo,
                descricao: denuncia.descricao,
                id_denunciante: denuncia.id_denunciante,
                tipo_denunciante: denuncia.tipo_denunciante,
                id_denunciado: denuncia.id_denunciado,
                tipo_denunciado: denuncia.tipo_denunciado
            }))
            denunciasJSON.quantidade = dadosDenuncias.length
            denunciasJSON.status_code = 200

            return denunciasJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarDenuncia = async (id) => {
    let idDenuncia = id

    let denunciaJSON = {}

    if (idDenuncia == '' || idDenuncia == undefined || isNaN(idDenuncia)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosDenuncia = await denunciaDAO.selectByIdDenunciaComUsuarios(idDenuncia)

        if (dadosDenuncia) {
            if (dadosDenuncia.length > 0) {
                
                denunciaJSON.denuncia = [{
                    id: dadosDenuncia[0].id,
                    arquivo: dadosDenuncia[0].arquivo,
                    descricao: dadosDenuncia[0].descricao,
                    id_denunciante: dadosDenuncia[0].id_denunciante,
                    tipo_denunciante: dadosDenuncia[0].tipo_denunciante,
                    id_denunciado: dadosDenuncia[0].id_denunciado,
                    tipo_denunciado: dadosDenuncia[0].tipo_denunciado
                }]
                denunciaJSON.status_code = 200

                return denunciaJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovaDenuncia,
    setAtualizarDenuncia,
    setExcluirDenuncia,
    getListarDenuncias,
    getBuscarDenuncia
}