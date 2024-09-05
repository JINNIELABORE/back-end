const clientesDAO = require ('../model/DAO/cliente.js')
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
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
                //encaminha os dados para o DAO inserir
                let novoCliente = await clientesDAO.insertCliente(dadosCliente)

                if (novoCliente) {

                    let id = await clientesDAO.selectId()

                    //Cria o JSON de retorno com informações de requisição e os dados novos
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

module.exports = {
    setInserirCliente
}