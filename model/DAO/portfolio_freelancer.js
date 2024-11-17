// Import da biblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

// Instanciando a classe PrismaClient
const prisma = new PrismaClient()

const insertPortfolioFreelancer = async (dadosPortfolioFreelancer) => {
    try {
        let sql = `insert into portfolio_freelancer (
                                                     id_portfolio, 
                                                     id_freelancer
                                                     ) values (
                                                               '${dadosPortfolioFreelancer.id_portfolio}', 
                                                               '${dadosPortfolioFreelancer.id_freelancer}'
                                                               )`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result
    } catch (error) {
        console.error("Erro ao inserir nova habilidade projeto:", error)
        return false
    }
}

const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL) as id FROM portfolio_freelancer order by id desc limit 1'
        
        let rsPortfolioFreelancers = await prisma.$queryRawUnsafe(sql)

        if (rsPortfolioFreelancers.length > 0) {
            return rsPortfolioFreelancers[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updatePortfolioFreelancer = async (idPortfolio, idFreelancer) => {
    let sql

    try {
        // Atualiza a tabela intermediária "portfolio_freelancer" com o novo id_freelancer
        sql = `update portfolio_freelancer set id_freelancer = '${idFreelancer}' where id_portfolio = ${idPortfolio}`

        let result = await prisma.$executeRawUnsafe(sql)
        
        return result // Se for bem-sucedido, retorna verdadeiro

    } catch (error) {
        console.error("Erro ao atualizar associação portfolio-freelancer:", error)
        return false
    }
}


const deletePortfolioFreelancer = async (id) => {

    try {

        let sql = `delete from portfolio_freelancer where id = ${id}`

        let rsPortfolioFreelancers = await prisma.$queryRawUnsafe(sql)

        return rsPortfolioFreelancers

    } catch (error) {
        return false
    }
}

const selectByIdPortfolioFreelancer = async (idPortfolioFreelancer) => {
    try {
        let sql = `SELECT * FROM portfolio_freelancer WHERE id = ${idPortfolioFreelancer}`
        
        let rsPortfolioFreelancers = await prisma.$queryRawUnsafe(sql)

        return rsPortfolioFreelancers

    } catch (error) {
        return false
    }
}

const selectAllPortfolioFreelancers = async () => {

    try {

        let sql = 'select * from portfolio_freelancer'
        
        let rsPortfolioFreelancers = await prisma.$queryRawUnsafe(sql)

        return rsPortfolioFreelancers

    } catch (error) {
        return false
    }
}


module.exports = {
    insertPortfolioFreelancer,
    selectId,
    updatePortfolioFreelancer,
    deletePortfolioFreelancer,
    selectAllPortfolioFreelancers,
    selectByIdPortfolioFreelancer
}
