/**********************************************************************************************************
 * Objetivo: Arquivo responsável por realizar CRUD no Banco de Dados MySQL de habilidades                  *
 * Data: 17/09/2024                                                                                       *
 * Autor: Gustavo Henrique e Matheus Zanoni                                                               *
 * 1.0                                                                                                    *
 *********************************************************************************************************/

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const insertHabilidade = async (dadosHabilidade) => {

    try {
        let sql

        sql = `insert into habilidades(nome_habilidade, icon_habilidade) values('${dadosHabilidade.nome_habilidade}','${dadosHabilidade.icon_habilidade}' )`

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
        let sql = 'select CAST(id as DECIMAL)as id from habilidades order by id desc limit 1'

        let rsHabilidades = await prisma.$queryRawUnsafe(sql)

        if (rsHabilidades) {
            return rsHabilidades[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateHabilidade = async (idHabilidade, dadosHabilidade) => {

    let sql

    try {
        sql = `update habilidades set nome_habilidade = '${dadosHabilidade.nome_habilidade}', 
                                                    icon_habilidade = '${dadosHabilidade.icon_habilidade}' where id = ${idHabilidade}`

        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {

        return false
    }

}

const deleteHabilidade = async (id) => {

    try {
        let sql = `delete from habilidades where id = ${id}`

        let rsHabilidades = await prisma.$queryRawUnsafe(sql)

        return rsHabilidades

    } catch (error) {
        return false
    }

}

const selectByIdHabilidade = async (id) => {

    try {
        let sql = `select * from habilidades where id = ${id}`

        let rsHabilidades = await prisma.$queryRawUnsafe(sql)

        return rsHabilidades

    } catch (error) {
        return false
    }


}

const selectAllhabilidades = async () => {

    try {
        let sql = 'select * from habilidades'

        let rsHabilidades = await prisma.$queryRawUnsafe(sql)

        return rsHabilidades

    } catch (error) {

        return false

    }

}


module.exports = {
    insertHabilidade,
    selectId,
    updateHabilidade,
    deleteHabilidade,
    selectAllhabilidades,
    selectByIdHabilidade,
}