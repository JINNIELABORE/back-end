// Import da biblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

// Instanciando a classe PrismaClient
const prisma = new PrismaClient()

const insertCategoriaProjeto = async (dadosCategoriaProjeto) => {
    try {
        let sql = `insert into categoria_publicacao_projetos (
                                                     id_projeto, 
                                                     id_categoria
                                                     ) values (
                                                               '${dadosCategoriaProjeto.id_projeto}', 
                                                               '${dadosCategoriaProjeto.id_categoria}'
                                                               )`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result
    } catch (error) {
        console.error("Erro ao inserir nova categoria projeto:", error)
        return false
    }
}

const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL) as id FROM categoria_publicacao_projetos order by id desc limit 1'
        
        let rsCategoriaProjetos = await prisma.$queryRawUnsafe(sql)

        if (rsCategoriaProjetos.length > 0) {
            return rsCategoriaProjetos[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateCategoriaProjeto = async (idCategoriaProjeto, dadosCategoriaProjeto) => {

    let sql

    try {
            sql = `update categoria_publicacao_projetos set 
                                                    id_projeto = '${dadosCategoriaProjeto.id_projeto}', 
                                                    id_categoria = '${dadosCategoriaProjeto.id_categoria}'
                                                    where id = ${idCategoriaProjeto}`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {
        return false
    }
}

const deleteCategoriaProjeto = async (id) => {

    try {

        let sql = `delete from categoria_publicacao_projetos where id = ${id}`

        let rsCategoriaProjetos = await prisma.$queryRawUnsafe(sql)

        return rsCategoriaProjetos

    } catch (error) {
        return false
    }
}

const selectByIdCategoriaProjeto = async (idCategoriaProjeto) => {
    try {
        let sql = `SELECT * FROM categoria_publicacao_projetos WHERE id = ${idCategoriaProjeto}`
        
        let rsCategoriaProjetos = await prisma.$queryRawUnsafe(sql)

        return rsCategoriaProjetos

    } catch (error) {
        return false
    }
}

const selectAllCategoriaProjetos = async () => {

    try {

        let sql = 'select * from categoria_publicacao_projetos'
        
        let rsCategoriaProjetos = await prisma.$queryRawUnsafe(sql)

        return rsCategoriaProjetos

    } catch (error) {
        return false
    }
}


module.exports = {
    insertCategoriaProjeto,
    selectId,
    updateCategoriaProjeto,
    deleteCategoriaProjeto,
    selectAllCategoriaProjetos,
    selectByIdCategoriaProjeto
}