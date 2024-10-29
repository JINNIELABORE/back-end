// Import do arquivo DAO para manipular dados das classificações
const portfolioFreelancerDAO = require('../model/DAO/portfolio_freelancer.js')

const message = require('../modulo/config.js')

const setInserirNovoPortfolioFreelancer = async (dadosPortfolioFreelancer, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novoPortfolioFreelancerJSON = {}

            if (
                dadosPortfolioFreelancer.id_portfolio == undefined || isNaN(dadosPortfolioFreelancer.id_freelancer) || dadosPortfolioFreelancer.id_freelancer == null ||
                dadosPortfolioFreelancer.id_freelancer == undefined || isNaN(dadosPortfolioFreelancer.id_portfolio) || dadosPortfolioFreelancer.id_portfolio == null 
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO inserir
                let novoPortfolioFreelancer = await portfolioFreelancerDAO.insertPortfolioFreelancer(dadosPortfolioFreelancer)

                if (novoPortfolioFreelancer) {
                    let id = await portfolioFreelancerDAO.selectId()
                    novoPortfolioFreelancerJSON.status = message.SUCESS_CREATED_ITEM.status
                    novoPortfolioFreelancerJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novoPortfolioFreelancerJSON.message = message.SUCESS_CREATED_ITEM.message
                    novoPortfolioFreelancerJSON.id = parseInt(id)
                    novoPortfolioFreelancerJSON.portfolio_freelancer = dadosPortfolioFreelancer

                    return novoPortfolioFreelancerJSON // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

const setAtualizarPortfolioFreelancer = async (dadosPortfolioFreelancer, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updatePortfolioFreelancer = {}

            if (
                dadosPortfolioFreelancer.id_freelancer == undefined || isNaN(dadosPortfolioFreelancer.id_freelancer) || dadosPortfolioFreelancer.id_freelancer == null ||
                dadosPortfolioFreelancer.id_portfolio == undefined || isNaN(dadosPortfolioFreelancer.id_portfolio) || dadosPortfolioFreelancer.id_portfolio == null 
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO atualizar
                let portfolioFreelancerAtualizado = await portfolioFreelancerDAO.updatePortfolioFreelancer(id, dadosPortfolioFreelancer)

                if (portfolioFreelancerAtualizado) {
                    let updatedPortfolioFreelancer = await portfolioFreelancerDAO.selectByIdPortfolioFreelancer(id) 
                    let updatedId = updatedPortfolioFreelancer[0].id

                    // Constrói o JSON de resposta com o id atualizado
                    updatePortfolioFreelancer.status = message.SUCESS_UPDATE_ITEM.status
                    updatePortfolioFreelancer.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updatePortfolioFreelancer.message = message.SUCESS_UPDATE_ITEM.message
                    updatePortfolioFreelancer.id = updatedId 
                    updatePortfolioFreelancer.portfolio_freelancer = dadosPortfolioFreelancer

                    return updatePortfolioFreelancer // Retorna a resposta JSON atualizada
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

const setExcluirPortfolioFreelancer = async (id) => {

    try {

        let idPortfolioFreelancer = id

        let validaPortfolioFreelancer = await getBuscarPortfolioFreelancer(idPortfolioFreelancer)

        let dadosPortfolioFreelancer = await portfolioFreelancerDAO.deletePortfolioFreelancer(idPortfolioFreelancer)

        if (idPortfolioFreelancer == '' || idPortfolioFreelancer == undefined || isNaN(idPortfolioFreelancer)) {
           
            return message.ERROR_INVALID_ID // 400

        } else if (validaPortfolioFreelancer.status == false) {
            return message.ERROR_NOT_FOUND
            
        } else {
            
            if (dadosPortfolioFreelancer) 
                return message.SUCESS_DELETE_ITEM // 200
             else {
                return message.ERROR_INTERNAL_SERVER_DB
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const getListarPortfolioFreelancer = async () => {
    // Cria o objeto JSON
    let portfolioFreelancerJSON = {}

    // Cria a função DAO para retornar os dados do BD
    let dadosPortfolioFreelancer = await portfolioFreelancerDAO.selectAllPortfolioFreelancers()

    // Validação para criar o JSON de dados
    if (dadosPortfolioFreelancer) {
        if (dadosPortfolioFreelancer.length > 0) {
            portfolioFreelancerJSON.portfolio_freelancer = dadosPortfolioFreelancer
            portfolioFreelancerJSON.quantidade = dadosPortfolioFreelancer.length
            portfolioFreelancerJSON.status_code = 200

            return portfolioFreelancerJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarPortfolioFreelancer = async (id) => {
    let idPortfolioFreelancer = id
    let portfolioFreelancerJSON = {}

    if (idPortfolioFreelancer == '' || idPortfolioFreelancer == undefined || isNaN(idPortfolioFreelancer)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosPortfolioFreelancer = await portfolioFreelancerDAO.selectByIdPortfolioFreelancer(idPortfolioFreelancer)

        if (dadosPortfolioFreelancer) {
            if (dadosPortfolioFreelancer.length > 0) {
                portfolioFreelancerJSON.portfolio_freelancer = dadosPortfolioFreelancer
                portfolioFreelancerJSON.status_code = 200

                return portfolioFreelancerJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}


module.exports = {
    setInserirNovoPortfolioFreelancer,
    setAtualizarPortfolioFreelancer,
    setExcluirPortfolioFreelancer,
    getListarPortfolioFreelancer,
    getBuscarPortfolioFreelancer
}
