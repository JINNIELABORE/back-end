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
            const clientesMap = {}

            dadosClientes.forEach(cliente => {
                const { 
                    id, nome_cliente, data_nascimento, cnpj_cliente, 
                    email_cliente, senha_cliente, is_premium, foto_perfil, 
                    id_avaliacao, estrelas, comentario, nome_avaliador, descricao_cliente,
                    id_projeto, nome_projeto, descricao_projeto, orcamento, nome_experiencia,
                    id_cliente_projeto, id_freelancer, nome_freelancer 
                } = cliente

                if (!clientesMap[id]) {
                    clientesMap[id] = {
                        id,
                        nome_cliente,
                        data_nascimento,
                        cnpj_cliente: cnpj_cliente.toString(),
                        email_cliente,
                        senha_cliente,
                        foto_perfil,
                        descricao_cliente: descricao_cliente, 
                        is_premium, 
                        avaliacao: [],
                        projetos: [],
                        freelancers: {} // Mapa para armazenar freelancers e a quantidade de projetos
                    }
                }

                // Adiciona avaliação do cliente
                if (id_avaliacao) {
                    clientesMap[id].avaliacao.push({
                        id: id_avaliacao,
                        estrelas,
                        comentario,
                        id_avaliador: cliente.id_avaliador,
                        nome_avaliador,
                        tipo_avaliador: cliente.tipo_avaliador
                    })
                }

                // Adiciona projeto do cliente
                if (id_projeto) {
                    // Verifica se já existe o projeto para o cliente
                    clientesMap[id].projetos.push({
                        id_projeto,
                        nome_projeto,
                        descricao_projeto,
                        orcamento,
                        nome_experiencia 
                    })

                    // Agora, vamos contar os freelancers que trabalharam nesse projeto
                    if (id_freelancer && nome_freelancer) {
                        // Se o freelancer já foi adicionado ao cliente, aumenta o contador de projetos
                        if (!clientesMap[id].freelancers[id_freelancer]) {
                            clientesMap[id].freelancers[id_freelancer] = {
                                nome_freelancer,
                                quantidade_projetos: 0
                            }
                        }

                        // Aumenta o contador de projetos do freelancer
                        clientesMap[id].freelancers[id_freelancer].quantidade_projetos += 1
                    }
                }
            })

            // Agora, calculamos o total de freelancers para cada cliente
            Object.values(clientesMap).forEach(cliente => {
                cliente.quantidade_freelancers = Object.keys(cliente.freelancers).length
            })

            clientesJSON.clientes = Object.values(clientesMap)
            clientesJSON.quantidade = clientesJSON.clientes.length
            clientesJSON.status_code = 200

            return clientesJSON
        } else {
            return { message: 'Nenhum cliente encontrado', status_code: 404 }
        }
    } else {
        return { message: 'Erro interno do servidor', status_code: 500 }
    }
}

const getBuscarCliente = async (id) => {
    let idCliente = id
    let clienteJSON = {}

    // Validação do ID
    if (idCliente === '' || idCliente === undefined || isNaN(idCliente)) {
        return { status_code: 400, message: 'ID inválido' }
    } else {
        try {
            let dadosCliente = await clientesDAO.selectByIdCliente(idCliente)

            if (dadosCliente) {
                if (dadosCliente.length > 0) {
                    // Converte BigInt para string para garantir compatibilidade com JSON
                    dadosCliente = dadosCliente.map(cliente => {
                        if (cliente.cnpj_cliente) {
                            cliente.cnpj_cliente = cliente.cnpj_cliente.toString()
                        }
                        return cliente
                    })

                    // Organizar os dados do cliente
                    const clienteMap = {}

                    dadosCliente.forEach(cliente => {
                        const { 
                            id, nome_cliente, data_nascimento, cnpj_cliente, 
                            email_cliente, senha_cliente, is_premium, foto_perfil, 
                            id_avaliacao, estrelas, comentario, nome_avaliador, descricao_cliente,
                            id_projeto, nome_projeto, descricao_projeto, orcamento, nome_experiencia,
                            id_cliente_projeto, id_freelancer, nome_freelancer 
                        } = cliente

                        if (!clienteMap[id]) {
                            clienteMap[id] = {
                                id,
                                nome_cliente,
                                data_nascimento,
                                cnpj_cliente: cnpj_cliente.toString(),
                                email_cliente,
                                senha_cliente,
                                foto_perfil,
                                descricao_cliente: descricao_cliente, 
                                is_premium, 
                                avaliacao: [],
                                projetos: [],
                                freelancers: {} // Mapa para armazenar freelancers e a quantidade de projetos
                            }
                        }

                        // Adiciona avaliação do cliente
                        if (id_avaliacao) {
                            clienteMap[id].avaliacao.push({
                                id: id_avaliacao,
                                estrelas,
                                comentario,
                                id_avaliador: cliente.id_avaliador,
                                nome_avaliador,
                                tipo_avaliador: cliente.tipo_avaliador
                            })
                        }

                        // Adiciona projeto do cliente
                        if (id_projeto) {
                            // Verifica se já existe o projeto para o cliente
                            clienteMap[id].projetos.push({
                                id_projeto,
                                nome_projeto,
                                descricao_projeto,
                                orcamento,
                                nome_experiencia 
                            })

                            // Contabiliza freelancers que trabalharam neste projeto
                            if (id_freelancer && nome_freelancer) {
                                // Se o freelancer já foi adicionado ao cliente, aumenta o contador de projetos
                                if (!clienteMap[id].freelancers[id_freelancer]) {
                                    clienteMap[id].freelancers[id_freelancer] = {
                                        nome_freelancer,
                                        quantidade_projetos: 0
                                    }
                                }

                                // Aumenta o contador de projetos do freelancer
                                clienteMap[id].freelancers[id_freelancer].quantidade_projetos += 1
                            }
                        }
                    })

                    // Calcula a quantidade de freelancers para o cliente
                    Object.values(clienteMap).forEach(cliente => {
                        cliente.quantidade_freelancers = Object.keys(cliente.freelancers).length
                    })

                    clienteJSON.cliente = Object.values(clienteMap)
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

const getClienteByEmail = async (emailPesquisado) =>{

    let dadosCliente = await clientesDAO.getClienteByEmail(emailPesquisado)

    if (dadosCliente) {
        if (dadosCliente.length > 0) {
            return dadosCliente
        } else {
            return { message: 'Nenhum registro encontrado', status_code: 404 }
        }
    } else {
        return { message: 'Erro interno do servidor', status_code: 500 }
    }

}

module.exports = {
    setInserirCliente,
    getListarClientes,
    getBuscarCliente,
    setAtualizarCliente,
    setExcluirCliente,
    getClienteByEmail
}