//Import da bibiblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

//Instanciando a classe PrismaClient
const prisma = new PrismaClient()

//Função para inserir um Avaliacao no Banco de Dados
const insertAvaliacao = async (dadosAvaliacao) => {

    try {
        let sql

        sql = `insert into avaliacao (estrelas, 
                                            comentario
                                            ) values(
                                            '${dadosAvaliacao.estrelas}',
                                             '${dadosAvaliacao.comentario}'                                         
                                            )`

        let result = await prisma.$executeRawUnsafe(sql)

        console.log('Result:', result)

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
        let sql = 'select CAST(id as DECIMAL)as id from avaliacao order by id desc limit 1'

        let rsAvaliacoes = await prisma.$queryRawUnsafe(sql)

        if (rsAvaliacoes) {
            return rsAvaliacoes[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectAllAvaliacoes = async () => {
    try {
        let sql = 'select * from avaliacao'

        let rsAvaliacoes = await prisma.$queryRawUnsafe(sql)

        return rsAvaliacoes

    } catch (error) {

        return false

    }
}

const selectByIdAvaliacao = async (id) => {
    try {

        let sql = `SELECT * FROM avaliacao WHERE id = ${id}`

        let rsAvaliacao = await prisma.$queryRawUnsafe(sql)

        return rsAvaliacao

    } catch (error) {
        return false
    }
}

const updateAvaliacao = async (idAvaliacao, dadosAvaliacao) => {

    let sql

    try {
        sql = `update avaliacao set estrelas = '${dadosAvaliacao.estrelas}', 
                                           comentario = '${dadosAvaliacao.comentario}'
                                           where id = ${idAvaliacao}`

        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {

        return false
    }

}

const deleteAvaliacao = async (id) => {

    try {
        let sql = `delete from avaliacao where id = ${id}`

        let rsAvaliacao = await prisma.$queryRawUnsafe(sql)

        return rsAvaliacao

    } catch (error) {
        return false
    }

}

module.exports = {
    insertAvaliacao,
    selectId,
    selectAllAvaliacoes,
    selectByIdAvaliacao,
    updateAvaliacao,
    deleteAvaliacao
}