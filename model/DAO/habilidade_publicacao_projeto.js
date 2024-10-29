// Import da biblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

// Instanciando a classe PrismaClient
const prisma = new PrismaClient()

const insertHabilidadeProjeto = async (dadosHabilidadeProjeto) => {
    try {
        let sql = `insert into habilidade_publicacao_projetos (
                                                     id_projeto, 
                                                     id_habilidade
                                                     ) values (
                                                               '${dadosHabilidadeProjeto.id_projeto}', 
                                                               '${dadosHabilidadeProjeto.id_habilidade}'
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
        let sql = 'select CAST(id as DECIMAL) as id FROM habilidade_publicacao_projetos order by id desc limit 1'
        
        let rsHabilidadeProjetos = await prisma.$queryRawUnsafe(sql)

        if (rsHabilidadeProjetos.length > 0) {
            return rsHabilidadeProjetos[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateHabilidadeProjeto = async (idHabilidadeProjeto, dadosHabilidadeProjeto) => {

    let sql

    try {
            sql = `update habilidade_publicacao_projetos set 
                                                    id_projeto = '${dadosHabilidadeProjeto.id_projeto}', 
                                                    id_habilidade = '${dadosHabilidadeProjeto.id_habilidade}'
                                                    where id = ${idHabilidadeProjeto}`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {
        return false
    }
}

const deleteHabilidadeProjeto = async (id) => {

    try {

        let sql = `delete from habilidade_publicacao_projetos where id = ${id}`

        let rsHabilidadeProjetos = await prisma.$queryRawUnsafe(sql)

        return rsHabilidadeProjetos

    } catch (error) {
        return false
    }
}

const selectByIdHabilidadeProjeto = async (idHabilidadeProjeto) => {
    try {
        let sql = `SELECT * FROM habilidade_publicacao_projetos WHERE id = ${idHabilidadeProjeto}`
        
        let rsHabilidadeProjetos = await prisma.$queryRawUnsafe(sql)

        return rsHabilidadeProjetos

    } catch (error) {
        return false
    }
}

const selectAllHabilidadeProjetos = async () => {

    try {

        let sql = 'select * from habilidade_publicacao_projetos'
        
        let rsHabilidadeProjetos = await prisma.$queryRawUnsafe(sql)

        return rsHabilidadeProjetos

    } catch (error) {
        return false
    }
}


module.exports = {
    insertHabilidadeProjeto,
    selectId,
    updateHabilidadeProjeto,
    deleteHabilidadeProjeto,
    selectAllHabilidadeProjetos,
    selectByIdHabilidadeProjeto
}
