const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const insertDisputa = async (dadosDisputa) => {

    try {
        let sql

        sql = `insert into disputa (id_denuncia, id_denunciante, tipo_denunciante, id_denunciado, tipo_denunciado) 
                                                                                                                    values(
                                                                                                                        '${dadosDisputa.id_denuncia}',
                                                                                                                        '${dadosDisputa.id_denunciante}',
                                                                                                                        '${dadosDisputa.tipo_denunciante}',
                                                                                                                        '${dadosDisputa.id_denunciado}',
                                                                                                                        '${dadosDisputa.tipo_denunciado}'
                                                                                                                        )`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false

        //Cria a variável SQL

    } catch (error) {
        console.log(error)
        return false
    }

}

const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL)as id from disputa order by id desc limit 1'

        let rsDisputa = await prisma.$queryRawUnsafe(sql)

        if (rsDisputa) {
            return rsDisputa[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateDisputa = async (idDisputa, dadosDisputa) => {

    let sql

    try {
        sql = `UPDATE disputa SET 
                                        id_denuncia = '${dadosDisputa.id_denuncia}',
                                        id_denunciante = '${dadosDisputa.id_denunciante}',
                                        tipo_denunciante = '${dadosDisputa.tipo_denunciante}',
                                        id_denunciado = '${dadosDisputa.id_denunciado}',
                                        tipo_denunciado = '${dadosDisputa.tipo_denunciado}'
            WHERE id = ${idDisputa}`

                                                    
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {

        return false
    }

}

const deleteDisputa = async (id) => {
    try {
        let sql = `DELETE FROM disputa WHERE id_denuncia = ${id}` 
        await prisma.$queryRawUnsafe(sql)
        return true
    } catch (error) {
        console.error('Erro ao excluir denuncia do usuário:', error)
        return false
    }
}




const selectByIdDisputa = async (id) => {

    try {
        let sql = `select * from disputa where id = ${id}`

        let rsDisputa = await prisma.$queryRawUnsafe(sql)

        return rsDisputa

    } catch (error) {
        return false
    }


}

const selectAllDisputa = async () => {

    try {
        let sql = 'select * from disputa'

        let rsDisputa = await prisma.$queryRawUnsafe(sql)

        return rsDisputa

    } catch (error) {

        return false

    }

}

module.exports = {
    insertDisputa,
    selectId,
    updateDisputa,
    deleteDisputa,
    selectAllDisputa,
    selectByIdDisputa
}