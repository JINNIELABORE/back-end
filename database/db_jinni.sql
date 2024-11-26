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
id int not null auto_increment primary key,
id_cliente int not null,
nome_projeto varchar(50),
descricao_projeto varchar(150),
orcamento double not null,
id_nivel_experiencia int not null,
is_premium boolean not null default false,

foreign key (id_cliente) references cadastro_cliente(id),
foreign key (id_nivel_experiencia) references nivel_experiencia(id)
);

create table categoria_publicacao_projetos(
id int not null auto_increment primary key,
id_projeto int not null,
id_categoria int not null,

foreign key (id_projeto) references publicacao_projetos(id),
foreign key (id_categoria) references categorias(id)
);

create table habilidade_publicacao_projetos(
id int not null auto_increment primary key,
id_projeto int not null,
id_habilidade int not null,

foreign key (id_projeto) references publicacao_projetos(id),
foreign key (id_habilidade) references habilidades(id)
);

create table descricao_perfil(
  id int not null auto_increment primary key,
  descricao text not null,
  id_cliente int,
  id_freelancer int,

  foreign key (id_cliente) references cadastro_cliente(id),
  foreign key (id_freelancer) references cadastro_freelancer(id)
);

create table foto_perfil(
  id int not null auto_increment primary key,
  foto_perfil text not null,
  id_cliente int,
  id_freelancer int,

  foreign key (id_cliente) references cadastro_cliente(id),
  foreign key (id_freelancer) references cadastro_freelancer(id)
);


create table portfolio(
  id int not null auto_increment primary key,
  arquivo text not null
);

create table portfolio_freelancer(
  id int not null auto_increment primary key,
  id_portfolio int not null,
  id_freelancer int not null,

  foreign key (id_portfolio) references portfolio(id),
  foreign key (id_freelancer) references cadastro_freelancer(id)
);

-- Tabela de Avaliações
create table avaliacao (
    id int not null auto_increment primary key,
    estrelas int not null check (estrelas between 1 and 5),
    comentario text not null 
);

create table avaliacao_usuario (
    id int not null auto_increment primary key,
    id_avaliacao int not null,
    id_avaliador int not null,
    tipo_avaliador enum('cliente', 'freelancer') not null,
    id_avaliado int not null,
    tipo_avaliado enum('cliente', 'freelancer') not null,
    
    foreign key (id_avaliacao) references avaliacao(id)
);

CREATE TABLE pagamentos (
    id int primary key auto_increment,
    id_cliente int not null,
    id_freelancer int not null,
    valor decimal (10, 2) not null,
    metodo_pagamento ENUM('pix') not null,
    status_pagamento ENUM('pendente', 'concluido', 'cancelado') not null default 'pendente',
    descricao text, 
    link_pagamento text,
    
    foreign key (id_cliente) references cadastro_cliente(id),
    foreign key (id_freelancer) references cadastro_freelancer(id)
);

create table freelancer_projeto (
id int auto_increment not null primary key,
id_projeto int not null,
id_freelancer int not null,
status boolean not null default false, -- false é projeto em andamento e true é projeto finalizado

foreign key (id_projeto) references publicacao_projetos(id),
foreign key (id_freelancer) references cadastro_freelancer(id)
);

create table denuncia (
    id int not null auto_increment primary key,
    arquivo text not null,
    descricao text not null 
);

create table disputa (
    id int not null auto_increment primary key,
    id_denuncia int not null,
    id_denunciante int not null,
    tipo_denunciante enum('cliente', 'freelancer') not null,
    id_denunciado int not null,
    tipo_denunciado enum('cliente', 'freelancer') not null,
    situacao enum('pendente', 'em andamento', 'resolvido') not null default 'pendente',
    
    foreign key (id_denuncia) references denuncia(id)
);

create table solicitacao_pagamento (
id int not null auto_increment primary key,
id_freelancer int not null, 
valor_solicitado decimal(10,2) not null,

foreign key (id_freelancer) references cadastro_freelancer(id)

);
  
INSERT INTO avaliacao (estrelas, comentario)
VALUES (4, 'Muito bom seviço');

INSERT INTO avaliacao_usuario (id_avaliacao, id_avaliador, tipo_avaliador, id_avaliado, tipo_avaliado)
VALUES (1, 1, 'cliente', 1, 'freelancer');

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

-- Inserindo Níveis de Experiência
INSERT INTO nivel_experiencia (nivel_experiencia)
VALUES 
('Júnior'),
('Pleno'),
('Sênior');

-- Inserindo Projetos
INSERT INTO publicacao_projetos (id_cliente, nome_projeto, descricao_projeto, orcamento, id_nivel_experiencia)
VALUES 
(1, 'Site Institucional', 'Desenvolvimento de site para empresa de TI', 5000.00, 1),
(2, 'Aplicativo Mobile', 'Aplicativo de agendamento para clínicas', 8000.00, 2),
(3, 'Análise de Dados', 'Projeto de análise de dados de vendas', 7000.00, 3);

-- Inserindo Categoria em Publicação de Projetos
INSERT INTO categoria_publicacao_projetos (id_projeto, id_categoria)
VALUES 
(1, 2), -- Site Institucional -> Front-End
(2, 3), -- Aplicativo Mobile -> Mobile
(3, 4); -- Análise de Dados -> Data Science

-- Inserindo Habilidade em Publicação de Projetos
INSERT INTO habilidade_publicacao_projetos (id_projeto, id_habilidade)
VALUES 
(1, 1), -- Site Institucional -> HTML
(2, 3), -- Aplicativo Mobile -> JavaScript
(3, 4); -- Análise de Dados -> Python

-- Inserindo Descrição de Perfil
INSERT INTO descricao_perfil (descricao, id_cliente, id_freelancer)
VALUES 
('Empresa focada em desenvolvimento de software.', 1, NULL),
('Freelancer com experiência em Back-End e JavaScript.', NULL, 1);

-- Inserindo Foto de Perfil
INSERT INTO foto_perfil (foto_perfil, id_cliente, id_freelancer)
VALUES 
('empresaA_foto.png', 1, NULL),
('freelancerA_foto.png', NULL, 1);

-- Inserindo Portfólio
INSERT INTO portfolio (arquivo)
VALUES 
('projeto_site_institucional.zip'),
('projeto_app_mobile.zip'),
('analise_dados_vendas.pdf');

-- Associando Portfólio ao Freelancer
INSERT INTO portfolio_freelancer (id_portfolio, id_freelancer)
VALUES 
(1, 1), -- Freelancer A -> projeto_site_institucional.zip
(2, 3), -- Freelancer C -> projeto_app_mobile.zip
(3, 4); -- Freelancer D -> analise_dados_vendas.pdf