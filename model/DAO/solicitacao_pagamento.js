const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const insertSolicitacaoPagamento = async (dadosPagamento) => {

    try {
        let sql

        sql = `insert into solicitacao_pagamento (id_freelancer, valor_solicitado) values ('${dadosPagamento.id_freelancer}','${dadosPagamento.valor_solicitado}' )`

        let result = await prisma.$executeRawUnsafe(sql)

        if (result)
            return true
        else
            return false


    } catch (error) {
        console.log(error);
        return false
    }

}

const selectId = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL)as id from solicitacao_pagamento order by id desc limit 1'

        let rsSolicitacaoPagamento = await prisma.$queryRawUnsafe(sql)

        if (rsSolicitacaoPagamento) {
            return rsSolicitacaoPagamento[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

const updateSolicitacaoPagamento = async (idSolicitacao, dadosPagamento) => {

    let sql

    try {
        sql = `update solicitacao_pagamento set id_freelancer = '${dadosPagamento.id_freelancer}', 
                                                    valor_solicitado = '${dadosPagamento.valor_solicitado}' where id = ${idSolicitacao}`

        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {

        return false
    }

}

const deleteSolicitacaoPagamento = async (id) => {

    try {
        let sql = `delete from solicitacao_pagamento where id = ${id}`

        let rsSolicitacaoPagamento = await prisma.$queryRawUnsafe(sql)

        return rsSolicitacaoPagamento

    } catch (error) {
        return false
    }

}

const selectByIdSolicitacao = async (id) => {

    try {
        let sql = `select * from solicitacao_pagamento where id = ${id}`

        let rsSolicitacaoPagamento = await prisma.$queryRawUnsafe(sql)

        return rsSolicitacaoPagamento

    } catch (error) {
        return false
    }


}

const selectAllSolicitacaoPagamento = async () => {

    try {
        let sql = 'select * from solicitacao_pagamento'

        let rsSolicitacaoPagamento = await prisma.$queryRawUnsafe(sql)

        return rsSolicitacaoPagamento

    } catch (error) {

        return false

    }

}

module.exports = {
    insertSolicitacaoPagamento,
    selectId,
    updateSolicitacaoPagamento,
    deleteSolicitacaoPagamento,
    selectAllSolicitacaoPagamento,
    selectByIdSolicitacao
}