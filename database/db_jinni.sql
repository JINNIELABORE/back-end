create database JINNI_DB;

use JINNI_DB;

create table cadastro_cliente(
id int not null auto_increment primary key,
nome_cliente varchar(50) not null,
cnpj_cliente bigint(14),
email_cliente varchar(255),
senha_cliente varchar(80)not null
);


create table cadastro_freelancer(
id int not null auto_increment primary key,
nome_freelancer varchar(50) not null,
data_nascimento date not null,
cpf_freelancer bigint(12) not null,
email_freelancer varchar(255),
senha_freelancer varchar(80) not null
);