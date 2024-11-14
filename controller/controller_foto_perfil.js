// Import do arquivo DAO para manipular dados das fotos de perfil
const fotoPerfilDAO = require('../model/DAO/foto_perfil.js')

const message = require('../modulo/config.js')

const setInserirNovaFotoPerfil = async (dadosFotoPerfil, contentType) => {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            let novaFotoPerfilJSON = {}

            // Verifica se a foto está presente e se apenas um dos IDs (cliente ou freelancer) está preenchido
            if (!dadosFotoPerfil.foto_perfil || 
                (dadosFotoPerfil.id_cliente && dadosFotoPerfil.id_freelancer) || 
                (!dadosFotoPerfil.id_cliente && !dadosFotoPerfil.id_freelancer)) {
                return {
                    status: 'error',
                    status_code: 400,
                    message: "Campos obrigatórios estão faltando ou IDs inválidos."
                } // 400
            } else {
                // Verifica se já existe uma foto de perfil associada ao cliente ou freelancer
                let fotoExistente = await fotoPerfilDAO.checkFotoPerfilExistente(dadosFotoPerfil.id_cliente, dadosFotoPerfil.id_freelancer);
                
                if (fotoExistente) {
                    return { 
                        status: 'error',
                        status_code: 409, // 409 Conflict
                        message: "Usuário já possui uma foto de perfil cadastrada." 
                    };
                }

                // Encaminha os dados para o DAO inserir
                let novaFotoPerfil = await fotoPerfilDAO.insertFotoPerfil(dadosFotoPerfil);

                if (novaFotoPerfil) {
                    let id = await fotoPerfilDAO.selectId();
                    novaFotoPerfilJSON.status = 'success';
                    novaFotoPerfilJSON.status_code = 201; // 201 Created
                    novaFotoPerfilJSON.message = "Foto de perfil inserida com sucesso.";
                    novaFotoPerfilJSON.id = parseInt(id);
                    novaFotoPerfilJSON.foto_perfil = dadosFotoPerfil;

                    return novaFotoPerfilJSON; // 201
                } else {
                    return {
                        status: 'error',
                        status_code: 500,
                        message: "Erro interno ao tentar inserir a foto de perfil."
                    };
                }
            }
        }
    } catch (error) {
        console.error("Erro ao inserir nova foto de perfil:", error);
        return {
            status: 'error',
            status_code: 500,
            message: "Erro ao processar a requisição na camada da controller."
        }; // 500 erro na camada da controller
    }
}


const setAtualizarFotoPerfil = async (dadosFotoPerfil, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            let updateFotoPerfilJSON = {}

            // Verifica se a foto está presente e se apenas um dos IDs (cliente ou freelancer) está preenchido
            if (!dadosFotoPerfil.foto_perfil || 
                (dadosFotoPerfil.id_cliente && dadosFotoPerfil.id_freelancer)) {
                return message.ERROR_REQUIRED_FIELDS // 400
            }

            let fotoPerfilAtualizada = await fotoPerfilDAO.updateFotoPerfil(id, dadosFotoPerfil)

            if (fotoPerfilAtualizada) {
                let updatedFotoPerfil = await fotoPerfilDAO.selectByIdFotoPerfil(id)

                if (updatedFotoPerfil && updatedFotoPerfil.length > 0) {
                    let updatedId = updatedFotoPerfil[0].id

                    updateFotoPerfilJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateFotoPerfilJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateFotoPerfilJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateFotoPerfilJSON.id = updatedId
                    updateFotoPerfilJSON.foto_perfil = dadosFotoPerfil

                    return updateFotoPerfilJSON // Retorna a resposta JSON atualizada
                } else {
                    console.error("Foto de perfil não encontrada após atualização, ID:", id)
                    return message.ERROR_NOT_FOUND // 404 caso não encontre o item
                }
            } else {
                console.error("Falha na atualização da foto de perfil, ID:", id)
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }
        }
    } catch (error) {
        console.error("Erro ao atualizar a foto de perfil:", error)
   
    }
}
const setExcluirFotoPerfil = async (id) => {
    try {
        let idFotoPerfil = id

        if (idFotoPerfil === '' || idFotoPerfil === undefined || isNaN(idFotoPerfil)) {
            return message.ERROR_INVALID_ID
        }

        let validaFotoPerfil = await getBuscarFotoPerfil(idFotoPerfil)

        if (validaFotoPerfil.status === false) {
            return message.ERROR_NOT_FOUND
        }

        let dadosFotoPerfil = await fotoPerfilDAO.deleteFotoPerfil(idFotoPerfil)

        if (dadosFotoPerfil) {
            return message.SUCESS_DELETE_ITEM
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    } catch (error) {
        console.error("Erro ao excluir a foto de perfil:", error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const getListarFotosPerfis = async () => {
    let fotoPerfisJSON = {}

    let dadosFotoPerfil = await fotoPerfilDAO.selectAllFotoPerfis()

    if (dadosFotoPerfil) {
        if (dadosFotoPerfil.length > 0) {
            fotoPerfisJSON.foto_Perfil = dadosFotoPerfil
            fotoPerfisJSON.quantidade = dadosFotoPerfil.length
            fotoPerfisJSON.status_code = 200

            return fotoPerfisJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarFotoPerfil = async (id) => {
    let idFotoPerfil = id
    let fotoPerfilJSON = {}

    if (idFotoPerfil == '' || idFotoPerfil == undefined || isNaN(idFotoPerfil)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosFotoPerfil = await fotoPerfilDAO.selectByIdFotoPerfil(idFotoPerfil)

        if (dadosFotoPerfil) {
            if (dadosFotoPerfil.length > 0) {
                fotoPerfilJSON.foto_Perfil = dadosFotoPerfil
                fotoPerfilJSON.status_code = 200

                return fotoPerfilJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovaFotoPerfil,
    setAtualizarFotoPerfil,
    setExcluirFotoPerfil,
    getListarFotosPerfis,
    getBuscarFotoPerfil
}
