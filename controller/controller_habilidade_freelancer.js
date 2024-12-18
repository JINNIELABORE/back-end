// Import do arquivo DAO para manipular dados das classificações
const habilidadeFreelancerDAO = require('../model/DAO/habilidade_freelancer.js')

const message = require('../modulo/config.js')


const setInserirNovaHabilidadeFreelancer = async (dadosHabilidadeFreelancer, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            // Verifica se os campos obrigatórios estão presentes
            if (
                dadosHabilidadeFreelancer.id_freelancer == undefined || isNaN(dadosHabilidadeFreelancer.id_freelancer) || dadosHabilidadeFreelancer.id_freelancer == null ||
                dadosHabilidadeFreelancer.id_habilidade == undefined || !Array.isArray(dadosHabilidadeFreelancer.id_habilidade) || dadosHabilidadeFreelancer.id_habilidade.length == 0
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                let resultadoFinal = []

                // Loop para processar cada habilidade no array
                for (let habilidadeId of dadosHabilidadeFreelancer.id_habilidade) {
                    // Cria um objeto para cada habilidade
                    let dados = {
                        id_freelancer: dadosHabilidadeFreelancer.id_freelancer,
                        id_habilidade: habilidadeId
                    }

                    // Tenta inserir cada habilidade no banco de dados
                    let novaHabilidadeFreelancer = await habilidadeFreelancerDAO.insertHabilidadeFreelancer(dados)

                    if (novaHabilidadeFreelancer) {
                        let id = await habilidadeFreelancerDAO.selectId()
                        let novaHabilidadeFreelancerJSON = {
                            status: message.SUCESS_CREATED_ITEM.status,
                            status_code: message.SUCESS_CREATED_ITEM.status_code,
                            message: message.SUCESS_CREATED_ITEM.message,
                            id: parseInt(id),
                            habilidade_freelancer: dados
                        }

                        resultadoFinal.push(novaHabilidadeFreelancerJSON) // Adiciona o resultado de cada inserção
                    } else {
                        // Se falhar a inserção de alguma habilidade, retorna erro
                        return message.ERROR_INTERNAL_SERVER_DB // 500
                    }
                }

                // Se todas as inserções forem bem-sucedidas, retorna a lista de habilidades inseridas
                return {
                    status: message.SUCESS_CREATED_ITEM.status,
                    status_code: message.SUCESS_CREATED_ITEM.status_code,
                    message: 'Habilidades inseridas com sucesso',
                    habilidades_inseridas: resultadoFinal
                } // 201
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}


const setAtualizarHabilidadeFreelancer = async (dadosHabilidadeFreelancer, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateHabilidadeFreelancer = {}

            if (
                dadosHabilidadeFreelancer.id_freelancer == undefined || isNaN(dadosHabilidadeFreelancer.id_freelancer) || dadosHabilidadeFreelancer.id_freelancer == null ||
                dadosHabilidadeFreelancer.id_habilidade == undefined || isNaN(dadosHabilidadeFreelancer.id_habilidade) || dadosHabilidadeFreelancer.id_habilidade == null 
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO atualizar
                let habilidadeFreelancerAtualizada = await habilidadeFreelancerDAO.updateHabilidadeFreelancer(id, dadosHabilidadeFreelancer)

                if (habilidadeFreelancerAtualizada) {
                    let updatedHabilidadeFreelancer = await habilidadeFreelancerDAO.selectByIdHabilidadeFreelancer(id) 
                    let updatedId = updatedHabilidadeFreelancer[0].id

                    // Constrói o JSON de resposta com o id atualizado
                    updateHabilidadeFreelancer.status = message.SUCESS_UPDATE_ITEM.status
                    updateHabilidadeFreelancer.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateHabilidadeFreelancer.message = message.SUCESS_UPDATE_ITEM.message
                    updateHabilidadeFreelancer.id = updatedId 
                    updateHabilidadeFreelancer.habilidade_freelancer = dadosHabilidadeFreelancer

                    return updateHabilidadeFreelancer // Retorna a resposta JSON atualizada
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

const setExcluirHabilidadeFreelancer = async (id) => {

    try {

        let idHabilidadeFreelancer = id

        let validaHabilidadeFreelancer = await getBuscarHabilidadeFreelancer(idHabilidadeFreelancer)

        let dadosHabilidadeFreelancer = await habilidadeFreelancerDAO.deleteHabilidadeFreelancer(idHabilidadeFreelancer)

        if (idHabilidadeFreelancer == '' || idHabilidadeFreelancer == undefined || isNaN(idHabilidadeFreelancer)) {
           
            return message.ERROR_INVALID_ID // 400

        } else if (validaHabilidadeFreelancer.status == false) {
            return message.ERROR_NOT_FOUND
            
        } else {
            
            if (dadosHabilidadeFreelancer) 
                return message.SUCESS_DELETE_ITEM // 200
             else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getListarHabilidadesFreelancer = async () => {
    // Cria o objeto JSON
    let habilidadesFreelancerJSON = {}

    // Cria a função DAO para retornar os dados do BD
    let dadosHabilidadeFreelancer = await habilidadeFreelancerDAO.selectAllHabilidadesFreelancer()

    // Validação para criar o JSON de dados
    if (dadosHabilidadeFreelancer) {
        if (dadosHabilidadeFreelancer.length > 0) {
            habilidadesFreelancerJSON.habilidade_freelancer = dadosHabilidadeFreelancer
            habilidadesFreelancerJSON.quantidade = dadosHabilidadeFreelancer.length
            habilidadesFreelancerJSON.status_code = 200

            return habilidadesFreelancerJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarHabilidadeFreelancer = async (id) => {
    let idHabilidadeFreelancer = id
    let habilidadesFreelancerJSON = {}

    if (idHabilidadeFreelancer == '' || idHabilidadeFreelancer == undefined || isNaN(idHabilidadeFreelancer)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosHabilidadeFreelancer = await habilidadeFreelancerDAO.selectByIdHabilidadeFreelancer(idHabilidadeFreelancer)

        if (dadosHabilidadeFreelancer) {
            if (dadosHabilidadeFreelancer.length > 0) {
                habilidadesFreelancerJSON.habilidade_freelancer = dadosHabilidadeFreelancer
                habilidadesFreelancerJSON.status_code = 200

                return habilidadesFreelancerJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}


module.exports = {
    setInserirNovaHabilidadeFreelancer,
    setAtualizarHabilidadeFreelancer,
    setExcluirHabilidadeFreelancer,
    getListarHabilidadesFreelancer,
    getBuscarHabilidadeFreelancer
}