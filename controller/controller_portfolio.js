const portfolioDAO = require('../model/DAO/portfolio.js')

const message = require('../modulo/config.js')

const setInserirNovoPortfolio = async (dadosPortfolio, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novoPortfolioJSON = {}

            if (
                dadosPortfolio.arquivo == '' || dadosPortfolio.arquivo == undefined || dadosPortfolio.arquivo == null
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
                let novoPortfolio = await portfolioDAO.insertPortfolio(dadosPortfolio)

                if (novoPortfolio) {

                    let id = await portfolioDAO.selectId()

                    novoPortfolioJSON.status = message.SUCESS_CREATED_ITEM.status
                    novoPortfolioJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novoPortfolioJSON.message = message.SUCESS_CREATED_ITEM.message
                    novoPortfolioJSON.id = parseInt(id)
                    novoPortfolioJSON.portfolio = dadosPortfolio

                    return novoPortfolioJSON //201

                } else {
                    console.log("Erro interno do servidor ao inserir Portfolio no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB //500
                }
            }

        }

    } catch (error) {
        console.log(error);
        return message.ERROR_INTERNAL_SERVER
    }
}

const setAtualizarPortfolio = async (dadosPortfolio, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateportfolioJSON = {}

            if (
                dadosPortfolio.arquivo == '' || dadosPortfolio.arquivo == undefined || dadosPortfolio.arquivo == null
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
               
                let portfolioAtualizado = await portfolioDAO.updatePortfolio(id, dadosPortfolio)

                if (portfolioAtualizado) {
                    let updatedPortfolio = await portfolioDAO.selectByIdPortfolio(id) 
                    let updatedId = updatedPortfolio[0].id 

                    updateportfolioJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateportfolioJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateportfolioJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateportfolioJSON.id = updatedId // Usa o id atualizado aqui
                    updateportfolioJSON.portfolio = dadosPortfolio

                    return updateportfolioJSON

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }

        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }
}

const setExcluirPortfolio = async (id) => {

    try {

        let idPortfolio = id

        let validaPortfolio = await getBuscarPortfolio(idPortfolio)

        let dadosPortfolio = await portfolioDAO.deletePortfolio(idPortfolio)

        if (idPortfolio == '' || idPortfolio == undefined || isNaN(idPortfolio)) {

            return message.ERROR_INVALID_ID //400

        } else if (validaPortfolio.status == false) {
            return message.ERROR_NOT_FOUND

        } else {

            if (dadosPortfolio)
                return message.SUCESS_DELETE_ITEM // 200
            else
                return message.ERROR_INTERNAL_SERVER_DB

        }


    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}

const getListarPortfolios = async () => {

    //Cria o objeto JSON
    let portfoliosJSON = {}

    let dadosPortfolios = await portfolioDAO.selectAllPortfolios()

    if (dadosPortfolios) {
        if (dadosPortfolios.length > 0) {
            portfoliosJSON.portfolios = dadosPortfolios
            portfoliosJSON.quantidade = dadosPortfolios.length
            portfoliosJSON.status_code = 200

            return portfoliosJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
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