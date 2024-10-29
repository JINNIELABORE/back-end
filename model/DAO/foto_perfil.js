// Import da biblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

// Instanciando a classe PrismaClient
const prisma = new PrismaClient()

const insertFotoPerfil = async (dadosFotoPerfil) => {
    try {
        // Verifica se pelo menos um dos IDs (cliente ou freelancer) está presente
        if (!dadosFotoPerfil.id_cliente && !dadosFotoPerfil.id_freelancer) {
            throw new Error("É necessário fornecer o id_cliente ou o id_freelancer.")
        }

        let sql = `insert into foto_perfil (
                                                      foto_perfil, 
                                                      id_cliente, 
                                                      id_freelancer
                                                      ) values (
                                                                '${dadosFotoPerfil.foto_perfil}', 
                                                                ${dadosFotoPerfil.id_cliente ? `'${dadosFotoPerfil.id_cliente}'` : null}, 
                                                                ${dadosFotoPerfil.id_freelancer ? `'${dadosFotoPerfil.id_freelancer}'` : null}
                                                                )`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result
    } catch (error) {
        console.error("Erro ao inserir nova foto de perfil:", error)
        return false
    }
}

const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL) as id FROM foto_perfil order by id desc limit 1'
        
        let rsFotoPerfil = await prisma.$queryRawUnsafe(sql)

        if (rsFotoPerfil.length > 0) {
            return rsFotoPerfil[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateFotoPerfil = async (idFotoPerfil, dadosFotoPerfil) => {
    try {
        // Verifica se a foto ou pelo menos um dos IDs (cliente ou freelancer) está presente
        if (!dadosFotoPerfil.foto_perfil || 
            (!dadosFotoPerfil.id_cliente && !dadosFotoPerfil.id_freelancer)) {
            throw new Error("É necessário fornecer a foto e pelo menos um id_cliente ou id_freelancer.")
        }

        let sql = `update foto_perfil set 
                                         foto_perfil = '${dadosFotoPerfil.foto_perfil}', 
                                         id_cliente = ${dadosFotoPerfil.id_cliente ? `'${dadosFotoPerfil.id_cliente}'` : null}, 
                                         id_freelancer = ${dadosFotoPerfil.id_freelancer ? `'${dadosFotoPerfil.id_freelancer}'` : null}
                                         where id = ${idFotoPerfil}`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result
    } catch (error) {
        console.error("Erro ao atualizar a foto de perfil:", error)
        return false
    }
}

const deleteFotoPerfil = async (id) => {
    try {
        let sql = `delete from foto_perfil where id = ${id}`
        let rsFotoPerfil = await prisma.$queryRawUnsafe(sql)
        return rsFotoPerfil
    } catch (error) {
        return false
    }
}

const selectByIdFotoPerfil = async (idFotoPerfil) => {
    try {
        let sql = `SELECT * FROM foto_perfil WHERE id = ${idFotoPerfil}`
        
        let rsFotoPerfil = await prisma.$queryRawUnsafe(sql)
        return rsFotoPerfil
    } catch (error) {
        return false
    }
}

const selectAllFotoPerfis = async () => {
    try {
        let sql = 'select * from foto_perfil'
        
        let rsFotoPerfil = await prisma.$queryRawUnsafe(sql)
        return rsFotoPerfil
    } catch (error) {
        return false
    }
}

module.exports = {
    insertFotoPerfil,
    selectId,
    updateFotoPerfil,
    deleteFotoPerfil,
    selectAllFotoPerfis,
    selectByIdFotoPerfil
}
