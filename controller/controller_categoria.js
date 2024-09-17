const categoriasDAO = require('../model/DAO/categoria.js')

const message = require('../modulo/config.js')

const setInserirNovaCategoria = async (dadosCategoria, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novaCategoriaJSON = {}

            if (
                dadosCategoria.nome_categoria == '' || dadosCategoria.nome_categoria == undefined || dadosCategoria.nome_categoria == null || dadosCategoria.nome_categoria.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
                let novaCategoria = await categoriasDAO.insertCategoria(dadosCategoria)

                if (novaCategoria) {

                    let id = await categoriasDAO.selectId()

                    novaCategoriaJSON.status = message.SUCESS_CREATED_ITEM.status
                    novaCategoriaJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novaCategoriaJSON.message = message.SUCESS_CREATED_ITEM.message
                    novaCategoriaJSON.id = parseInt(id)
                    novaCategoriaJSON.categoria = dadosCategoria

                    return novaCategoriaJSON //201

                } else {
                    console.log("Erro interno do servidor ao inserir Categoria no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB //500
                }
            }

        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }
}

const setAtualizarCategoria = async (dadosCategoria, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateCategoriaJSON = {}

            if (
                dadosCategoria.nome_categoria == '' || dadosCategoria.nome_categoria == undefined || dadosCategoria.nome_categoria == null || dadosCategoria.nome_categoria.length > 45
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
               
                let categoriaAtualizada = await categoriasDAO.updateCategoria(id, dadosCategoria)

                if (categoriaAtualizada) {
                    let updatedCategoria = await categoriasDAO.selectByIdCategoria(id) 
                    let updatedId = updatedCategoria[0].id 

                    updateCategoriaJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateCategoriaJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateCategoriaJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateCategoriaJSON.id = updatedId // Usa o id atualizado aqui
                    updateCategoriaJSON.categoria = dadosCategoria

                    return updateCategoriaJSON

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }

        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }
}

const setExcluirCategoria = async (id) => {

    try {

        let idCategoria = id

        let validaCategoria = await getBuscarCategoria(idCategoria)

        let dadosCategoria = await categoriasDAO.deleteCategoria(idCategoria)

        if (idCategoria == '' || idCategoria == undefined || isNaN(idCategoria)) {

            return message.ERROR_INVALID_ID //400

        } else if (validaCategoria.status == false) {
            return message.ERROR_NOT_FOUND

        } else {

            if (dadosCategoria)
                return message.SUCESS_DELETE_ITEM // 200
            else
                return message.ERROR_INTERNAL_SERVER_DB

        }


    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}

const getListarCategorias = async () => {

    //Cria o objeto JSON
    let categoriasJSON = {}

    let dadosCategorias = await categoriasDAO.selectAllCategorias()

    if (dadosCategorias) {
        if (dadosCategorias.length > 0) {
            categoriasJSON.categorias = dadosCategorias
            categoriasJSON.quantidade = dadosCategorias.length
            categoriasJSON.status_code = 200

            return categoriasJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarCategoria = async (id) => {

    let idCategoria = id

    let categoriaJSON = {}

    if (idCategoria == '' || idCategoria == undefined || isNaN(idCategoria)) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosCategoria = await categoriasDAO.selectByIdCategoria(idCategoria)

        if (dadosCategoria) {

            if (dadosCategoria.length > 0) {
                categoriaJSON.categoria = dadosCategoria
                categoriaJSON.status_code = 200

                return categoriaJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovaCategoria,
    setAtualizarCategoria,
    setExcluirCategoria,
    getListarCategorias,
    getBuscarCategoria
}