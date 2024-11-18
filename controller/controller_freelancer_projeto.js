// Import do arquivo DAO para manipular dados dos freelancers em projetos
const freelancerProjetoDAO = require('../model/DAO/freelancer_projeto.js')

const message = require('../modulo/config.js')

// Função para inserir um novo freelancer em um projeto
const setInserirNovoFreelancerProjeto = async (dadosFreelancerProjeto, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novoFreelancerProjetoJSON = {}

            if (
                dadosFreelancerProjeto.id_projeto == undefined || isNaN(dadosFreelancerProjeto.id_projeto) || dadosFreelancerProjeto.id_projeto == null ||
                dadosFreelancerProjeto.id_freelancer == undefined || isNaN(dadosFreelancerProjeto.id_freelancer) || dadosFreelancerProjeto.id_freelancer == null ||
                dadosFreelancerProjeto.status == undefined || dadosFreelancerProjeto.status == null
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO inserir
                let novoFreelancerProjeto = await freelancerProjetoDAO.insertFreelancerProjeto(dadosFreelancerProjeto)

                if (novoFreelancerProjeto) {
                    let id = await freelancerProjetoDAO.selectId()
                    novoFreelancerProjetoJSON.status = message.SUCESS_CREATED_ITEM.status
                    novoFreelancerProjetoJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novoFreelancerProjetoJSON.message = message.SUCESS_CREATED_ITEM.message
                    novoFreelancerProjetoJSON.id = parseInt(id)
                    novoFreelancerProjetoJSON.freelancer_Projeto = dadosFreelancerProjeto

                    return novoFreelancerProjetoJSON // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

// Função para atualizar os dados de um freelancer em um projeto
const setAtualizarFreelancerProjeto = async (dadosFreelancerProjeto, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateFreelancerProjeto = {}

            // Valida os campos necessários
            if (
                dadosFreelancerProjeto.id_projeto == undefined || isNaN(dadosFreelancerProjeto.id_projeto) || dadosFreelancerProjeto.id_projeto == null ||
                dadosFreelancerProjeto.id_freelancer == undefined || isNaN(dadosFreelancerProjeto.id_freelancer) || dadosFreelancerProjeto.id_freelancer == null ||
                dadosFreelancerProjeto.status == undefined || dadosFreelancerProjeto.status == null
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            }

            // Atualiza o freelancer no projeto
            let freelancerProjetoAtualizado = await freelancerProjetoDAO.updateFreelancerProjeto(id, dadosFreelancerProjeto)

            if (freelancerProjetoAtualizado) {
                let updatedFreelancerProjeto = await freelancerProjetoDAO.selectByIdFreelancerProjeto(id)

                // Verifica se a atualização realmente retornou dados
                if (updatedFreelancerProjeto && updatedFreelancerProjeto.length > 0) {
                    let updatedId = updatedFreelancerProjeto[0].id

                    // Constrói o JSON de resposta com o id atualizado
                    updateFreelancerProjeto.status = message.SUCESS_UPDATE_ITEM.status
                    updateFreelancerProjeto.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateFreelancerProjeto.message = message.SUCESS_UPDATE_ITEM.message
                    updateFreelancerProjeto.id = updatedId
                    updateFreelancerProjeto.freelancer_Projeto = dadosFreelancerProjeto

                    return updateFreelancerProjeto // Retorna a resposta JSON atualizada
                } else {
                    console.error("Freelancer não encontrado após atualização, ID:", id)
                    return message.ERROR_NOT_FOUND // 404 caso não encontre o item
                }
            } else {
                console.error("Falha na atualização do freelancer, ID:", id)
                return message.ERROR_INTERNAL_SERVER_DB // 500
            }
        }
    } catch (error) {
        console.error("Erro ao atualizar o freelancer:", error) // Log do erro
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

// Função para excluir um freelancer de um projeto
const setExcluirFreelancerProjeto = async (id) => {
    try {
        let idFreelancerProjeto = id

        // Verifica se o ID é válido antes de buscar
        if (idFreelancerProjeto === '' || idFreelancerProjeto === undefined || isNaN(idFreelancerProjeto)) {
            return message.ERROR_INVALID_ID
        }

        let validaFreelancerProjeto = await getBuscarFreelancerProjeto(idFreelancerProjeto)

        // Verifica se o freelancer foi encontrado
        if (validaFreelancerProjeto.status === false) {
            return message.ERROR_NOT_FOUND
        }

        // Tenta deletar o freelancer do projeto
        let dadosFreelancerProjeto = await freelancerProjetoDAO.deleteFreelancerProjeto(idFreelancerProjeto)

        if (dadosFreelancerProjeto) {
            return message.SUCESS_DELETE_ITEM
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    } catch (error) {
        console.error("Erro ao excluir o freelancer:", error) // Log do erro
        return message.ERROR_INTERNAL_SERVER
    }
}

// Função para listar todos os freelancers associados a projetos
const getListarFreelancersProjetos = async () => {
    // Cria o objeto JSON
    let freelancerProjetosJSON = {}

    // Cria a função DAO para retornar os dados do BD
    let dadosFreelancerProjeto = await freelancerProjetoDAO.selectAllFreelancerProjetos()

    // Validação para criar o JSON de dados
    if (dadosFreelancerProjeto) {
        if (dadosFreelancerProjeto.length > 0) {
            freelancerProjetosJSON.freelancer_Projeto = dadosFreelancerProjeto
            freelancerProjetosJSON.quantidade = dadosFreelancerProjeto.length
            freelancerProjetosJSON.status_code = 200

            return freelancerProjetosJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

// Função para buscar um freelancer em um projeto específico pelo ID
const getBuscarFreelancerProjeto = async (id) => {
    let idFreelancerProjeto = id
    let freelancerProjetosJSON = {}

    if (idFreelancerProjeto == '' || idFreelancerProjeto == undefined || isNaN(idFreelancerProjeto)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosFreelancerProjeto = await freelancerProjetoDAO.selectByIdFreelancerProjeto(idFreelancerProjeto)

        if (dadosFreelancerProjeto) {
            if (dadosFreelancerProjeto.length > 0) {
                freelancerProjetosJSON.freelancer_Projeto = dadosFreelancerProjeto
                freelancerProjetosJSON.status_code = 200

                return freelancerProjetosJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovoFreelancerProjeto,
    setAtualizarFreelancerProjeto,
    setExcluirFreelancerProjeto,
    getListarFreelancersProjetos,
    getBuscarFreelancerProjeto
}
