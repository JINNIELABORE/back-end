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

create table nivel_experiencia(
id int not null auto_increment primary key,
nivel_experiencia varchar(20)
);

create table publicacao_projetos(
id int not null auto_increment primary key ,
nome_projeto varchar(50),
descricao_projeto varchar(150),
orcamento double not null,
id_nivel_experiencia int not null,

foreign key (id_nivel_experiencia) references nivel_experiencia(id)
);

create table categoria_publicacao_projetos(
id int not null auto_increment primary key,
id_categoria int not null,

foreign key (id_categoria) references categorias(id)
);

create table habilidade_publicacao_projetos(
id int not null auto_increment primary key,
id_habilidade int not null,

foreign key (id_habilidade) references habilidades(id)
);

create table descricao_perfil(
id int not null auto_increment primary key,
descricao varchar(200)
);

create table foto_perfil(
id int not null auto_increment primary key,
foto_perfil text

);

create table portfolio(
id int not null auto_increment primary key,
arquivo text
);

-- Inserindo Clientes
INSERT INTO cadastro_cliente (nome_cliente, cnpj_cliente, email_cliente, senha_cliente, is_premium)
VALUES 
('Empresa A', 12345678000100, 'contato@empresaA.com', 'senha123', false),
('Empresa B', 23456789000111, 'contato@empresaB.com', 'senha123', false),
('Empresa C', 34567890000122, 'contato@empresaC.com', 'senha123', true),
('Empresa D', 45678900000133, 'contato@empresaD.com', 'senha123', false),
('Empresa E', 56789000000144, 'contato@empresaE.com', 'senha123', true);

-- Inserindo Freelancers
INSERT INTO cadastro_freelancer (nome_freelancer, data_nascimento, cpf_freelancer, email_freelancer, senha_freelancer, is_premium)
VALUES 
('Freelancer A', '1990-01-15', 12345678901, 'freelancerA@gmail.com', 'senha123', false),
('Freelancer B', '1988-02-20', 23456789012, 'freelancerB@gmail.com', 'senha123', false),
('Freelancer C', '1995-03-10', 34567890123, 'freelancerC@gmail.com', 'senha123', true),
('Freelancer D', '1992-04-05', 45678901234, 'freelancerD@gmail.com', 'senha123', false),
('Freelancer E', '1985-05-25', 56789012345, 'freelancerE@gmail.com', 'senha123', true);

-- Inserindo Categorias
INSERT INTO categorias (nome_categoria, icon_categoria)
VALUES 
('Back-End', 'backend_icon.png'),
('Front-End', 'frontend_icon.png'),
('Mobile', 'mobile_icon.png'),
('Data Science', 'datascience_icon.png'),
('DevOps', 'devops_icon.png');

-- Inserindo Habilidades
INSERT INTO habilidades (nome_habilidade, icon_habilidade)
VALUES 
('HTML', 'html_icon.png'),
('CSS', 'css_icon.png'),
('JavaScript', 'javascript_icon.png'),
('Python', 'python_icon.png'),
('SQL', 'sql_icon.png');

-- Inserindo Itens na Tabela freelancer_categoria
INSERT INTO freelancer_categoria (id_freelancer, id_categoria)
VALUES 
(1, 1), -- Freelancer A -> Back-End
(2, 2), -- Freelancer B -> Front-End
(3, 3), -- Freelancer C -> Mobile
(4, 4), -- Freelancer D -> Data Science
(5, 5); -- Freelancer E -> DevOps

-- Inserindo Itens na Tabela freelancer_habilidade
INSERT INTO freelancer_habilidade (id_freelancer, id_habilidade)
VALUES 
(1, 1), -- Freelancer A -> HTML
(2, 2), -- Freelancer B -> CSS
(3, 3), -- Freelancer C -> JavaScript
(4, 4), -- Freelancer D -> Python
(5, 5); -- Freelancer E -> SQL

