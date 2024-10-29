// Import do arquivo DAO para manipular dados das classificações
const categoriaProjetoDAO = require('../model/DAO/categoria_publicacao_projeto.js')

const message = require('../modulo/config.js')
const { getBuscarCategoria } = require('./controller_categoria.js')

const setInserirNovaCategoriaProjeto = async (dadosCategoriaProjeto, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novaCategoriaProjetoJSON = {}

            if (
                dadosCategoriaProjeto.id_projeto == undefined || isNaN(dadosCategoriaProjeto.id_projeto) || dadosCategoriaProjeto.id_projeto == null ||
                dadosCategoriaProjeto.id_categoria == undefined || isNaN(dadosCategoriaProjeto.id_categoria) || dadosCategoriaProjeto.id_categoria == null
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            } else {
                // Encaminha os dados para o DAO inserir
                let novaCategoriaProjeto = await categoriaProjetoDAO.insertCategoriaProjeto(dadosCategoriaProjeto)

                if (novaCategoriaProjeto) {
                    let id = await categoriaProjetoDAO.selectId()
                    novaCategoriaProjetoJSON.status = message.SUCESS_CREATED_ITEM.status
                    novaCategoriaProjetoJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novaCategoriaProjetoJSON.message = message.SUCESS_CREATED_ITEM.message
                    novaCategoriaProjetoJSON.id = parseInt(id)
                    novaCategoriaProjetoJSON.categoria_Projeto = dadosCategoriaProjeto

                    return novaCategoriaProjetoJSON // 201
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER // 500 erro na camada da controller
    }
}

const setAtualizarCategoriaProjeto = async (dadosCategoriaProjeto, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateCategoriaProjeto = {}

            // Valida os campos necessários
            if (
                dadosCategoriaProjeto.id_projeto == undefined || isNaN(dadosCategoriaProjeto.id_projeto) || dadosCategoriaProjeto.id_projeto == null ||
                dadosCategoriaProjeto.id_categoria == undefined || isNaN(dadosCategoriaProjeto.id_categoria) || dadosCategoriaProjeto.id_categoria == null
            ) {
                return message.ERROR_REQUIRED_FIELDS // 400
            }

            // Atualiza a categoria
            let categoriaProjetoAtualizada = await categoriaProjetoDAO.updateCategoriaProjeto(id, dadosCategoriaProjeto)

            if (categoriaProjetoAtualizada) {
                let updatedCategoriaProjeto = await categoriaProjetoDAO.selectByIdCategoriaProjeto(id)

                // Verifica se a atualização realmente retornou dados
                if (updatedCategoriaProjeto && updatedCategoriaProjeto.length > 0) {
                    let updatedId = updatedCategoriaProjeto[0].id

                    // Constrói o JSON de resposta com o id atualizado
                    updateCategoriaProjeto.status = message.SUCESS_UPDATE_ITEM.status
                    updateCategoriaProjeto.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateCategoriaProjeto.message = message.SUCESS_UPDATE_ITEM.message
                    updateCategoriaProjeto.id = updatedId
                    updateCategoriaProjeto.categoria_Projeto = dadosCategoriaProjeto

                    return updateCategoriaProjeto // Retorna a resposta JSON atualizada
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



const setExcluirCategoriaProjeto = async (id) => {
    try {
        let idCategoriaProjeto = id

        // Verifica se o ID é válido antes de buscar
        if (idCategoriaProjeto === '' || idCategoriaProjeto === undefined || isNaN(idCategoriaProjeto)) {
            return message.ERROR_INVALID_ID
        }

        let validaCategoriaProjeto = await getBuscarCategoriaProjeto(idCategoriaProjeto)

        // Verifica se a categoria foi encontrada
        if (validaCategoriaProjeto.status === false) {
            return message.ERROR_NOT_FOUND
        }

        // Tenta deletar a categoria
        let dadosCategoriaProjeto = await categoriaProjetoDAO.deleteCategoriaProjeto(idCategoriaProjeto)

        if (dadosCategoriaProjeto) {
            return message.SUCESS_DELETE_ITEM
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    } catch (error) {
        console.error("Erro ao excluir a categoria:", error) // Log do erro
        return message.ERROR_INTERNAL_SERVER
    }
}


const getListarCategoriasProjetos = async () => {
    // Cria o objeto JSON
    let CategoriaProjetosJSON = {}

    // Cria a função DAO para retornar os dados do BD
    let dadosCategoriaProjeto = await categoriaProjetoDAO.selectAllCategoriaProjetos()

    // Validação para criar o JSON de dados
    if (dadosCategoriaProjeto) {
        if (dadosCategoriaProjeto.length > 0) {
            CategoriaProjetosJSON.categoria_Projeto = dadosCategoriaProjeto
            CategoriaProjetosJSON.quantidade = dadosCategoriaProjeto.length
            CategoriaProjetosJSON.status_code = 200

            return CategoriaProjetosJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarCategoriaProjeto = async (id) => {
    let idCategoriaProjeto = id
    let categoriaProjetosJSON = {}

    if (idCategoriaProjeto == '' || idCategoriaProjeto == undefined || isNaN(idCategoriaProjeto)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosCategoriaProjeto = await categoriaProjetoDAO.selectByIdCategoriaProjeto(idCategoriaProjeto)

        if (dadosCategoriaProjeto) {
            if (dadosCategoriaProjeto.length > 0) {
                categoriaProjetosJSON.categoria_Projeto = dadosCategoriaProjeto
                categoriaProjetosJSON.status_code = 200

                return categoriaProjetosJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}


module.exports = {
    setInserirNovaCategoriaProjeto,
    setAtualizarCategoriaProjeto,
    setExcluirCategoriaProjeto,
    getListarCategoriasProjetos,
    getBuscarCategoriaProjeto
}