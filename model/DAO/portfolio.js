/**********************************************************************************************************
 * Objetivo: Arquivo responsável por realizar CRUD no Banco de Dados MySQL de portfólios                  *
 * Data: 29/10/2024                                                                                       *
 * Autor: Gustavo Henrique e Matheus Zanoni                                                               *
 * 1.0                                                                                                    *
 *********************************************************************************************************/

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const insertPortfolio = async (dadosPortfolio) => {
    try {
        let sql

        sql = `insert into portfolio (arquivo) values('${dadosPortfolio.arquivo}')`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

        //Cria a variável SQL

    } catch (error) {
        console.log(error);
        return false
    }
}


const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL)as id from portfolio order by id desc limit 1'

        let rsPortfolio = await prisma.$queryRawUnsafe(sql)

        if (rsPortfolio) {
            return rsPortfolio[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}
const updatePortfolio = async (idPortfolio, dadosPortfolio) => {
    let sql

    try {
        sql = `update portfolio set arquivo = '${dadosPortfolio.arquivo}' where id = ${idPortfolio}`

        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {

        return false
    }
}

const deletePortfolio = async (id) => {
    try {
        let sql = `delete from portfolio where id = ${id}`

        let result = await prisma.$executeRawUnsafe(sql)

        return result ? true : false
    } catch (error) {
        console.error("Erro ao excluir arquivo do portfólio:", error)
        return false
    }
}


const selectByIdPortfolio = async (id) => {

    try {
        let sql = `select * from portfolio where id = ${id}`

        let rsPortfolio = await prisma.$queryRawUnsafe(sql)

        return rsPortfolio

    } catch (error) {
        return false
    }


}
const selectAllPortfolios = async () => {
    try {
        let sql = 'select * from portfolio'

        let rsPortfolio = await prisma.$queryRawUnsafe(sql)

        return rsPortfolio ? rsPortfolio : false
    } catch (error) {
        console.error("Erro ao listar todos os arquivos do portfólio:", error)
        return false
    }
}

module.exports = {
    insertPortfolio,
    selectId,
    updatePortfolio,
    deletePortfolio,
    selectAllPortfolios,
    selectByIdPortfolio
}
