// Import do arquivo DAO para manipular dados das classificações
const categoriaFreelancerDAO = require('../model/DAO/categoria_freelancer.js')

const message = require('../modulo/config.js')
const { getBuscarCategoria } = require('./controller_categoria.js')

const setInserirNovaCategoriaFreelancer = async (dadosCategoriaFreelancer, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            if (
                dadosCategoriaFreelancer.id_freelancer == undefined || isNaN(dadosCategoriaFreelancer.id_freelancer) || dadosCategoriaFreelancer.id_freelancer == null ||
                dadosCategoriaFreelancer.id_categoria == undefined || !Array.isArray(dadosCategoriaFreelancer.id_categoria) || dadosCategoriaFreelancer.id_categoria.length == 0
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                let resultadoFinal = []

                // Loop para processar cada categoria no array
                for (let categoriaId of dadosCategoriaFreelancer.id_categoria) {
                    // Cria um objeto para cada categoria
                    let dados = {
                        id_freelancer: dadosCategoriaFreelancer.id_freelancer,
                        id_categoria: categoriaId
                    }

                    // Tenta inserir cada categoria no banco de dados
                    let novaCategoriaFreelancer = await categoriaFreelancerDAO.insertCategoriaFreelancer(dados)

                    if (novaCategoriaFreelancer) {
                        let id = await categoriaFreelancerDAO.selectId()
                        let novaCategoriaFreelancerJSON = {
                            status: message.SUCESS_CREATED_ITEM.status,
                            status_code: message.SUCESS_CREATED_ITEM.status_code,
                            message: message.SUCESS_CREATED_ITEM.message,
                            id: parseInt(id),
                            categoria_freelancer: dados
                        }

                        resultadoFinal.push(novaCategoriaFreelancerJSON) // Adiciona o resultado de cada inserção
                    } else {
                        // Se falhar a inserção de alguma categoria, retorna erro
                        return message.ERROR_INTERNAL_SERVER_DB // 500
                    }
                }

                // Se todas as inserções forem bem-sucedidas, retorna a lista de categorias inseridas
                return {
                    status: message.SUCESS_CREATED_ITEM.status,
                    status_code: message.SUCESS_CREATED_ITEM.status_code,
                    message: 'Categorias inseridas com sucesso',
                    categorias_inseridas: resultadoFinal
                } // 201
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

            // Valida os campos necessários
            if (
                dadosCategoriaFreelancer.id_freelancer == undefined || isNaN(dadosCategoriaFreelancer.id_freelancer) || dadosCategoriaFreelancer.id_freelancer == null ||
                dadosCategoriaFreelancer.id_categoria == undefined || isNaN(dadosCategoriaFreelancer.id_categoria) || dadosCategoriaFreelancer.id_categoria == null
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            }

            // Atualiza a categoria
            let categoriaFreelancerAtualizada = await categoriaFreelancerDAO.updateCategoriaFreelancer(id, dadosCategoriaFreelancer)

            if (categoriaFreelancerAtualizada) {
                let updatedCategoriaFreelancer = await categoriaFreelancerDAO.selectByIdCategoriaFreelancer(id)

                // Verifica se a atualização realmente retornou dados
                if (updatedCategoriaFreelancer && updatedCategoriaFreelancer.length > 0) {
                    let updatedId = updatedCategoriaFreelancer[0].id

                    // Constrói o JSON de resposta com o id atualizado
                    updateCategoriaFreelancer.status = message.SUCESS_UPDATE_ITEM.status
                    updateCategoriaFreelancer.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateCategoriaFreelancer.message = message.SUCESS_UPDATE_ITEM.message
                    updateCategoriaFreelancer.id = updatedId
                    updateCategoriaFreelancer.categoria_freelancer = dadosCategoriaFreelancer

                    return updateCategoriaFreelancer // Retorna a resposta JSON atualizada
                } else {
                    console.error("Categoria não encontrada após atualização, ID:", id)
                    return message.ERROR_NOT_FOUND // 404 caso não encontre o item
                }
            } else {
                console.error("Falha na atualização da categoria, ID:", id)
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }
        }
    } catch (error) {
        console.error("Erro ao atualizar a categoria:", error) // Log do erro
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
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