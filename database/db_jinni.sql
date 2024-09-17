create database JINNI_DB;

use JINNI_DB;

create table cadastro_cliente(
id int not null auto_increment primary key,
nome_cliente varchar(50) not null,
cnpj_cliente bigint(14) not null,
email_cliente varchar(255) not null,
senha_cliente varchar(80)not null,
is_premium boolean not null default false,

unique key (id),
unique index (id)
);

create table cadastro_freelancer(
id int not null auto_increment primary key,
nome_freelancer varchar(50) not null,
data_nascimento date not null,
cpf_freelancer bigint(12) not null,
email_freelancer varchar(255) not null,
senha_freelancer varchar(80) not null,
is_premium boolean not null default false,

unique key (id),
unique index (id)
);

create table categorias(
id int not null auto_increment primary key,
nome_categoria varchar(50) not null,
icon_categoria varchar(200) not null,

unique key (id),
unique index (id)
);

create table habilidades(
id int not null auto_increment primary key,
nome_habilidade varchar(50) not null,
icon_habilidade varchar(200) not null,

unique key (id),
unique index (id)
);

-- Tabela intermediária entre freelancers e sua categoria de trabalho
create table freelancer_categoria (
  id int not null auto_increment primary key,
  id_freelancer int not null,
  id_categoria int not null,
  
  foreign key (id_freelancer) references cadastro_freelancer(id),
  foreign key (id_categoria) references categorias(id),
  
  unique key (id),
  unique index (id)
);

-- Tabela intermediária entre freelancers e sua habilidade de trabalho
create table freelancer_habilidade (
  id int not null auto_increment primary key,
  id_freelancer int not null,
  id_habilidade int not null,
  
  foreign key (id_freelancer) references cadastro_freelancer(id),
  foreign key ( id_habilidade) references habilidades(id),
  
  unique key (id),
  unique index (id)
);