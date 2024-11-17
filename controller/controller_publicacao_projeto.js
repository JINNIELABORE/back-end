const publicacaoProjetoDAO = require('../model/DAO/publicacao_projeto.js')
const categoriaProjetoDAO = require('../model/DAO/categoria_publicacao_projeto.js')
const habilidadeProjetoDAO = require('../model/DAO/habilidade_publicacao_projeto.js')

const message = require('../modulo/config.js')

const setInserirNovaPublicacaoProjeto = async (dadosPublicacaoProjeto, contentType) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novaPublicacaoProjetoJSON = {}

            if (
                dadosPublicacaoProjeto.nome_projeto === '' || dadosPublicacaoProjeto.nome_projeto === undefined || dadosPublicacaoProjeto.nome_projeto === null || dadosPublicacaoProjeto.nome_projeto.length > 50 ||
                dadosPublicacaoProjeto.descricao_projeto === '' || dadosPublicacaoProjeto.descricao_projeto === undefined || dadosPublicacaoProjeto.descricao_projeto === null || dadosPublicacaoProjeto.descricao_projeto.length > 150 ||
                dadosPublicacaoProjeto.orcamento === '' || dadosPublicacaoProjeto.orcamento === undefined || dadosPublicacaoProjeto.orcamento === null ||
                dadosPublicacaoProjeto.id_nivel_experiencia === '' || dadosPublicacaoProjeto.id_nivel_experiencia === undefined || dadosPublicacaoProjeto.id_nivel_experiencia === null
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
                let novaPublicacaoProjeto = await publicacaoProjetoDAO.insertPublicacaoProjeto(dadosPublicacaoProjeto)

                if (novaPublicacaoProjeto) {

                    let id = await publicacaoProjetoDAO.selectId()

                    novaPublicacaoProjetoJSON.status = message.SUCESS_CREATED_ITEM.status
                    novaPublicacaoProjetoJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novaPublicacaoProjetoJSON.message = message.SUCESS_CREATED_ITEM.message
                    novaPublicacaoProjetoJSON.id = parseInt(id)
                    novaPublicacaoProjetoJSON.publicacao_projeto = dadosPublicacaoProjeto

                    return novaPublicacaoProjetoJSON //201

                } else {
                    console.log("Erro interno do servidor ao inserir PublicacaoProjeto no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB //500
                }
            }

        }

    } catch (error) {
        console.log(error)
        return message.ERROR_INTERNAL_SERVER
    }
}

const setAtualizarPublicacaoProjeto = async (dadosPublicacaoProjeto, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updatePublicacaoProjetoJSON = {}

            if (
                dadosPublicacaoProjeto.nome_projeto === '' || dadosPublicacaoProjeto.nome_projeto === undefined || dadosPublicacaoProjeto.nome_projeto === null || dadosPublicacaoProjeto.nome_projeto.length > 50 ||
                dadosPublicacaoProjeto.descricao_projeto === '' || dadosPublicacaoProjeto.descricao_projeto === undefined || dadosPublicacaoProjeto.descricao_projeto === null || dadosPublicacaoProjeto.descricao_projeto.length > 150 ||
                dadosPublicacaoProjeto.orcamento === '' || dadosPublicacaoProjeto.orcamento === undefined || dadosPublicacaoProjeto.orcamento === null ||
                dadosPublicacaoProjeto.id_nivel_experiencia === '' || dadosPublicacaoProjeto.id_nivel_experiencia === undefined || dadosPublicacaoProjeto.id_nivel_experiencia === null
            ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
               
                let publicacaoProjetoAtualizada = await publicacaoProjetoDAO.updatePublicacaoProjeto(id, dadosPublicacaoProjeto)

                if (publicacaoProjetoAtualizada) {
                    let updatedPublicacaoProjeto = await publicacaoProjetoDAO.selectByIdPublicaoProjeto(id) 
                    let updatedId = updatedPublicacaoProjeto[0].id 

                    updatePublicacaoProjetoJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updatePublicacaoProjetoJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updatePublicacaoProjetoJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updatePublicacaoProjetoJSON.id = updatedId // Usa o id atualizado aqui
                    updatePublicacaoProjetoJSON.publicacao_projeto = dadosPublicacaoProjeto

                    return updatePublicacaoProjetoJSON

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }

        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }
}

const setExcluirPublicacaoProjeto = async (id) => {
    try {
        // Verificar se o ID é válido
        if (isNaN(id) || id <= 0) {
            return {
                status: message.ERROR_INVALID_ID.status,
                status_code: message.ERROR_INVALID_ID.status_code,
                message: message.ERROR_INVALID_ID.message
            }
        }

        // Verificar se o projeto existe
        let validaPublicacaoProjeto = await getBuscarPublicacaoProjeto(id)
        if (!validaPublicacaoProjeto) {
            return {
                status: message.ERROR_NOT_FOUND.status,
                status_code: message.ERROR_NOT_FOUND.status_code,
                message: message.ERROR_NOT_FOUND.message
            }
        }

        // Excluir as associações de habilidades do projeto
        let resultadoHabilidade = await habilidadeProjetoDAO.deleteHabilidadeProjeto(id)
        if (!resultadoHabilidade) {
            return {
                status: message.ERROR_INTERNAL_SERVER_DB.status,
                status_code: message.ERROR_INTERNAL_SERVER_DB.status_code,
                message: "Erro ao excluir as associações de habilidades do projeto"
            }
        }

        // Excluir as associações de categorias do projeto
        let resultadoCategoria = await categoriaProjetoDAO.deleteCategoriaProjeto(id)
        if (!resultadoCategoria) {
            return {
                status: message.ERROR_INTERNAL_SERVER_DB.status,
                status_code: message.ERROR_INTERNAL_SERVER_DB.status_code,
                message: "Erro ao excluir as associações de categorias do projeto"
            }
        }

        // Excluir o próprio projeto
        let resultadoProjeto = await publicacaoProjetoDAO.deletePublicacaoProjeto(id)
        if (resultadoProjeto) {
            return {
                status: message.SUCESS_DELETE_ITEM.status,
                status_code: message.SUCESS_DELETE_ITEM.status_code,
                message: message.SUCESS_DELETE_ITEM.message
            }
        } else {
            return {
                status: message.ERROR_INTERNAL_SERVER_DB.status,
                status_code: message.ERROR_INTERNAL_SERVER_DB.status_code,
                message: "Erro ao excluir o projeto"
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

const getListarPublicacaoProjetos = async () => {

    // Cria o objeto JSON
    let publicacaoProjetosJSON = {};

    let dadosPublicacaoProjetos = await publicacaoProjetoDAO.selectAllPublicacaoProjetos();

    if (dadosPublicacaoProjetos) {
        if (dadosPublicacaoProjetos.length > 0) {
            const publicacaoProjetosMap = {};

            dadosPublicacaoProjetos.forEach(projeto => {
                const { 
                    id, nome_projeto, descricao_projeto, orcamento, id_nivel_experiencia, 
                    nome_categoria, nome_habilidade 
                } = projeto;

                // Adiciona o projeto se ainda não existir no mapa
                if (!publicacaoProjetosMap[id]) {
                    publicacaoProjetosMap[id] = {
                        id,
                        nome_projeto,
                        descricao_projeto,
                        orcamento,
                        id_nivel_experiencia,
                        categorias: [], // Lista de categorias do projeto
                        habilidades: [] // Lista de habilidades do projeto
                    };
                }

                // Adiciona a categoria ao projeto
                if (nome_categoria) {
                    const categoriaExistente = publicacaoProjetosMap[id].categorias.some(categoria => categoria.nome_categoria === nome_categoria);
                    if (!categoriaExistente) {
                        publicacaoProjetosMap[id].categorias.push({
                            nome_categoria
                        });
                    }
                }

                // Adiciona a habilidade ao projeto
                if (nome_habilidade) {
                    const habilidadeExistente = publicacaoProjetosMap[id].habilidades.some(habilidade => habilidade.nome_habilidade === nome_habilidade);
                    if (!habilidadeExistente) {
                        publicacaoProjetosMap[id].habilidades.push({
                            nome_habilidade
                        });
                    }
                }
            });

            // Converte o mapa em um array
            publicacaoProjetosJSON.projetos = Object.values(publicacaoProjetosMap);
            publicacaoProjetosJSON.quantidade = publicacaoProjetosJSON.projetos.length;
            publicacaoProjetosJSON.status_code = 200;

            return publicacaoProjetosJSON;
        } else {
            return { message: 'Nenhum projeto encontrado', status_code: 404 };
        }
    } else {
        return { message: 'Erro interno do servidor', status_code: 500 };
    }
}


const getBuscarPublicacaoProjeto = async (id) => {

    let idPublicacaoProjeto = id

    let publicacaoProjetoJSON = {}

    if (idPublicacaoProjeto == '' || idPublicacaoProjeto == undefined || isNaN(idPublicacaoProjeto)) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosPublicacaoProjeto = await publicacaoProjetoDAO.selectByIdPublicaoProjeto(idPublicacaoProjeto)

        if (dadosPublicacaoProjeto) {

            if (dadosPublicacaoProjeto.length > 0) {
                publicacaoProjetoJSON.PublicacaoProjeto = dadosPublicacaoProjeto
                publicacaoProjetoJSON.status_code = 200

                return publicacaoProjetoJSON
            } else {
                return message.ERROR_NOT_FOUND
            }
        } else {
            return message.ERROR_INTERNAL_SERVER_DB
        }
    }
}

module.exports = {
    setInserirNovaPublicacaoProjeto,
    setAtualizarPublicacaoProjeto,
    setExcluirPublicacaoProjeto,
    getListarPublicacaoProjetos,
    getBuscarPublicacaoProjeto
}