/**********************************************************************************************************
 * Objetivo: Arquivo responsável por realizar CRUD no Banco de Dados MySQL de clientes                    *
 * Data: 03/09/2024                                                                                       *
 * Autor: Gustavo Henrique e Matheus Zanoni                                                               *
 * 1.0                                                                                                    *
 *********************************************************************************************************/

//Import da bibiblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

//Instanciando a classe PrismaClient
const prisma = new PrismaClient()

//Função para inserir um cliente no Banco de Dados
const insertCliente = async (dadosCliente) => {

    try {
        let sql

        sql = `insert into cadastro_cliente(nome_cliente, 
                                            cnpj_cliente,
                                            email_cliente,
                                            senha_cliente
                                            ) values(
                                            '${dadosCliente.nome_cliente}',
                                             ${dadosCliente.cnpj_cliente},
                                            '${dadosCliente.email_cliente}',
                                            '${dadosCliente.senha_cliente}'                                            
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
        let sql = 'select CAST(id as DECIMAL)as id from cadastro_cliente order by id desc limit 1'

        let rsClientes = await prisma.$queryRawUnsafe(sql)

        if (rsClientes) {
            return rsClientes[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectAllClientes = async () => {
    try {
        let sql = `
                SELECT f.*, 
                    a.id AS id_avaliacao, 
                    a.estrelas, 
                    a.comentario, 
                    au.id_avaliador, 
                    au.tipo_avaliador, 
                    au.id_avaliado, 
                    au.tipo_avaliado,
                    f_avaliador.nome_freelancer AS nome_avaliador,
                    fp.foto_perfil,
                    d.descricao AS descricao_cliente,
                    p.id AS id_projeto,
                    p.nome_projeto,
                    p.descricao_projeto,
                    p.orcamento,
                    p.id_nivel_experiencia,
                    ne.nivel_experiencia AS nome_experiencia,
                    p.id_cliente AS id_cliente_projeto,
                    pf.id_freelancer, -- Adicionando id_freelancer da tabela de relacionamento (exemplo)
                    f_rel.nome_freelancer -- Nome do freelancer relacionado ao projeto
                FROM cadastro_cliente f
                LEFT JOIN avaliacao_usuario au ON au.id_avaliado = f.id AND au.tipo_avaliado = 'cliente'
                LEFT JOIN avaliacao a ON a.id = au.id_avaliacao
                LEFT JOIN cadastro_freelancer f_avaliador ON f_avaliador.id = au.id_avaliador
                LEFT JOIN foto_perfil fp ON fp.id_cliente = f.id
                LEFT JOIN descricao_perfil d ON d.id_cliente = f.id
                LEFT JOIN publicacao_projetos p ON p.id_cliente = f.id
                LEFT JOIN nivel_experiencia ne ON ne.id = p.id_nivel_experiencia
                LEFT JOIN freelancer_projeto pf ON pf.id_projeto = p.id -- Supondo que esta seja a tabela de relacionamento entre projeto e freelancer
                LEFT JOIN cadastro_freelancer f_rel ON f_rel.id = pf.id_freelancer -- Associando o freelancer ao projeto
        `

        let rsClientes = await prisma.$queryRawUnsafe(sql)

        return rsClientes

    } catch (error) {
        console.error('Database Error:', error)
        return false
    }
}

const selectByIdCliente = async (id) => {
    try {
        let sql = `SELECT f.*, 
                    a.id AS id_avaliacao, 
                    a.estrelas, 
                    a.comentario, 
                    au.id_avaliador, 
                    au.tipo_avaliador, 
                    au.id_avaliado, 
                    au.tipo_avaliado,
                    f_avaliador.nome_freelancer AS nome_avaliador,
                    fp.foto_perfil,
                    d.descricao AS descricao_cliente,
                    p.id AS id_projeto,
                    p.nome_projeto,
                    p.descricao_projeto,
                    p.orcamento,
                    p.id_nivel_experiencia,
                    ne.nivel_experiencia AS nome_experiencia,
                    p.id_cliente AS id_cliente_projeto,
                    pf.id_freelancer, -- Adicionando id_freelancer da tabela de relacionamento
                    f_rel.nome_freelancer -- Nome do freelancer relacionado ao projeto
                FROM cadastro_cliente f
                LEFT JOIN avaliacao_usuario au ON au.id_avaliado = f.id AND au.tipo_avaliado = 'cliente'
                LEFT JOIN avaliacao a ON a.id = au.id_avaliacao
                LEFT JOIN cadastro_freelancer f_avaliador ON f_avaliador.id = au.id_avaliador
                LEFT JOIN foto_perfil fp ON fp.id_cliente = f.id
                LEFT JOIN descricao_perfil d ON d.id_cliente = f.id
                LEFT JOIN publicacao_projetos p ON p.id_cliente = f.id
                LEFT JOIN nivel_experiencia ne ON ne.id = p.id_nivel_experiencia
                LEFT JOIN freelancer_projeto pf ON pf.id_projeto = p.id
                LEFT JOIN cadastro_freelancer f_rel ON f_rel.id = pf.id_freelancer
                WHERE f.id = ${id}`
        
        let rsCliente = await prisma.$queryRawUnsafe(sql)

        return rsCliente
    } catch (error) {
        return false
    }
}


const updateCliente = async (idCliente, dadosCliente) => {

    let sql

    try {
        sql = `update cadastro_cliente set nome_cliente = '${dadosCliente.nome_cliente}', 
                                           cnpj_cliente = '${dadosCliente.cnpj_cliente}',
                                           email_cliente = '${dadosCliente.email_cliente}',
                                           senha_cliente = '${dadosCliente.senha_cliente}' where id = ${idCliente}`

        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {

        return false
    }

}

const deleteCliente = async (id) => {

    try {
        let sql = `delete from cadastro_cliente where id = ${id}`

        let rsCliente = await prisma.$queryRawUnsafe(sql)

        return rsCliente

    } catch (error) {
        return false
    }
}

// Verifica se o CNPJ já existe no banco de dados
const selectByCnpj = async (cnpj_cliente) => {
    try {
        let sql = `SELECT * FROM cadastro_cliente WHERE cnpj_cliente = ${cnpj_cliente}`
        let rsCliente = await prisma.$queryRawUnsafe(sql)

        if (rsCliente.length > 0) {
            return true // CNPJ já cadastrado
        } else {
            return false // CNPJ não cadastrado
        }
    } catch (error) {
        return false
    }
}

// Verifica se o e-mail já existe no banco de dados
const selectByEmail = async (email_cliente) => {
    try {
        let sql = `SELECT * FROM cadastro_cliente WHERE email_cliente = '${email_cliente}'`
        let rsCliente = await prisma.$queryRawUnsafe(sql)

        if (rsCliente.length > 0) {
            return true // E-mail já cadastrado
        } else {
            return false // E-mail não cadastrado
        }
    } catch (error) {
        return false
    }
}

const getClienteByEmail = async (email_cliente) => {
    try {
        let sql = `SELECT email_cliente, senha_cliente FROM cadastro_cliente WHERE email_cliente = '${email_cliente}'`
        let rsCliente = await prisma.$queryRawUnsafe(sql)

        if (rsCliente.length > 0) {
            return rsCliente // Retorna o nome do cliente
        } else {
            return null // E-mail não cadastrado
        }
    } catch (error) {
        console.error(error)
        return null
    }
}
module.exports = {
    insertCliente,
    selectId,
    selectAllClientes,
    selectByIdCliente,
    selectByCnpj,
    selectByEmail,
    updateCliente,
    deleteCliente,
    getClienteByEmail
}