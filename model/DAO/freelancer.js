/**********************************************************************************************************
 * Objetivo: Arquivo responsável por realizar CRUD no Banco de Dados MySQL de freelancers                 *
 * Data: 05/09/2024                                                                                       *
 * Autor: Gustavo Henrique e Matheus Zanoni                                                               *
 * 1.0                                                                                                    *
 *********************************************************************************************************/

//Import da bibiblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

//Instanciando a classe PrismaClient
const prisma = new PrismaClient()

//Função para inserir um freelancer no Banco de Dados
const insertFreelancer = async (dadosFreelancer) => {

    try {
        let sql

        sql = `insert into cadastro_freelancer(nome_freelancer,
                                            data_nascimento, 
                                            cpf_freelancer,
                                            email_freelancer,
                                            senha_freelancer
                                            ) values(
                                            '${dadosFreelancer.nome_freelancer}',
                                            '${dadosFreelancer.data_nascimento}',
                                             ${dadosFreelancer.cpf_freelancer},
                                            '${dadosFreelancer.email_freelancer}',
                                            '${dadosFreelancer.senha_freelancer}'                                            
                                            )`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

    } catch (error) {
        console.error('Database Error:', error)
        return false
    }

}
const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL)as id from cadastro_freelancer order by id desc limit 1'

        let rsFreelancers = await prisma.$queryRawUnsafe(sql)

        if (rsFreelancers) {
            return rsFreelancers[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectAllFreelancers = async () => {
    try {
        let sql = 'select * from cadastro_freelancer'

        let rsFreelancers = await prisma.$queryRawUnsafe(sql)

        return rsFreelancers

    } catch (error) {

        return false

    }
}

const selectByIdFreelancer = async (id) => {
    try {

        let sql = `SELECT * FROM cadastro_freelancer WHERE id = ${id}`

        let rsFreelancer = await prisma.$queryRawUnsafe(sql)

        return rsFreelancer

    } catch (error) {
        return false
    }
}

const updateFreelancer = async (idFreelancer, dadosFreelancer) => {

    let sql

    try {
        sql = `update cadastro_freelancer set nome_freelancer = '${dadosFreelancer.nome_freelancer}', 
                                           data_nascimento = '${dadosFreelancer.data_nascimento}',
                                           cpf_freelancer = '${dadosFreelancer.cpf_freelancer}',
                                           email_freelancer = '${dadosFreelancer.email_freelancer}',
                                           senha_freelancer = '${dadosFreelancer.senha_freelancer}' where id = ${idFreelancer}`

        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {

        return false
    }

}

const deleteFreelancer = async (id) => {

    try {
        let sql = `delete from cadastro_freelancer where id = ${id}`

        let rsFreelancer = await prisma.$queryRawUnsafe(sql)

        return rsFreelancer

    } catch (error) {
        return false
    }

}

module.exports = {
    insertFreelancer,
    selectId,
    selectAllFreelancers,
    selectByIdFreelancer,
    updateFreelancer,
    deleteFreelancer
}