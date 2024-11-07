const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Função para inserir um pagamento
const insertPagamento = async (dadosPagamento) => {

    try {
        let sql

        sql = `insert into pagamentos(id_usuario, valor, metodo_pagamento, status_pagamento, parcelas, taxa, codigo_transacao, descricao, moeda) 
               values('${dadosPagamento.id_usuario}', '${dadosPagamento.valor}', '${dadosPagamento.metodo_pagamento}', 
                      '${dadosPagamento.status_pagamento}', '${dadosPagamento.parcelas}', '${dadosPagamento.taxa}', 
                      '${dadosPagamento.codigo_transacao}', '${dadosPagamento.descricao}', '${dadosPagamento.moeda}')`

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

// Função para buscar o último ID de pagamento inserido
const selectUltimoIdPagamento = async () => {
    try {
        let sql = 'select CAST(id as DECIMAL) as id from pagamentos order by id desc limit 1'

        let rsPagamentos = await prisma.$queryRawUnsafe(sql)

        if (rsPagamentos) {
            return rsPagamentos[0].id
        } else {
            return false
        }
    } catch (error) {
        return false
    }
}

// Função para atualizar os dados de um pagamento
const updatePagamento = async (idPagamento, dadosPagamento) => {

    let sql

    try {
        sql = `update pagamentos set 
                nome_habilidade = '${dadosPagamento.nome_habilidade}', 
                icon_habilidade = '${dadosPagamento.icon_habilidade}' 
                where id = ${idPagamento}`

        let result = await prisma.$executeRawUnsafe(sql)
        
        return result

    } catch (error) {
        return false
    }
}

// Função para deletar um pagamento
const deletePagamento = async (idPagamento) => {

    try {
        let sql = `delete from pagamentos where id = ${idPagamento}`

        let rsPagamentos = await prisma.$queryRawUnsafe(sql)

        return rsPagamentos

    } catch (error) {
        return false
    }
}

// Função para buscar um pagamento por ID
const selectByIdPagamento = async (idPagamento) => {

    try {
        let sql = `select * from pagamentos where id = ${idPagamento}`

        let rsPagamento = await prisma.$queryRawUnsafe(sql)

        return rsPagamento

    } catch (error) {
        return false
    }
}

// Função para buscar todos os pagamentos
const selectAllPagamentos = async () => {

    try {
        let sql = 'select * from pagamentos'
        let rsPagamentos = await prisma.$queryRawUnsafe(sql)

        return rsPagamentos

    } catch (error) {
        return false
    }
}
module.exports = {
    insertPagamento,
    selectUltimoIdPagamento,
    updatePagamento,
    deletePagamento,
    selectAllPagamentos,
    selectByIdPagamento,
}