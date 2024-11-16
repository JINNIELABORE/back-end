const avaliacaoDAO = require('../model/DAO/avaliacao.js')
const avaliacaoUsuarioDAO = require('../model/DAO/avaliacao_usuario.js')
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
            let updateAvaliacaoJSON = {};

            if (
                dadosAvaliacao.estrelas == '' || dadosAvaliacao.estrelas == undefined || dadosAvaliacao.estrelas == null || 
                dadosAvaliacao.comentario == '' || dadosAvaliacao.comentario == undefined || dadosAvaliacao.comentario == null
            ) {
                return message.ERROR_REQUIRED_FIELDS; // 400
            } else {
                // Atualiza os dados na tabela "avaliacao"
                let avaliacao = await avaliacaoDAO.updateAvaliacao(id, dadosAvaliacao);

                if (avaliacao) {
                    // Agora, atualiza a relação na tabela "avaliacao_usuario"
                    let dadosAvaliacaoUsuario = {
                        id_avaliacao: id,
                        id_avaliador: dadosAvaliacao.id_avaliador,
                        tipo_avaliador: dadosAvaliacao.tipo_avaliador,
                        id_avaliado: dadosAvaliacao.id_avaliado,
                        tipo_avaliado: dadosAvaliacao.tipo_avaliado
                    };

                    let avaliacaoUsuarioAtualizada = await avaliacaoUsuarioDAO.updateAvaliacaoUsuario(id, dadosAvaliacaoUsuario);

                    if (avaliacaoUsuarioAtualizada) {
                        let updatedAvaliacao = await avaliacaoDAO.selectByIdAvaliacao(id); // Obtém a avaliação atualizada
                        let updatedId = updatedAvaliacao[0].id;

                        updateAvaliacaoJSON.status = message.SUCESS_UPDATE_ITEM.status;
                        updateAvaliacaoJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code;
                        updateAvaliacaoJSON.message = message.SUCESS_UPDATE_ITEM.message;
                        updateAvaliacaoJSON.id = updatedId; // ID atualizado da avaliação
                        updateAvaliacaoJSON.avaliacao = dadosAvaliacao;

                        return updateAvaliacaoJSON;
                    } else {
                        return message.ERROR_INTERNAL_SERVER_DB; // Erro ao atualizar avaliação_usuario
                    }
                } else {
                    return message.ERROR_INTERNAL_SERVER_DB; // Erro ao atualizar avaliação
                }
            }
        }

    } catch (error) {
        console.error(error);
        return message.ERROR_INTERNAL_SERVER; // 500 - Erro na camada de controller
    }
};


const setExcluirAvaliacao = async (id) => {
    try {
        // Verificação básica de ID válido
        if (isNaN(id) || id <= 0) {
            return {
                status: message.ERROR_INVALID_ID.status,
                status_code: message.ERROR_INVALID_ID.status_code,
                message: message.ERROR_INVALID_ID.message
            }
        }

        // Verificar se a avaliação existe
        let validaAvaliacao = await avaliacaoDAO.selectByIdAvaliacao(id)
        if (!validaAvaliacao) {
            return {
                status: message.ERROR_NOT_FOUND.status,
                status_code: message.ERROR_NOT_FOUND.status_code,
                message: message.ERROR_NOT_FOUND.message
            }
        }

        // Excluir registros da tabela intermediária
        let resultadoIntermediaria = await avaliacaoUsuarioDAO.deleteAvaliacaoUsuario(id)

        if (!resultadoIntermediaria) {
            return {
                status: message.ERROR_INTERNAL_SERVER_DB.status,
                status_code: message.ERROR_INTERNAL_SERVER_DB.status_code,
                message: "Erro ao excluir os registros da tabela intermediária"
            }
        }

        // Agora, excluir a avaliação
        let resultadoAvaliacao = await avaliacaoDAO.deleteAvaliacao(id)

        if (resultadoAvaliacao) {
            return {
                status: message.SUCESS_DELETE_ITEM.status,
                status_code: message.SUCESS_DELETE_ITEM.status_code,
                message: message.SUCESS_DELETE_ITEM.message
            }
        } else {
            return {
                status: message.ERROR_INTERNAL_SERVER_DB.status,
                status_code: message.ERROR_INTERNAL_SERVER_DB.status_code,
                message: "Erro ao excluir avaliação"
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

const getListarAvaliacoes = async () => {
    let avaliacoesJSON = {}
    
    // Alteração na consulta para incluir a foto de perfil do avaliador
    let dadosAvaliacoes = await avaliacaoDAO.selectAllAvaliacoesComUsuarios()

    if (dadosAvaliacoes) {
        if (dadosAvaliacoes.length > 0) {
            avaliacoesJSON.avaliacoes = dadosAvaliacoes.map(avaliacao => ({
                id: avaliacao.id,
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