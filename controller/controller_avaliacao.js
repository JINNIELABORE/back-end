const avaliacaoDAO = require('../model/DAO/avaliacao.js')
const avaliacaoUsuarioDAO = require('../model/DAO/avaliacao_usuario.js')  // Adicionando o DAO para avaliação_usuario
const message = require('../modulo/config.js')

const setInserirNovaAvaliacao = async (dadosAvaliacao, contentType) => {
    try {
        if (String(contentType).toLowerCase() === 'application/json') {
            let novaAvaliacaoJSON = {}

            // Verifica se os campos obrigatórios estão preenchidos
            if (
                dadosAvaliacao.estrelas === '' || dadosAvaliacao.estrelas == undefined || dadosAvaliacao.estrelas == null || 
                dadosAvaliacao.comentario === '' || dadosAvaliacao.comentario == undefined || dadosAvaliacao.comentario == null || 
                dadosAvaliacao.id_avaliador === '' || dadosAvaliacao.id_avaliador == undefined || dadosAvaliacao.id_avaliador == null || 
                dadosAvaliacao.id_avaliado === '' || dadosAvaliacao.id_avaliado == undefined || dadosAvaliacao.id_avaliado == null
            ) {
                return message.ERROR_REQUIRED_FIELDS  // 400
            } else {
                // Insere a avaliação
                let novaAvaliacao = await avaliacaoDAO.insertAvaliacao(dadosAvaliacao)
                if (novaAvaliacao) {
                    let idAvaliacao = await avaliacaoDAO.selectId()  // Obtém o id da avaliação recém inserida

                    // Agora insere na tabela intermediária 'avaliacao_usuario'
                    let dadosAvaliacaoUsuario = {
                        id_avaliacao: idAvaliacao,
                        id_avaliador: dadosAvaliacao.id_avaliador,
                        tipo_avaliador: dadosAvaliacao.tipo_avaliador,
                        id_avaliado: dadosAvaliacao.id_avaliado,
                        tipo_avaliado: dadosAvaliacao.tipo_avaliado
                    }

                    let resultadoAvaliacaoUsuario = await avaliacaoUsuarioDAO.insertAvaliacaoUsuario(dadosAvaliacaoUsuario)
                    if (resultadoAvaliacaoUsuario) {
                        // Se a inserção na tabela 'avaliacao_usuario' for bem-sucedida
                        novaAvaliacaoJSON.status = true
                        novaAvaliacaoJSON.status_code = 201
                        novaAvaliacaoJSON.message = "O item foi criado com sucesso no banco de dados!"
                        novaAvaliacaoJSON.id = parseInt(idAvaliacao)
                        
                        // Corrigido para retornar 'avaliacao' como um array
                        novaAvaliacaoJSON.avaliacao = [{
                            estrelas: dadosAvaliacao.estrelas,
                            comentario: dadosAvaliacao.comentario,
                            id_avaliador: dadosAvaliacao.id_avaliador,
                            tipo_avaliador: dadosAvaliacao.tipo_avaliador,
                            id_avaliado: dadosAvaliacao.id_avaliado,
                            tipo_avaliado: dadosAvaliacao.tipo_avaliado
                        }]
                        
                        return novaAvaliacaoJSON // 201
                    } else {
                        console.log("Erro ao inserir na tabela 'avaliacao_usuario'.")
                        return message.ERROR_INTERNAL_SERVER_DB  // 500
                    }
                } else {
                    console.log("Erro ao inserir avaliação no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB  // 500
                }
            }
        }
    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER  // 500
    }
}



const setAtualizarAvaliacao = async (dadosAvaliacao, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateAvaliacaoJSON = {}

            if (
                dadosAvaliacao.estrelas == '' || dadosAvaliacao.estrelas == undefined || dadosAvaliacao.estrelas == null || 
                dadosAvaliacao.comentario == '' || dadosAvaliacao.comentario == undefined || dadosAvaliacao.comentario == null
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
               
                let avaliacao = await avaliacaoDAO.updateAvaliacao(id, dadosAvaliacao)

                if (avaliacao) {
                    let updatedAvaliacao = await avaliacaoDAO.selectByIdAvaliacao(id) 
                    let updatedId = updatedAvaliacao[0].id 

                    updateAvaliacaoJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateAvaliacaoJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateAvaliacaoJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateAvaliacaoJSON.id = updatedId // Usa o id atualizado aqui
                    updateAvaliacaoJSON.avaliacao = dadosAvaliacao

                    return updateAvaliacaoJSON

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }

        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }
}

const setExcluirAvaliacao = async (id) => {

    try {

        let idAvaliacao = id

        let validaAvaliacao = await getBuscarAvaliacao(idAvaliacao)

        let dadosAvaliacao = await avaliacaoDAO.deleteAvaliacao(idAvaliacao)

        if (idAvaliacao == '' || idAvaliacao == undefined || isNaN(idAvaliacao)) {

            return message.ERROR_INVALID_ID //400

        } else if (validaAvaliacao.status == false) {
            return message.ERROR_NOT_FOUND

        } else {

            if (dadosAvaliacao)
                return message.SUCESS_DELETE_ITEM // 200
            else
                return message.ERROR_INTERNAL_SERVER_DB

        }


    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}

const getListarAvaliacoes = async () => {
    let avaliacoesJSON = {}
    
    // Altera a consulta para incluir os dados de avaliacao_usuario
    let dadosAvaliacoes = await avaliacaoDAO.selectAllAvaliacoesComUsuarios()

    if (dadosAvaliacoes) {
        if (dadosAvaliacoes.length > 0) {
            avaliacoesJSON.avaliacoes = dadosAvaliacoes.map(avaliacao => ({
                id: avaliacao.id,  // Inclui o id da avaliação
                estrelas: avaliacao.estrelas,
                comentario: avaliacao.comentario,
                id_avaliador: avaliacao.id_avaliador,
                tipo_avaliador: avaliacao.tipo_avaliador,
                id_avaliado: avaliacao.id_avaliado,
                tipo_avaliado: avaliacao.tipo_avaliado
            }))
            avaliacoesJSON.quantidade = dadosAvaliacoes.length
            avaliacoesJSON.status_code = 200

            return avaliacoesJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    } else {
        return message.ERROR_INTERNAL_SERVER_DB
    }
}

const getBuscarAvaliacao = async (id) => {
    let idAvaliacao = id

    let avaliacaoJSON = {}

    if (idAvaliacao == '' || idAvaliacao == undefined || isNaN(idAvaliacao)) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosAvaliacao = await avaliacaoDAO.selectByIdAvaliacaoComUsuarios(idAvaliacao)

        if (dadosAvaliacao) {
            if (dadosAvaliacao.length > 0) {
                // Formatar a avaliação para que fique no formato desejado dentro de um array, incluindo o id
                avaliacaoJSON.avaliacao = [{
                    id: dadosAvaliacao[0].id,  // Inclui o id da avaliação
                    estrelas: dadosAvaliacao[0].estrelas,
                    comentario: dadosAvaliacao[0].comentario,
                    id_avaliador: dadosAvaliacao[0].id_avaliador,
                    tipo_avaliador: dadosAvaliacao[0].tipo_avaliador,
                    id_avaliado: dadosAvaliacao[0].id_avaliado,
                    tipo_avaliado: dadosAvaliacao[0].tipo_avaliado
                }]
                avaliacaoJSON.status_code = 200

                return avaliacaoJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}



module.exports = {
    setInserirNovaAvaliacao,
    setAtualizarAvaliacao,
    setExcluirAvaliacao,
    getListarAvaliacoes,
    getBuscarAvaliacao
}