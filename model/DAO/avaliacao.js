//Import da bibiblioteca do prisma client 
const { PrismaClient } = require('@prisma/client')

//Instanciando a classe PrismaClient
const prisma = new PrismaClient()

//Função para inserir um Avaliacao no Banco de Dados
const insertAvaliacao = async (dadosAvaliacao) => {

    try {
        let sql

        sql = `insert into avaliacao (estrelas, 
                                            comentario
                                            ) values(
                                            '${dadosAvaliacao.estrelas}',
                                             '${dadosAvaliacao.comentario}'                                         
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
        let sql = 'select CAST(id as DECIMAL)as id from avaliacao order by id desc limit 1'

        let rsAvaliacoes = await prisma.$queryRawUnsafe(sql)

        if (rsAvaliacoes) {
            return rsAvaliacoes[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const selectAllAvaliacoes = async () => {
    try {
        let sql = 'select * from avaliacao'

        let rsAvaliacoes = await prisma.$queryRawUnsafe(sql)

        return rsAvaliacoes

    } catch (error) {

        return false

    }
}

const selectByIdAvaliacao = async (id) => {
    try {

        let sql = `SELECT * FROM avaliacao WHERE id = ${id}`

        let rsAvaliacao = await prisma.$queryRawUnsafe(sql)

        return rsAvaliacao

    } catch (error) {
        return false
    }
}

const updateAvaliacao = async (idAvaliacaoUsuario, dadosAvaliacaoUsuario) => {

    let sql

    try {
        sql = `update avaliacao_usuario set id = '${dadosAvaliacaoUsuario.id_avaliacao}',
                                                 '${dadosAvaliacaoUsuario.id_avaliador}',
                                                 '${dadosAvaliacaoUsuario.tipo_avaliador}',
                                                 '${dadosAvaliacaoUsuario.id_avaliado}',
                                                 '${dadosAvaliacaoUsuario.tipo_avaliado}' where id = ${idAvaliacaoUsuario}`

                                                    
        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {

        return false
    }

}
const deleteAvaliacao = async (id) => {
    try {
        let sql = `DELETE FROM avaliacao WHERE id = ${id}`;
        await prisma.$queryRawUnsafe(sql);
        return true;
    } catch (error) {
        console.error('Erro ao excluir avaliação:', error);
        return false;
    }
};


const selectAllAvaliacoesComUsuarios = async () => {
    try {
        let sql = `
            SELECT 
                a.id,
                a.estrelas,
                a.comentario,
                au.id_avaliador,
                au.tipo_avaliador,
                au.id_avaliado,
                au.tipo_avaliado,
                fp.foto_perfil AS foto_perfil_avaliador
            FROM 
                avaliacao a
            JOIN 
                avaliacao_usuario au ON a.id = au.id_avaliacao
            LEFT JOIN 
                foto_perfil fp ON 
                    (au.tipo_avaliador = 'cliente' AND fp.id_cliente = au.id_avaliador) OR 
                    (au.tipo_avaliador = 'freelancer' AND fp.id_freelancer = au.id_avaliador);
        `;

        let rsAvaliacoes = await prisma.$queryRawUnsafe(sql);
        return rsAvaliacoes;

    } catch (error) {
        console.error('Database Error:', error);
        return false;
    }
}


const selectByIdAvaliacaoComUsuarios = async (idAvaliacao) => {
    try {
        let sql = `
            SELECT a.*, au.id_avaliador, au.tipo_avaliador, au.id_avaliado, au.tipo_avaliado
            FROM avaliacao a
            JOIN avaliacao_usuario au ON a.id = au.id_avaliacao
            WHERE a.id = ?
        `

        let rsAvaliacao = await prisma.$queryRawUnsafe(sql, idAvaliacao)

        return rsAvaliacao

    } catch (error) {
        console.error('Database Error:', error)
        return false
    }
}


module.exports = {
    insertAvaliacao,
    selectId,
    selectAllAvaliacoes,
    selectByIdAvaliacao,
    updateAvaliacao,
    deleteAvaliacao,
    selectAllAvaliacoesComUsuarios,
    selectByIdAvaliacaoComUsuarios
}