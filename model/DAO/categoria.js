/**********************************************************************************************************
 * Objetivo: Arquivo responsável por realizar CRUD no Banco de Dados MySQL de categorias                  *
 * Data: 17/09/2024                                                                                       *
 * Autor: Gustavo Henrique e Matheus Zanoni                                                               *
 * 1.0                                                                                                    *
 *********************************************************************************************************/

const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const insertCategoria = async (dadosCategoria) => {

    try {
        let sql

        sql = `insert into categorias(nome_categoria) values('${dadosCategoria.nome_categoria}')`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

        //Cria a variável SQL

    } catch (error) {

        return false
    }

}

const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL)as id from categorias order by id desc limit 1'

        let rsCategorias = await prisma.$queryRawUnsafe(sql)

        if (rsCategorias) {
            return rsCategorias[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateCategoria = async (idCategoria, dadosCategoria) => {

    let sql

    try {
        sql = `update categorias set nome_categoria = '${dadosCategoria.nome_categoria}' where id = ${idCategoria}`

        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {

        return false
    }

}

const deleteCategoria = async (id) => {

    try {
        let sql = `delete from categorias where id = ${id}`

        let rsCategorias = await prisma.$queryRawUnsafe(sql)

        return rsCategorias

    } catch (error) {
        return false
    }

}

const selectByIdCategoria = async (id) => {

    try {
        let sql = `select * from categorias where id = ${id}`

        let rsCategorias = await prisma.$queryRawUnsafe(sql)

        return rsCategorias

    } catch (error) {
        return false
    }


}

const selectAllCategorias = async () => {

    try {
        let sql = 'select * from categorias'

        let rsCategorias = await prisma.$queryRawUnsafe(sql)

        return rsCategorias

    } catch (error) {

        return false

    }

}


module.exports = {
    insertCategoria,
    selectId,
    updateCategoria,
    deleteCategoria,
    selectAllCategorias,
    selectByIdCategoria,
}