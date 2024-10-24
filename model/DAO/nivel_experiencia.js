/**********************************************************************************************************
 * Objetivo: Arquivo responsável por realizar CRUD no Banco de Dados MySQL de clientes                    *
 * Data: 24/10/2024                                                                                       *
 * Autor: Gustavo Henrique e Matheus Zanoni                                                               *
 * 1.0                                                                                                    *
 *********************************************************************************************************/

//Import da bibiblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

//Instanciando a classe PrismaClient
const prisma = new PrismaClient()

//Função para inserir um cliente no Banco de Dados
const insertNivelExperiencia = async (dadosExperiencia) => {

    try {
        let sql

        sql = `insert into nivel_experiencia(nivel_experiencia
                                            ) values(
                                            '${dadosExperiencia.nivel_experiencia}'                                         
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
        let sql = 'select CAST(id as DECIMAL)as id from nivel_experiencia order by id desc limit 1'

        let rsExperiencia = await prisma.$queryRawUnsafe(sql)

        if (rsExperiencia) {
            return rsExperiencia[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectAllNivelExperiencia = async () => {
    try {
        let sql = 'select * from nivel_experiencia'

        let rsExperiencia = await prisma.$queryRawUnsafe(sql)

        return rsExperiencia

    } catch (error) {

        return false

    }
}

const selectByIdNivelExperiencia = async (id) => {
    try {

        let sql = `SELECT * FROM nivel_experiencia WHERE id = ${id}`

        let rsExperiencia = await prisma.$queryRawUnsafe(sql)

        return rsExperiencia

    } catch (error) {
        return false
    }
}

const updateNivelExperiencia = async (idNivelExperiencia, dadosNivel) => {

    let sql

    try {
        sql = `update nivel_experiencia set nivel_experiencia = '${dadosNivel.nivel_experiencia}"`

        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {

        return false
    }

}

const deleteNivelExperiencia = async (id) => {

    try {
        let sql = `delete from nivel_experiencia where id = ${id}`

        let rsNivelExperiencia = await prisma.$queryRawUnsafe(sql)

        return rsNivelExperiencia

    } catch (error) {
        return false
    }

}





module.exports = {
    insertNivelExperiencia,
    selectId,
    selectAllNivelExperiencia,
    selectByIdNivelExperiencia,
    updateNivelExperiencia,
    deleteNivelExperiencia,
}