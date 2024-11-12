/**********************************************************************************************************
 * Objetivo: Arquivo responsável por realizar CRUD no Banco de Dados MySQL de freelancers                 *
 * Data: 05/09/2024                                                                                       *
 * Autor: Gustavo Henrique e Matheus Zanoni                                                               *
 * 1.0                                                                                                    *
 *********************************************************************************************************/

//Import da bibiblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

//Instanciando a classe PrismaClient
const prisma = new PrismaClient()

//Função para inserir um freelancer no Banco de Dados
const insertFreelancer = async (dadosFreelancer) => {

    try {
        let sql

        sql = `insert into cadastro_freelancer(nome_freelancer,
                                            data_nascimento, 
                                            cpf_freelancer,
                                            email_freelancer,
                                            senha_freelancer
                                            ) values(
                                            '${dadosFreelancer.nome_freelancer}',
                                            '${dadosFreelancer.data_nascimento}',
                                             ${dadosFreelancer.cpf_freelancer},
                                            '${dadosFreelancer.email_freelancer}',
                                            '${dadosFreelancer.senha_freelancer}'                                            
                                            )`

        let result = await prisma.$executeRawUnsafe(sql)

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
        let sql = 'select CAST(id as DECIMAL)as id from cadastro_freelancer order by id desc limit 1'

        let rsFreelancers = await prisma.$queryRawUnsafe(sql)

        if (rsFreelancers) {
            return rsFreelancers[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectAllFreelancers = async () => {
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
                   f_avaliador.nome_cliente AS nome_avaliador,
                   fc.id_categoria,
                   c.nome_categoria,
                   fh.id_habilidade,
                   h.nome_habilidade,
                   fp.foto_perfil
            FROM cadastro_freelancer f
            LEFT JOIN avaliacao_usuario au ON au.id_avaliado = f.id AND au.tipo_avaliado = 'freelancer'
            LEFT JOIN avaliacao a ON a.id = au.id_avaliacao
            LEFT JOIN cadastro_cliente f_avaliador ON f_avaliador.id = au.id_avaliador
            LEFT JOIN freelancer_categoria fc ON fc.id_freelancer = f.id
            LEFT JOIN categorias c ON c.id = fc.id_categoria
            LEFT JOIN freelancer_habilidade fh ON fh.id_freelancer = f.id
            LEFT JOIN habilidades h ON h.id = fh.id_habilidade
            LEFT JOIN foto_perfil fp ON fp.id_freelancer = f.id
        `;

        let rsFreelancers = await prisma.$queryRawUnsafe(sql);

        // Pós-processamento: Agrupar as categorias, habilidades e avaliações
        const freelancers = rsFreelancers.reduce((acc, freelancer) => {
            // Verifica se o freelancer já existe no acumulador
            let f = acc.find(f => f.id === freelancer.id);
            if (!f) {
                f = {
                    ...freelancer,
                    categorias: [],
                    habilidades: [],
                    avaliacao: []
                };
                acc.push(f);
            }

            // Adiciona categorias, habilidades e avaliações sem duplicação
            if (freelancer.nome_categoria && !f.categorias.some(cat => cat.nome_categoria === freelancer.nome_categoria)) {
                f.categorias.push({ id_categoria: freelancer.id_categoria, nome_categoria: freelancer.nome_categoria });
            }

            if (freelancer.nome_habilidade && !f.habilidades.some(hab => hab.nome_habilidade === freelancer.nome_habilidade)) {
                f.habilidades.push({ id_habilidade: freelancer.id_habilidade, nome_habilidade: freelancer.nome_habilidade });
            }

            if (freelancer.id_avaliacao) {
                f.avaliacao.push({
                    id: freelancer.id_avaliacao,
                    estrelas: freelancer.estrelas,
                    comentario: freelancer.comentario,
                    id_avaliador: freelancer.id_avaliador,
                    nome_avaliador: freelancer.nome_avaliador,
                    tipo_avaliador: freelancer.tipo_avaliador
                });
            }

            return acc;
        }, []);

        return freelancers;
    } catch (error) {
        console.error('Database Error:', error);
        return false;
    }
};


const selectByIdFreelancer = async (id) => {
    try {

        let sql = `SELECT * FROM cadastro_freelancer WHERE id = ${id}`

        let rsFreelancer = await prisma.$queryRawUnsafe(sql)

        return rsFreelancer

    } catch (error) {
        return false
    }
}

const updateFreelancer = async (idFreelancer, dadosFreelancer) => {

    let sql

    try {
        sql = `update cadastro_freelancer set nome_freelancer = '${dadosFreelancer.nome_freelancer}', 
                                           data_nascimento = '${dadosFreelancer.data_nascimento}',
                                           cpf_freelancer = '${dadosFreelancer.cpf_freelancer}',
                                           email_freelancer = '${dadosFreelancer.email_freelancer}',
                                           senha_freelancer = '${dadosFreelancer.senha_freelancer}' where id = ${idFreelancer}`

        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {

        return false
    }

}

const deleteFreelancer = async (id) => {

    try {
        let sql = `delete from cadastro_freelancer where id = ${id}`

        let rsFreelancer = await prisma.$queryRawUnsafe(sql)

        return rsFreelancer

    } catch (error) {
        return false
    }

}

// Verifica se o CPF já existe no banco de dados
const selectByCpf = async (cpf_freelancer) => {
    try {
        let sql = `SELECT * FROM cadastro_freelancer WHERE cpf_freelancer = ${cpf_freelancer}`
        let rsFreelancer = await prisma.$queryRawUnsafe(sql)

        if (rsFreelancer.length > 0) {
            return true // CPF já cadastrado
        } else {
            return false // CPF não cadastrado
        }
    } catch (error) {
        return false
    }
}

// Verifica se o e-mail já existe no banco de dados
const selectByEmail = async (email_freelancer) => {
    try {
        let sql = `SELECT * FROM cadastro_freelancer WHERE email_freelancer = '${email_freelancer}'`
        let rsFreelancer = await prisma.$queryRawUnsafe(sql)

        if (rsFreelancer.length > 0) {
            return true // E-mail já cadastrado
        } else {
            return false // E-mail não cadastrado
        }
    } catch (error) {
        return false
    }
}

const getFreelancerByEmail = async (email_freelancer) => {
    try {
        let sql = `SELECT nome_freelancer FROM cadastro_freelancer WHERE email_freelancer = '${email_freelancer}'`
        console.log(sql)
        let rsFreelancer = await prisma.$queryRawUnsafe(sql)
        console.log(rsFreelancer)  

        if (rsFreelancer.length > 0) {
            return rsFreelancer[0].nome_freelancer // Retorna o nome do freelancer
        } else {
            return null // E-mail não cadastrado
        }
    } catch (error) {
        console.error(error)
        return null
    }
}

module.exports = {
    insertFreelancer,
    selectId,
    selectAllFreelancers,
    selectByIdFreelancer,
    updateFreelancer,
    deleteFreelancer,
    selectByCpf,
    selectByEmail,
    getFreelancerByEmail
}