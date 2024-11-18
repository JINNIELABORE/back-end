// Import da biblioteca do prisma client
const { PrismaClient } = require('@prisma/client')

// Instanciando a classe PrismaClient
const prisma = new PrismaClient()

// Função para inserir um novo registro na tabela freelancer_projeto
const insertFreelancerProjeto = async (dadosFreelancerProjeto) => {
    try {
        let sql = `insert into freelancer_projeto (
                                                    id_projeto, 
                                                    id_freelancer,
                                                    status
                                                    ) values (
                                                    '${dadosFreelancerProjeto.id_projeto}', 
                                                    '${dadosFreelancerProjeto.id_freelancer}',
                                                    '${dadosFreelancerProjeto.status}'
                                                    )`
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result
    } catch (error) {
        console.error("Erro ao inserir novo freelancer projeto:", error)
        return false
    }
}

// Função para selecionar o ID do último registro inserido
const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL) as id FROM freelancer_projeto order by id desc limit 1'
        
        let rsFreelancerProjetos = await prisma.$queryRawUnsafe(sql)

        if (rsFreelancerProjetos.length > 0) {
            return rsFreelancerProjetos[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

// Função para atualizar o status de um projeto de freelancer
const updateFreelancerProjeto = async (idFreelancerProjeto, dadosFreelancerProjeto) => {
    let sql

    try {
        sql = `update freelancer_projeto set 
                                                id_projeto = '${dadosFreelancerProjeto.id_projeto}', 
                                                id_freelancer = '${dadosFreelancerProjeto.id_freelancer}',
                                                status = '${dadosFreelancerProjeto.status}'
                                                where id = ${idFreelancerProjeto}`

        let result = await prisma.$executeRawUnsafe(sql)
        
        return result
    } catch (error) {
        return false
    }
}

// Função para deletar um freelancer de um projeto específico
const deleteFreelancerProjeto = async (id) => {
    try {
        let sql = `delete from freelancer_projeto where id = ${id}`

        let rsFreelancerProjetos = await prisma.$queryRawUnsafe(sql)

        return rsFreelancerProjetos
    } catch (error) {
        return false
    }
}

// Função para buscar um freelancer_projeto pelo seu ID
const selectByIdFreelancerProjeto = async (idFreelancerProjeto) => {
    try {
        let sql = `SELECT * FROM freelancer_projeto WHERE id = ${idFreelancerProjeto}`
        
        let rsFreelancerProjetos = await prisma.$queryRawUnsafe(sql)

        return rsFreelancerProjetos
    } catch (error) {
        return false
    }
}

// Função para buscar todos os freelancer_projetos
const selectAllFreelancerProjetos = async () => {
    try {
        let sql = 'select * from freelancer_projeto'
        
        let rsFreelancerProjetos = await prisma.$queryRawUnsafe(sql)

        return rsFreelancerProjetos
    } catch (error) {
        return false
    }
}

// Função para buscar freelancers de um projeto específico
const getFreelancersPorProjeto = async (idProjeto) => {
    try {
        let sql = `
            SELECT f.nome_freelancer
            FROM freelancer_projeto fp
            INNER JOIN cadastro_freelancer f ON f.id = fp.id_freelancer
            WHERE fp.id_projeto = ${idProjeto}
        `
        let result = await prisma.$queryRawUnsafe(sql)
        return result.map(item => item.nome_freelancer) // Retorna uma lista com os nomes dos freelancers
    } catch (error) {
        console.error("Erro ao buscar freelancers do projeto:", error)
        return false
    }
}

// Função para buscar todos os projetos em que um freelancer está envolvido
const getProjetosPorFreelancer = async (idFreelancer) => {
    try {
        let sql = `
            SELECT p.titulo_projeto
            FROM freelancer_projeto fp
            INNER JOIN publicacao_projetos p ON p.id = fp.id_projeto
            WHERE fp.id_freelancer = ${idFreelancer}
        `
        let result = await prisma.$queryRawUnsafe(sql)
        return result.map(item => item.titulo_projeto) // Retorna uma lista com os títulos dos projetos
    } catch (error) {
        console.error("Erro ao buscar projetos do freelancer:", error)
        return false
    }
}

module.exports = {
    insertFreelancerProjeto,
    selectId,
    updateFreelancerProjeto,
    deleteFreelancerProjeto,
    selectAllFreelancerProjetos,
    selectByIdFreelancerProjeto,
    getFreelancersPorProjeto,
    getProjetosPorFreelancer
}
