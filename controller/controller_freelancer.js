const freelancersDAO = require ('../model/DAO/freelancer.js')
const message = require('../modulo/config.js')

const setInserirFreelancer = async (dadosFreelancer, contentType) => {

    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let novoFreelancerJSON = {}

            if (
               dadosFreelancer.nome_freelancer == '' || dadosFreelancer.nome_freelancer == undefined || dadosFreelancer.nome_freelancer == null || dadosFreelancer.nome_freelancer.length > 50 || 
               dadosFreelancer.data_nascimento == undefined || dadosFreelancer.data_nascimento == null || dadosFreelancer.data_nascimento.length != 10 ||
               dadosFreelancer.cpf_freelancer == '' || dadosFreelancer.cpf_freelancer == undefined || dadosFreelancer.cpf_freelancer == null || dadosFreelancer.cpf_freelancer.length > 11 || 
               dadosFreelancer.email_freelancer == '' || dadosFreelancer.email_freelancer == undefined || dadosFreelancer.email_freelancer == null || dadosFreelancer.email_freelancer.length > 255 || 
               dadosFreelancer.senha_freelancer == '' || dadosFreelancer.senha_freelancer == undefined || dadosFreelancer.senha_freelancer == null || dadosFreelancer.senha_freelancer.length > 80
            ) {
                return message.ERROR_REQUIRED_FIELDS //400
            } 

            // Verifica se o CPF já está cadastrado
            const cpfExistente = await freelancersDAO.selectByCpf(dadosFreelancer.cpf_freelancer);
            if (cpfExistente) {
                return message.ERROR_CPF_ALREADY_EXISTS; //409
            }

            // Verifica se o e-mail já está cadastrado
            const emailExistente = await freelancersDAO.selectByEmail(dadosFreelancer.email_freelancer);
            if (emailExistente) {
                return message.ERROR_EMAIL_ALREADY_EXISTS; //409
            }

            else {
                //encaminha os dados para o DAO inserir
                let novoFreelancer = await freelancersDAO.insertFreelancer(dadosFreelancer)

                if (novoFreelancer) {

                    let id = await freelancersDAO.selectId()

                    //Cria o JSON de retorno com informações de requisição e os dados novos
                    novoFreelancerJSON.status = message.SUCESS_CREATED_ITEM.status
                    novoFreelancerJSON.status_code = message.SUCESS_CREATED_ITEM.status_code
                    novoFreelancerJSON.message = message.SUCESS_CREATED_ITEM.message
                    novoFreelancerJSON.id = parseInt(id)
                    novoFreelancerJSON.freelancer = dadosFreelancer

                    return novoFreelancerJSON //201

                } else {
                    console.log("Erro interno do servidor ao inserir freelancers no banco de dados.")
                    return message.ERROR_INTERNAL_SERVER_DB //500
                }
            }

        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }

}


const getListarFreelancers = async () => {
    let freelancersJSON = {};
    let dadosFreelancers = await freelancersDAO.selectAllFreelancers();

    if (dadosFreelancers) {
        if (dadosFreelancers.length > 0) {
            // Organize os dados para incluir as avaliações junto com os freelancers
            const freelancersMap = {};

            dadosFreelancers.forEach(freelancer => {
                const { id, nome_freelancer, data_nascimento, cpf_freelancer, email_freelancer, is_premium, id_avaliacao, estrelas, comentario, nome_avaliador } = freelancer;

                // Adiciona os freelancers se ainda não existir no mapa
                if (!freelancersMap[id]) {
                    freelancersMap[id] = {
                        id,
                        nome_freelancer,
                        data_nascimento,
                        cpf_freelancer: cpf_freelancer.toString(),
                        email_freelancer,
                        is_premium,
                        avaliacao: []
                    };
                }

                // Adiciona a avaliação ao freelancer, se ela existir
                if (id_avaliacao) {
                    freelancersMap[id].avaliacao.push({
                        id: id_avaliacao,
                        estrelas,
                        comentario,
                        id_avaliador: freelancer.id_avaliador,
                        nome_avaliador,
                        tipo_avaliador: freelancer.tipo_avaliador,
                        foto_perfil_avaliador: freelancer.foto_perfil_avaliador 
                    });
                }
            });

            // Converte o mapa em um array
            freelancersJSON.freelancers = Object.values(freelancersMap);
            freelancersJSON.quantidade = freelancersJSON.freelancers.length;
            freelancersJSON.status_code = 200;

            return freelancersJSON;
        } else {
            return { message: 'Nenhum freelancer encontrado', status_code: 404 };
        }
    } else {
        return { message: 'Erro interno do servidor', status_code: 500 };
    }
}



const getBuscarFreelancer = async (id) => {
    let idFreelancer = id
    let freelancerJSON = {}

    if (idFreelancer === '' || idFreelancer === undefined || isNaN(idFreelancer)) {
        return { status_code: 400, message: 'ID inválido' }
    } else {
        try {
            let dadosFreelancer = await freelancersDAO.selectByIdFreelancer(idFreelancer)

            if (dadosFreelancer) {
                if (dadosFreelancer.length > 0) {
                    // Converte BigInt para string
                    dadosFreelancer = dadosFreelancer.map(freelancer => {
                        if (freelancer.cpf_freelancer) {
                            freelancer.cpf_freelancer = freelancer.cpf_freelancer.toString()
                        }
                        return freelancer
                    })

                    freelancerJSON.freelancer = dadosFreelancer
                    freelancerJSON.status_code = 200
                    return freelancerJSON
                } else {
                    return { status_code: 404, message: 'freelancer não encontrado' }
                }
            } else {
                return { status_code: 500, message: 'Erro interno do servidor' }
            }
        } catch (error) {
            return { status_code: 500, message: 'Erro interno do servidor' }
        }
    }
}

const setAtualizarFreelancer = async (dadosFreelancer, contentType, id) => {
    try {
        if (String(contentType).toLowerCase() == 'application/json') {
            let updateFreelancerJSON = {}

            if (
                dadosFreelancer.nome_freelancer == '' || dadosFreelancer.nome_freelancer == undefined || dadosFreelancer.nome_freelancer == null || dadosFreelancer.nome_freelancer.length > 50 || 
                dadosFreelancer.data_nascimento == undefined || dadosFreelancer.data_nascimento == null || dadosFreelancer.data_nascimento.length != 10 ||
                dadosFreelancer.cpf_freelancer == '' || dadosFreelancer.cpf_freelancer == undefined || dadosFreelancer.cpf_freelancer == null || dadosFreelancer.cpf_freelancer.length > 11 || 
                dadosFreelancer.email_freelancer == '' || dadosFreelancer.email_freelancer == undefined || dadosFreelancer.email_freelancer == null || dadosFreelancer.email_freelancer.length > 255 || 
                dadosFreelancer.senha_freelancer == '' || dadosFreelancer.senha_freelancer == undefined || dadosFreelancer.senha_freelancer == null || dadosFreelancer.senha_freelancer.length > 80
             ) {
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
                let freelancerAtualizado = await freelancersDAO.updateFreelancer(id, dadosFreelancer)

                if (freelancerAtualizado) {
                    let updatedFreelancer = await freelancersDAO.selectByIdFreelancer(id)
                    let updatedId = updatedFreelancer[0].id

                    updateFreelancerJSON.status = message.SUCESS_UPDATE_ITEM.status
                    updateFreelancerJSON.status_code = message.SUCESS_UPDATE_ITEM.status_code
                    updateFreelancerJSON.message = message.SUCESS_UPDATE_ITEM.message
                    updateFreelancerJSON.id = updatedId
                    updateFreelancerJSON.freelancer = dadosFreelancer

                    return updateFreelancerJSON

                } else {
                    return message.ERROR_INTERNAL_SERVER_DB // 500
                }
            }

        }

    } catch (error) {
        return message.ERROR_INTERNAL_SERVER //500 erro na camada da controller
    }
}

const setExcluirFreelancer = async (id) => {

    try {

        let idFreelancer = id

        let validaFreelancer = await getBuscarFreelancer(idFreelancer)

        let dadosFreelancer = await freelancersDAO.deleteFreelancer(idFreelancer)

        if (idFreelancer == '' || idFreelancer == undefined || isNaN(idFreelancer)) {

            return message.ERROR_INVALID_ID //400

        } else if (validaFreelancer.status == false) {
            return message.ERROR_NOT_FOUND

        } else {

            if (dadosFreelancer)
                return message.SUCESS_DELETE_ITEM // 200
            else
                return message.ERROR_INTERNAL_SERVER_DB

        }


    } catch (error) {
        return message.ERROR_INTERNAL_SERVER
    }

}


const getFreelancerByEmail = async (emailPesquisado) =>{

    let dadosFreelancers = await freelancersDAO.getFreelancerByEmail(emailPesquisado)

    if (dadosFreelancers) {
        if (dadosFreelancers.length > 0) {
            return dadosFreelancers
        } else {
            return { message: 'Nenhum registro encontrado', status_code: 404 }
        }
    } else {
        return { message: 'Erro interno do servidor', status_code: 500 }
    }

}





module.exports = {
    setInserirFreelancer,
    getListarFreelancers,
    getBuscarFreelancer,
    setAtualizarFreelancer,
    setExcluirFreelancer,
    getFreelancerByEmail
}