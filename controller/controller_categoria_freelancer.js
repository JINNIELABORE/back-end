// Import do arquivo DAO para manipular dados das classificações
const categoriaFreelancerDAO = require('../model/DAO/categoria_freelancer.js')

const message = require('../modulo/config.js')
const { getBuscarCategoria } = require('./controller_categoria.js')

const setInserirNovaCategoriaFreelancer = async (dadosCategoriaFreelancer, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novaCategoriaFreelancerJSON = {}

            if (
                dadosCategoriaFreelancer.id_freelancer == undefined || isNaN(dadosCategoriaFreelancer.id_freelancer) || dadosCategoriaFreelancer.id_freelancer == null ||
                dadosCategoriaFreelancer.id_categoria == undefined || isNaN(dadosCategoriaFreelancer.id_categoria) || dadosCategoriaFreelancer.id_categoria == null
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO inserir
                let novaCategoriaFreelancer = await categoriaFreelancerDAO.insertCategoriaFreelancer(dadosCategoriaFreelancer)

                if (novaCategoriaFreelancer) {
                    let id = await categoriaFreelancerDAO.selectId()
                    novaCategoriaFreelancerJSON.status = message.SUCESS_CREATED_ITEM.status
                    novaCategoriaFreelancerJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novaCategoriaFreelancerJSON.message = message.SUCESS_CREATED_ITEM.message
                    novaCategoriaFreelancerJSON.id = parseInt(id)
                    novaCategoriaFreelancerJSON.categoria_freelancer = dadosCategoriaFreelancer

                    return novaCategoriaFreelancerJSON // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

const setAtualizarCategoriaFreelancer = async (dadosCategoriaFreelancer, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateCategoriaFreelancer = {}

            if (
                dadosCategoriaFreelancer.id_freelancer == undefined || isNaN(dadosCategoriaFreelancer.id_freelancer) || dadosCategoriaFreelancer.id_freelancer == null ||
                dadosCategoriaFreelancer.id_categoria == undefined || isNaN(dadosCategoriaFreelancer.id_categoria) || dadosCategoriaFreelancer.id_categoria == null
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } 

            let categoriaFreelancerAtualizada = await categoriaFreelancerDAO.updateCategoriaFreelancer(id, dadosCategoriaFreelancer)

            if (categoriaFreelancerAtualizada) {
                let updatedCategoriaFreelancer = await categoriaFreelancerDAO.selectByIdCategoriaFreelancer(id)

                if (updatedCategoriaFreelancer && updatedCategoriaFreelancer.length > 0) {
                    let updatedId = updatedCategoriaFreelancer[0].id

                    updateCategoriaFreelancer.status = message.SUCESS_UPDATE_ITEM.status
                    updateCategoriaFreelancer.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateCategoriaFreelancer.message = message.SUCESS_UPDATE_ITEM.message
                    updateCategoriaFreelancer.id = updatedId
                    updateCategoriaFreelancer.categoria_freelancer = dadosCategoriaFreelancer

                    return updateCategoriaFreelancer
                } else {
                    return message.ERROR_NOT_FOUND 
                }
            } else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        console.error("Erro ao atualizar a categoria:", error)
        return message.ERROR_INTERNAL_SERVER
    }
}


const setExcluirCategoriaFreelancer = async (id) => {
    try {
        let idCategoriaFreelancer = id

        // Verifica se o ID é válido antes de buscar
        if (idCategoriaFreelancer === '' || idCategoriaFreelancer === undefined || isNaN(idCategoriaFreelancer)) {
            return message.ERROR_INVALID_ID
        }

        let validaCategoriaFreelancer = await getBuscarCategoriaFreelancer(idCategoriaFreelancer)

        // Verifica se a categoria foi encontrada
        if (validaCategoriaFreelancer.status === false) {
            return message.ERROR_NOT_FOUND
        }

        // Tenta deletar a categoria
        let dadosCategoriaFreelancer = await categoriaFreelancerDAO.deleteCategoriaFreelancer(idCategoriaFreelancer)

        if (dadosCategoriaFreelancer) {
            return message.SUCESS_DELETE_ITEM
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    } catch (error) {
        console.error("Erro ao excluir a categoria:", error) // Log do erro
        return message.ERROR_INTERNAL_SERVER
    }
}


const getListarCategoriasFreelancers = async () => {
    // Cria o objeto JSON
    let CategoriaFreelancersJSON = {}

    // Cria a função DAO para retornar os dados do BD
    let dadosCategoriaFreelancer = await categoriaFreelancerDAO.selectAllCategoriasFreelancer()

    // Validação para criar o JSON de dados
    if (dadosCategoriaFreelancer) {
        if (dadosCategoriaFreelancer.length > 0) {
            CategoriaFreelancersJSON.categoria_freelancer = dadosCategoriaFreelancer
            CategoriaFreelancersJSON.quantidade = dadosCategoriaFreelancer.length
            CategoriaFreelancersJSON.status_code = 200

            return CategoriaFreelancersJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarCategoriaFreelancer = async (id) => {
    let idCategoriaFreelancer = id
    let CategoriaFreelancersJSON = {}

    if (idCategoriaFreelancer == '' || idCategoriaFreelancer == undefined || isNaN(idCategoriaFreelancer)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosCategoriaFreelancer = await categoriaFreelancerDAO.selectByIdCategoriaFreelancer(idCategoriaFreelancer)

        if (dadosCategoriaFreelancer) {
            if (dadosCategoriaFreelancer.length > 0) {
                CategoriaFreelancersJSON.categoria_freelancer = dadosCategoriaFreelancer
                CategoriaFreelancersJSON.status_code = 200

                return CategoriaFreelancersJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}


module.exports = {
    setInserirNovaCategoriaFreelancer,
    setAtualizarCategoriaFreelancer,
    setExcluirCategoriaFreelancer,
    getListarCategoriasFreelancers,
    getBuscarCategoriaFreelancer
}