const clientesDAO = require('../model/DAO/cliente.js')
const message = require('../modulo/config.js')

const setInserirCliente = async (dadosCliente, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novoClienteJSON = {}

            if (
                dadosCliente.nome_cliente == '' || dadosCliente.nome_cliente == undefined || dadosCliente.nome_cliente == null || dadosCliente.nome_cliente.length > 50 ||
                dadosCliente.cnpj_cliente == '' || dadosCliente.cnpj_cliente == undefined || dadosCliente.cnpj_cliente == null || dadosCliente.cnpj_cliente.length > 14 ||
                dadosCliente.email_cliente == '' || dadosCliente.email_cliente == undefined || dadosCliente.email_cliente == null || dadosCliente.email_cliente.length > 255 ||
                dadosCliente.senha_cliente == '' || dadosCliente.senha_cliente == undefined || dadosCliente.senha_cliente == null || dadosCliente.senha_cliente.length > 80
            ) {
                return message.ERROR_REQUIRED_FIELDS //400
            } else {
                // Verifica se o CNPJ já existe
                let cnpjExists = await clientesDAO.selectByCnpj(dadosCliente.cnpj_cliente)
                if (cnpjExists) {
                    return message.ERROR_CNPJ_ALREADY_EXISTS // Retorna erro se o CNPJ já estiver cadastrado
                }

                // Verifica se o e-mail já existe
                let emailExists = await clientesDAO.selectByEmail(dadosCliente.email_cliente)
                if (emailExists) {
                    return message.ERROR_EMAIL_ALREADY_EXISTS // Retorna erro se o e-mail já estiver cadastrado
                }

                // Encaminha os dados para o DAO inserir
                let novoCliente = await clientesDAO.insertCliente(dadosCliente)
                if (novoCliente) {
                    let id = await clientesDAO.selectId()

                    // Cria o JSON de retorno com informações de requisição e os dados novos
                    novoClienteJSON.status = message.SUCESS_CREATED_ITEM.status
                    novoClienteJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novoClienteJSON.message = message.SUCESS_CREATED_ITEM.message
                    novoClienteJSON.id = parseInt(id)
                    novoClienteJSON.cliente = dadosCliente

                    return novoClienteJSON //201
                } else {
                    console.log("Erro interno do servidor ao inserir clientes no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB //500
                }
            }
        }
    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }
}


const getListarClientes = async () => {
    let clientesJSON = {}
    let dadosClientes = await clientesDAO.selectAllClientes()

    if (dadosClientes) {
        if (dadosClientes.length > 0) {
            // Converter BigInt para string
            dadosClientes = dadosClientes.map(cliente => {
                return {
                    ...cliente,
                    cnpj_cliente: cliente.cnpj_cliente.toString()
                }
            })

            clientesJSON.clientes = dadosClientes
            clientesJSON.quantidade = dadosClientes.length
            clientesJSON.status_code = 200

            return clientesJSON
        } else {
            return { message: 'Nenhum registro encontrado', status_code: 404 }
        }
    } else {
        return { message: 'Erro interno do servidor', status_code: 500 }
    }
}

const getBuscarCliente = async (id) => {
    let idCliente = id
    let clienteJSON = {}

    if (idCliente === '' || idCliente === undefined || isNaN(idCliente)) {
        return { status_code: 400, message: 'ID inválido' }
    } else {
        try {
            let dadosCliente = await clientesDAO.selectByIdCliente(idCliente)

            if (dadosCliente) {
                if (dadosCliente.length > 0) {
                    // Converte BigInt para string
                    dadosCliente = dadosCliente.map(cliente => {
                        if (cliente.cnpj_cliente) {
                            cliente.cnpj_cliente = cliente.cnpj_cliente.toString()
                        }
                        return cliente
                    })

                    clienteJSON.cliente = dadosCliente
                    clienteJSON.status_code = 200
                    return clienteJSON
                } else {
                    return { status_code: 404, message: 'Cliente não encontrado' }
                }
            } else {
                return { status_code: 500, message: 'Erro interno do servidor' }
            }
        } catch (error) {
            return { status_code: 500, message: 'Erro interno do servidor' }
        }
    }
}

const setAtualizarCliente = async (dadosCliente, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateClienteJSON = {}

            if (
                dadosCliente.nome_cliente == '' || dadosCliente.nome_cliente == undefined || dadosCliente.nome_cliente == null || dadosCliente.nome_cliente.length > 50 ||
                dadosCliente.cnpj_cliente == '' || dadosCliente.cnpj_cliente == undefined || dadosCliente.cnpj_cliente == null || dadosCliente.cnpj_cliente.length > 14 ||
                dadosCliente.email_cliente == '' || dadosCliente.email_cliente == undefined || dadosCliente.email_cliente == null || dadosCliente.email_cliente.length > 255 ||
                dadosCliente.senha_cliente == '' || dadosCliente.senha_cliente == undefined || dadosCliente.senha_cliente == null || dadosCliente.senha_cliente.length > 80
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
                let clienteAtualizado = await clientesDAO.updateCliente(id, dadosCliente)

                if (clienteAtualizado) {
                    let updatedCliente = await clientesDAO.selectByIdCliente(id)
                    let updatedId = updatedCliente[0].id

                    updateClienteJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateClienteJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateClienteJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateClienteJSON.id = updatedId
                    updateClienteJSON.cliente = dadosCliente

                    return updateClienteJSON

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }

        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }
}

const setExcluirCliente = async (id) => {

    try {

        let idCliente = id

        let validaCliente = await getBuscarCliente(idCliente)

        let dadosCliente = await clientesDAO.deleteCliente(idCliente)

        if (idCliente == '' || idCliente == undefined || isNaN(idCliente)) {

            return message.ERROR_INVALID_ID //400

        } else if (validaCliente.status == false) {
            return message.ERROR_NOT_FOUND

        } else {

            if (dadosCliente)
                return message.SUCESS_DELETE_ITEM // 200
            else
                return message.ERROR_INTERNAL_SERVER_DB

        }


    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}



module.exports = {
    setInserirCliente,
    getListarClientes,
    getBuscarCliente,
    setAtualizarCliente,
    setExcluirCliente
}