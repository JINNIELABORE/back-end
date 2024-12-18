// Import da biblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

// Instanciando a classe PrismaClient
const prisma = new PrismaClient()

const insertDescricaoPerfil = async (dadosDescricaoPerfil) => {
    try {
        // Verifica se a descrição e pelo menos um dos IDs (cliente ou freelancer) estão presentes
        if (!dadosDescricaoPerfil.descricao || 
            (!dadosDescricaoPerfil.id_cliente && !dadosDescricaoPerfil.id_freelancer)) {
            throw new Error("É necessário fornecer a descrição e pelo menos um id_cliente ou id_freelancer.")
        }

        let sql = `insert into descricao_perfil (
                                                     descricao, 
                                                     id_cliente, 
                                                     id_freelancer
                                                     ) values (
                                                               '${dadosDescricaoPerfil.descricao}', 
                                                               ${dadosDescricaoPerfil.id_cliente ? `'${dadosDescricaoPerfil.id_cliente}'` : null}, 
                                                               ${dadosDescricaoPerfil.id_freelancer ? `'${dadosDescricaoPerfil.id_freelancer}'` : null}
                                                               )`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result
    } catch (error) {
        console.error("Erro ao inserir nova descrição de perfil:", error)
        return false
    }
}

const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL) as id FROM descricao_perfil order by id desc limit 1'
        
        let rsDescricaoPerfil = await prisma.$queryRawUnsafe(sql)

        if (rsDescricaoPerfil.length > 0) {
            return rsDescricaoPerfil[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateDescricaoPerfil = async (idDescricaoPerfil, dadosDescricaoPerfil) => {
    try {
        // Verifica se a descrição e pelo menos um dos IDs (cliente ou freelancer) está presente
        if (!dadosDescricaoPerfil.descricao || 
            (!dadosDescricaoPerfil.id_cliente && !dadosDescricaoPerfil.id_freelancer)) {
            throw new Error("É necessário fornecer a descrição e pelo menos um id_cliente ou id_freelancer.")
        }

        let sql = `update descricao_perfil set 
                                        descricao = '${dadosDescricaoPerfil.descricao}', 
                                        id_cliente = ${dadosDescricaoPerfil.id_cliente ? `'${dadosDescricaoPerfil.id_cliente}'` : null}, 
                                        id_freelancer = ${dadosDescricaoPerfil.id_freelancer ? `'${dadosDescricaoPerfil.id_freelancer}'` : null}
                                        where id = ${idDescricaoPerfil}`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result
    } catch (error) {
        console.error("Erro ao atualizar a descrição de perfil:", error)
        return false
    }
}

const deleteDescricaoPerfil = async (id) => {

    try {

        let sql = `delete from descricao_perfil where id = ${id}`

        let rsDescricaoPerfil = await prisma.$queryRawUnsafe(sql)

        return rsDescricaoPerfil

    } catch (error) {
        return false
    }
}

const selectByIdDescricaoPerfil = async (idDescricaoPerfil) => {
    try {
        let sql = `SELECT * FROM descricao_perfil WHERE id = ${idDescricaoPerfil}`
        
        let rsDescricaoPerfil = await prisma.$queryRawUnsafe(sql)

        return rsDescricaoPerfil

    } catch (error) {
        return false
    }
}

const selectAllDescricaoPerfis = async () => {

    try {

        let sql = 'select * from descricao_perfil'
        
        let rsDescricaoPerfil = await prisma.$queryRawUnsafe(sql)

        return rsDescricaoPerfil

    } catch (error) {
        return false
    }
}


module.exports = {
    insertDescricaoPerfil,
    selectId,
    updateDescricaoPerfil,
    deleteDescricaoPerfil,
    selectAllDescricaoPerfis,
    selectByIdDescricaoPerfil
}
