const portfolioDAO = require('../model/DAO/portfolio.js')
const portfolioFreelancerDAO = require('../model/DAO/portfolio_freelancer.js') // Importar o DAO de associar freelancer
const message = require('../modulo/config.js')

const setInserirNovoPortfolio = async (dadosPortfolio, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novoPortfolioJSON = {}

            // Verificando campos obrigatórios
            if (
                dadosPortfolio.arquivo == '' || dadosPortfolio.arquivo == undefined || dadosPortfolio.arquivo == null ||
                dadosPortfolio.id_freelancer == undefined || isNaN(dadosPortfolio.id_freelancer) || dadosPortfolio.id_freelancer == null
            ) {
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                // Inserir o novo portfolio
                let novoPortfolio = await portfolioDAO.insertPortfolio(dadosPortfolio)

                if (novoPortfolio) {
                    let id = await portfolioDAO.selectId()

                    // Agora associamos o portfolio ao freelancer na tabela intermediária
                    let associarPortfolioFreelancer = await portfolioFreelancerDAO.insertPortfolioFreelancer({
                        id_portfolio: id,
                        id_freelancer: dadosPortfolio.id_freelancer
                    })

                    if (associarPortfolioFreelancer) {
                        novoPortfolioJSON.status = message.SUCESS_CREATED_ITEM.status
                        novoPortfolioJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                        novoPortfolioJSON.message = message.SUCESS_CREATED_ITEM.message
                        novoPortfolioJSON.id = parseInt(id)
                        novoPortfolioJSON.portfolio = dadosPortfolio

                        return novoPortfolioJSON //201
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB // 500 - Falha ao associar portfolio com freelancer
                    }

                } else {
                    console.log("Erro interno do servidor ao inserir Portfolio no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB //500
                }
            }

        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const setAtualizarPortfolio = async (dadosPortfolio, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updatePortfolioJSON = {}

            // Verificando se os campos obrigatórios foram preenchidos
            if (
                dadosPortfolio.arquivo == '' || dadosPortfolio.arquivo == undefined || dadosPortfolio.arquivo == null
            ) {
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                // Atualizar o portfolio
                let portfolioAtualizado = await portfolioDAO.updatePortfolio(id, dadosPortfolio)

                if (portfolioAtualizado) {
                    // Verificar se há necessidade de atualizar a tabela intermediária portfolio_freelancer
                    if (dadosPortfolio.id_freelancer) {
                        // Caso o id_freelancer tenha sido passado, atualiza o relacionamento
                        let portfolioFreelancerAtualizado = await portfolioFreelancerDAO.updatePortfolioFreelancer(id, dadosPortfolio.id_freelancer)
                        
                        if (!portfolioFreelancerAtualizado) {
                            return message.ERROR_INTERNAL_SERVER_DB // 500 - erro ao atualizar relacionamento
                        }
                    }

                    // Selecionar o portfolio atualizado
                    let updatedPortfolio = await portfolioDAO.selectByIdPortfolio(id) 
                    let updatedId = updatedPortfolio[0].id

                    updatePortfolioJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updatePortfolioJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updatePortfolioJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updatePortfolioJSON.id = updatedId // Usa o id atualizado aqui
                    updatePortfolioJSON.portfolio = dadosPortfolio

                    return updatePortfolioJSON // 200
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB //500
                }
            }

        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

const setExcluirPortfolio = async (id) => {
    try {
        // Verificação básica de ID válido
        if (isNaN(id) || id <= 0) {
            return {
                status: message.ERROR_INVALID_ID.status,
                status_code: message.ERROR_INVALID_ID.status_code,
                message: message.ERROR_INVALID_ID.message
            }
        }

        // Verificar se o portfolio existe
        let validaPortfolio = await portfolioDAO.selectByIdPortfolio(id)
        if (!validaPortfolio) {
            return {
                status: message.ERROR_NOT_FOUND.status,
                status_code: message.ERROR_NOT_FOUND.status_code,
                message: message.ERROR_NOT_FOUND.message
            }
        }

        // Excluir registros da tabela intermediária portfolio_freelancer
        let resultadoIntermediaria = await portfolioFreelancerDAO.deletePortfolioFreelancer(id)

        if (!resultadoIntermediaria) {
            return {
                status: message.ERROR_INTERNAL_SERVER_DB.status,
                status_code: message.ERROR_INTERNAL_SERVER_DB.status_code,
                message: "Erro ao excluir os registros da tabela intermediária"
            }
        }

        // Agora, excluir o portfolio
        let resultadoPortfolio = await portfolioDAO.deletePortfolio(id)

        if (resultadoPortfolio) {
            return {
                status: message.SUCESS_DELETE_ITEM.status,
                status_code: message.SUCESS_DELETE_ITEM.status_code,
                message: message.SUCESS_DELETE_ITEM.message
            }
        } else {
            return {
                status: message.ERROR_INTERNAL_SERVER_DB.status,
                status_code: message.ERROR_INTERNAL_SERVER_DB.status_code,
                message: "Erro ao excluir o portfolio"
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

const getListarPortfolios = async () => {
    // Cria o objeto JSON de resposta
    let portfoliosJSON = {}

    // Busca todos os portfolios, agora com o id do freelancer
    let dadosPortfolios = await portfolioDAO.selectAllPortfolios()

    if (dadosPortfolios) {
        if (dadosPortfolios.length > 0) {
            // Adiciona os portfolios e a quantidade de portfolios ao JSON
            portfoliosJSON.portfolios = dadosPortfolios.map(portfolio => {
                return {
                    id: portfolio.id,
                    arquivo: portfolio.arquivo,
                    id_freelancer: portfolio.id_freelancer || null  // Caso não tenha freelancer, retorna null
                }
            })
            portfoliosJSON.quantidade = dadosPortfolios.length
            portfoliosJSON.status_code = 200

            return portfoliosJSON
        } else {
            // Se não encontrar portfolios, retorna a mensagem de erro
            return message.ERROR_NOT_FOUND
        }
    } else {
        // Caso ocorra um erro ao consultar o banco de dados
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarPortfolio = async (id) => {

    let idPortfolio = id

    let portfolioJSON = {}

    if (idPortfolio == '' || idPortfolio == undefined || isNaN(idPortfolio)) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosPortfolio = await portfolioDAO.selectByIdPortfolio(idPortfolio)

        if (dadosPortfolio) {

            if (dadosPortfolio.length > 0) {
                portfolioJSON.portfolio = dadosPortfolio
                portfolioJSON.status_code = 200

                return portfolioJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovoPortfolio,
    setAtualizarPortfolio,
    setExcluirPortfolio,
    getListarPortfolios,
    getBuscarPortfolio
}