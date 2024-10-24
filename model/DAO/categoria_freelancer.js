// Import da biblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

// Instanciando a classe PrismaClient
const prisma = new PrismaClient()

const insertCategoriaFreelancer = async (dadosCategoriaFreelancer) => {
    try {
        let sql = `insert into freelancer_categoria (
                                                     id_freelancer, 
                                                     id_categoria
                                                     ) values (
                                                               '${dadosCategoriaFreelancer.id_freelancer}', 
                                                               '${dadosCategoriaFreelancer.id_categoria}'
                                                               )`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result
    } catch (error) {
        console.error("Erro ao inserir nova categoria freelancer:", error)
        return false
    }
}

const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL) as id FROM freelancer_categoria order by id desc limit 1'
        
        let rsCategoriaFreelancers = await prisma.$queryRawUnsafe(sql)

        if (rsCategoriaFreelancers.length > 0) {
            return rsCategoriaFreelancers[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateCategoriaFreelancer = async (idCategoriaFreelancer, dadosCategoriaFreelancer) => {

    let sql

    try {
            sql = `update freelancer_categoria set 
                                                    id_freelancer = '${dadosCategoriaFreelancer.id_freelancer}', 
                                                    id_categoria = '${dadosCategoriaFreelancer.id_categoria}'
                                                    where id = ${idCategoriaFreelancer}`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {
        return false
    }
}

const deleteCategoriaFreelancer = async (id) => {

    try {

        let sql = `delete from freelancer_categoria where id = ${id}`

        let rsCategoriaFreelancers = await prisma.$queryRawUnsafe(sql)

        return rsCategoriaFreelancers

    } catch (error) {
        return false
    }
}

const selectByIdCategoriaFreelancer = async (idCategoriaFreelancer) => {
    try {
        let sql = `SELECT * FROM freelancer_categoria WHERE id = ${idCategoriaFreelancer}`
        
        let rsCategoriaFreelancers = await prisma.$queryRawUnsafe(sql)

        return rsCategoriaFreelancers

    } catch (error) {
        return false
    }
}

const selectAllCategoriasFreelancer = async () => {

    try {

        let sql = 'select * from freelancer_categoria'
        
        let rsCategoriaFreelancers = await prisma.$queryRawUnsafe(sql)

        return rsCategoriaFreelancers

    } catch (error) {
        return false
    }
}


module.exports = {
    insertCategoriaFreelancer,
    selectId,
    updateCategoriaFreelancer,
    deleteCategoriaFreelancer,
    selectAllCategoriasFreelancer,
    selectByIdCategoriaFreelancer
}