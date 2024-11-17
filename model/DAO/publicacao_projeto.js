const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const insertPublicacaoProjeto = async (dadosPublicacaoProjeto) => {

    try {
        let sql

        sql = `insert into publicacao_projetos (
                                            id_cliente,            
                                            nome_projeto, 
                                            descricao_projeto,
                                            orcamento,
                                            id_nivel_experiencia
                                            ) values(
                                            '${dadosPublicacaoProjeto.id_cliente}',
                                            '${dadosPublicacaoProjeto.nome_projeto}',
                                            '${dadosPublicacaoProjeto.descricao_projeto}',
                                            '${dadosPublicacaoProjeto.orcamento}',
                                            '${dadosPublicacaoProjeto.id_nivel_experiencia}'                                            
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
        let sql = 'select CAST(id as DECIMAL)as id from publicacao_projetos order by id desc limit 1'

        let rsPublicacaoProjetos = await prisma.$queryRawUnsafe(sql)

        if (rsPublicacaoProjetos) {
            return rsPublicacaoProjetos[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectAllPublicacaoProjetos = async () => {
    try {
        let sql = `
            SELECT p.*, 
                   c.nome_cliente, 
                   cat.nome_categoria, 
                   hab.nome_habilidade, 
                   ne.nivel_experiencia  -- Adiciona o nome da experiência
            FROM publicacao_projetos p
            LEFT JOIN categoria_publicacao_projetos cp ON cp.id_projeto = p.id
            LEFT JOIN categorias cat ON cat.id = cp.id_categoria
            LEFT JOIN habilidade_publicacao_projetos hp ON hp.id_projeto = p.id
            LEFT JOIN habilidades hab ON hab.id = hp.id_habilidade
            LEFT JOIN cadastro_cliente c ON c.id = p.id_cliente
            LEFT JOIN nivel_experiencia ne ON ne.id = p.id_nivel_experiencia  -- JOIN para pegar o nome da experiência
        `

        let rsPublicacaoProjetos = await prisma.$queryRawUnsafe(sql)

        return rsPublicacaoProjetos
    } catch (error) {
        console.error("Error fetching publicacao projetos: ", error)
        return false
    }
}


const selectByIdPublicaoProjeto = async (id) => {
    try {

        let sql = `SELECT * FROM publicacao_projetos WHERE id = ${id}`

        let rsPublicacaoProjeto = await prisma.$queryRawUnsafe(sql)

        return rsPublicacaoProjeto

    } catch (error) {
        return false
    }
}

const updatePublicacaoProjeto = async (idPublicacaoProjeto, dadosPublicacaoProjeto) => {

    let sql

    try {
        sql = `update publicacao_projetos set 
                                           id_cliente = '${dadosPublicacaoProjeto.id_cliente}'
                                           nome_projeto = '${dadosPublicacaoProjeto.nome_projeto}', 
                                           descricao_projeto = '${dadosPublicacaoProjeto.descricao_projeto}',
                                           orcamento = '${dadosPublicacaoProjeto.orcamento}',
                                           id_nivel_experiencia = '${dadosPublicacaoProjeto.id_nivel_experiencia}' where id = ${idPublicacaoProjeto}`

        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {

        return false
    }

}

const deletePublicacaoProjeto = async (id) => {

    try {
        let sql = `delete from publicacao_projetos where id = ${id}`

        let rsPublicacaoProjeto = await prisma.$queryRawUnsafe(sql)

        return rsPublicacaoProjeto

    } catch (error) {
        return false
    }

}

module.exports = {
    insertPublicacaoProjeto,
    selectId,
    selectAllPublicacaoProjetos,
    selectByIdPublicaoProjeto,
    updatePublicacaoProjeto,
    deletePublicacaoProjeto
}