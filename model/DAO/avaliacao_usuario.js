const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const insertAvaliacaoUsuario = async (dadosAvaliacaoUsuario) => {

    try {
        let sql

        sql = `insert into avaliacao_usuario(id_avaliacao, id_avaliador, tipo_avaliador, id_avaliado, tipo_avaliado) 
                                                                                                                    values(
                                                                                                                        '${dadosAvaliacaoUsuario.id_avaliacao}',
                                                                                                                        '${dadosAvaliacaoUsuario.id_avaliador}',
                                                                                                                        '${dadosAvaliacaoUsuario.tipo_avaliador}',
                                                                                                                        '${dadosAvaliacaoUsuario.id_avaliado}',
                                                                                                                        '${dadosAvaliacaoUsuario.tipo_avaliado}'
                                                                                                                        )`

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
        let sql = 'select CAST(id as DECIMAL)as id from avaliacao_usuario order by id desc limit 1'

        let rsAvaliacaoUsuario = await prisma.$queryRawUnsafe(sql)

        if (rsAvaliacaoUsuario) {
            return rsAvaliacaoUsuario[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateAvaliacaoUsuario = async (idAvaliacaoUsuario, dadosAvaliacaoUsuario) => {

    let sql

    try {
        sql = `update avaliacao_usuario set id = '${dadosAvaliacaoUsuario.id_avaliacao}',
                                                 '${dadosAvaliacaoUsuario.id_avaliador}',
                                                 '${dadosAvaliacaoUsuario.tipo_avaliador}',
                                                 '${dadosAvaliacaoUsuario.id_avaliado}',
                                                 '${dadosAvaliacaoUsuario.tipo_avaliado}' where id = ${idAvaliacaoUsuario}`

                                                    
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {

        return false
    }

}

const deleteAvaliacaoUsuario = async (id) => {

    try {
        let sql = `delete from avaliacao_usuario where id = ${id}`

        let rsAvaliacaoUsuario = await prisma.$queryRawUnsafe(sql)

        return rsAvaliacaoUsuario

    } catch (error) {
        return false
    }

}

const selectByIdAvaliacaoUsuario = async (id) => {

    try {
        let sql = `select * from avaliacao_usuario where id = ${id}`

        let rsAvaliacaoUsuario = await prisma.$queryRawUnsafe(sql)

        return rsAvaliacaoUsuario

    } catch (error) {
        return false
    }


}

const selectAllavaliacaoUsuario = async () => {

    try {
        let sql = 'select * from avaliacao_usuario'

        let rsavaliacaoUsuario = await prisma.$queryRawUnsafe(sql)

        return rsavaliacaoUsuario

    } catch (error) {

        return false

    }

}

module.exports = {
    insertAvaliacaoUsuario,
    selectId,
    updateAvaliacaoUsuario,
    deleteAvaliacaoUsuario,
    selectAllavaliacaoUsuario,
    selectByIdAvaliacaoUsuario
}