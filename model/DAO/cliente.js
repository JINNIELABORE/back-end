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

module.exports = {
    insertCliente,
    selectId
}