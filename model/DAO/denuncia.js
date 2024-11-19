const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const insertDenuncia = async (dadosDenuncia) => {
    try {
        let sql

        sql = `insert into denuncia (arquivo, 
                                            descricao
                                            ) values(
                                            '${dadosDenuncia.arquivo}',
                                             '${dadosDenuncia.descricao}'                                         
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
        let sql = 'select CAST(id as DECIMAL) as id from denuncia order by id desc limit 1'

        let rsDenuncias = await prisma.$queryRawUnsafe(sql)

        if (rsDenuncias) {
            return rsDenuncias[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectAllDenuncias = async () => {
    try {
        let sql = 'select * from denuncia'

        let rsDenuncias = await prisma.$queryRawUnsafe(sql)

        return rsDenuncias

    } catch (error) {

        return false

    }
}

const selectByIdDenuncia = async (id) => {
    try {

        let sql = `SELECT * FROM denuncia WHERE id = ${id}`

        let rsDenuncia = await prisma.$queryRawUnsafe(sql)

        return rsDenuncia

    } catch (error) {
        return false
    }
}

const updateDenuncia = async (id, dadosDenuncia) => {
    try {
        let sql = `UPDATE denuncia SET 
                        arquivo = '${dadosDenuncia.arquivo}', 
                        descricao = '${dadosDenuncia.descricao}' 
                    WHERE id = ${id}`

        console.log('SQL para atualização:', sql)

        let result = await prisma.$executeRawUnsafe(sql)

        if (result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error('Erro ao atualizar denúncia:', error)
        return false
    }
}

const deleteDenuncia = async (id) => {
    try {
        let sql = `DELETE FROM denuncia WHERE id = ${id}`
        await prisma.$queryRawUnsafe(sql)
        return true
    } catch (error) {
        console.error('Erro ao excluir denúncia:', error)
        return false
    }
}

const selectAllDenunciasComUsuarios = async () => {
    try {
        let sql = `
        select * from denuncia
        `

        let rsDenuncias = await prisma.$queryRawUnsafe(sql)
        return rsDenuncias

    } catch (error) {
        console.error('Database Error:', error)
        return false
    }
}

const selectByIdDenunciaComUsuarios = async (idDenuncia) => {
    try {
        let sql = `
            SELECT a.*, au.id_avaliador, au.tipo_avaliador, au.id_avaliado, au.tipo_avaliado
            FROM denuncia a
            JOIN denuncia_usuario au ON a.id = au.id_denuncia
            WHERE a.id = ?
        `

        let rsDenuncia = await prisma.$queryRawUnsafe(sql, idDenuncia)

        return rsDenuncia

    } catch (error) {
        console.error('Database Error:', error)
        return false
    }
}

module.exports = {
    insertDenuncia,
    selectId,
    selectAllDenuncias,
    selectByIdDenuncia,
    updateDenuncia,
    deleteDenuncia,
    selectAllDenunciasComUsuarios,
    selectByIdDenunciaComUsuarios
}
