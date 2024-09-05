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
                return message.ERROR_REQUIRED_FIELDS//400

            } else {
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

module.exports = {
    setInserirFreelancer
}