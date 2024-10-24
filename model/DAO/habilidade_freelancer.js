// Import da biblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

// Instanciando a classe PrismaClient
const prisma = new PrismaClient()

const insertHabilidadeFreelancer = async (dadosHabilidadeFreelancer) => {
    try {
        let sql = `insert into freelancer_habilidade (
                                                    id_freelancer, 
                                                    id_habilidade
                                                    ) values (
                                                              '${dadosHabilidadeFreelancer.id_freelancer}', 
                                                              '${dadosHabilidadeFreelancer.id_habilidade}'
                                                              )`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result
    } catch (error) {
        return false
    }
}

const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL) as id FROM freelancer_habilidade order by id desc limit 1'
        
        let rsHabilidadeFreelancer = await prisma.$queryRawUnsafe(sql)

        if (rsHabilidadeFreelancer.length > 0) {
            return rsHabilidadeFreelancer[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateHabilidadeFreelancer = async (idHabilidadeFreelancer, dadosHabilidadeFreelancer) => {

    let sql

    try {
            sql = `update freelancer_habilidade set 
                                                    id_freelancer = '${dadosHabilidadeFreelancer.id_freelancer}', 
                                                    id_habilidade = '${dadosHabilidadeFreelancer.id_habilidade}'
                                                    where id = ${idHabilidadeFreelancer}`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {
        return false
    }
}

const deleteHabilidadeFreelancer = async (id) => {

    try {

        let sql = `delete from freelancer_habilidade where id = ${id}`

        let rsHabilidadeFreelancer = await prisma.$queryRawUnsafe(sql)

        return rsHabilidadeFreelancer

    } catch (error) {
        return false
    }
}

const selectByIdHabilidadeFreelancer = async (idHabilidadeFreelancer) => {
    try {
        let sql = `SELECT * FROM freelancer_habilidade WHERE id = ${idHabilidadeFreelancer}`
        
        let rsHabilidadeFreelancer = await prisma.$queryRawUnsafe(sql)

        return rsHabilidadeFreelancer

    } catch (error) {
        return false
    }
}

const selectAllHabilidadesFreelancer = async () => {

    try {

        let sql = 'select * from freelancer_habilidade'
        
        let rsHabilidadeFreelancer = await prisma.$queryRawUnsafe(sql)

        return rsHabilidadeFreelancer

    } catch (error) {
        return false
    }
}


module.exports = {
    insertHabilidadeFreelancer,
    selectId,
    updateHabilidadeFreelancer,
    deleteHabilidadeFreelancer,
    selectAllHabilidadesFreelancer,
    selectByIdHabilidadeFreelancer
}