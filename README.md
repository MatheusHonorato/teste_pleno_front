# Desafio | Fullstack

O teste consiste em implementar uma lista de contatos e empresas. O projeto, obrigatoriamente, deve ser separado em backend e frontend.

## Backend

O backend **deve** ser desenvolvido em `php` e **deve** conter uma API Rest.

O sistema deve conter as seguintes entidades e seus respectivos campos:

- Usuário
    - Nome: obrigatório para preenchimento
    - E-mail: obrigatório para preenchimento
    - Telefone: não obrigatório
    - Data de nascimento: não obrigatório
    - Cidade onde nasceu: não obrigatório
    - Empresas: obrigatório para preenchimento

- Empresa
    - Nome: obrigatório para preenchimento
    - CNPJ: obrigatório para preenchimento
    - Endereço: obrigatório para preenchimento
    - Usuários: obrigatório para preenchimento

A regra de relacionamento para `Usuário` e `Empresa` deve ser de __n para n__

### Banco
Você **deve** utilizar um banco de dados para o sistema. Pode-se escolher qualquer opção que desejar, mas o seguite cenário deve ser levado em consideração:
- O sistema lida com informações sensíveis e preza pela integridade dos dados
- O sistema lida com diferentes entidades relacionadas

Pedimos para que nos sinalize o motivo da escolha do banco no final do documento

O banco de dados escolhido foi o MySQL. O banco de dados MySQL já tem se consolidado no mercado como um banco de dados robusto e seguro, sendo ideal para utilização em sistemas que lidam com dados sensiveis e integridade de dados. Além disso
o MySQL possui o recurso de transactions que é essencial para atomicidade das operações realizadas no banco possibilitando maior garantia de consistência dos dados. O banco mysql possui quando habilitado na criação de suas tabelas ENGINE=InnoDB,
o uso de chaves estrangeiras, essencial para trabalhar com bancos que possuem diferentes entidades relacionadas.

## Frontend
O frontend **deve** ser desenvolvido utilizando `react` e **deve** usar os dados fornecidos pela API.

Você **pode** e, de preferência, **deve** utilizar bibliotecas de terceiros.

Deve-se desenvolver uma página de formulário para cada uma das entidades (`Usuario` e `Empresa`). Também deve ser desenvolvida uma página listando todos os usuários e seus respectivos campos, inclusive todas as empresas de que ele faz parte.

Deve-se ter a possibilidade de filtrar os dados conforme cada um dos campos.

Obs: para facilitar, segue uma proposta de layout, você tem liberdade para desenvolver o layout da forma que achar mais adequado.

## Testes
Testes unitários **devem** ser implementados no backend para validação das operações do CRUD.

Testes unitários **devem** ser implementados no frontend para a tela de exibição dos usuários.

Você pode utilizar o framework de sua preferência tanto para o backend quanto para o frontend.

## Ambiente
Aqui na Contato Seguro, utilizamos __Docker__ nos nossos ambientes, então será muito bem visto caso decida utilizar. Principalmente para que tenhamos o mesmo resultado (mesma configuração de ambiente). Caso desenvolva com docker, nos envie junto com o projeto o `docker-compose.yml` e/ou os `Dockerfile´`s.

## Requisitos mínimos
- As 4 operações CRUD, tanto para entidade `Usuário`, quanto para `Empresa`. Todas as operações devem ter rotas específicas no backend.
- O filtro de registros
- Código legível, limpo e seguindo boas práticas de Orientação a Objetos
- Um dump ou DDL do banco de dados
- Testes unitários

## Requisitos bônus
- Utilizar Docker
- Outras entidades e relacionamento entre entidades. Por exemplo: uma entidade `Relatos` ou `Atividades` que tenha `Usuários` e/ou `Empresas` vinculadas.
- Separação em commits, especialmente com boas mensagens de identificação.

# Resposta do participante

## Tutorial de como rodar o front-end da aplicação(API):

### Softwares necessários

- Node >= v16.17.0

### Paso a passo

- Instalando

Se possui o git instalado:

Clone o repositório em: https://github.com/MatheusHonorato/teste_pleno_front

Se não possui o git instalado:

Acesse:  https://github.com/MatheusHonorato/teste_pleno_front

Clique em: CODE > Download ZIP

- Rodando

Após efetuar o download do projeto é necessário executar os seguintes passos:

- Acesse a raiz do projeto
- copie o arquivo '.env-example' e renomeie para '.env'
- Rode o comando 'npm i' para instalar as dependencias
- Rode o comando 'npm start' para carregar o projeto
- Após alguns segundos o projeto já deve abrir no seu navegador no endereço 'http://localhost:3000/' ou na próxima porta disponível no sistema (verifique a porta no console) 
- Caso tenha sido necessario mudar a porta da api, atualize a constante: REACT_APP_BASE_URL no arquivo .env com o novo endereço.

Para rodar os testes execute: 'npm test -- --coverage'

## Um pouco sobre a aplicação (Front-End)

Stack utilizada:

- HTMl 5
- CSS 3
- Javascript
- ReactJS

Pacotes extra:

- bootstrap
- react-bootstrap
- jest

Descrição

A aplicação foi desenvolvida utilizando orientação a objetos e o padrão de componentes baseados em classes no reactjs. Para uma melhor organização os testes foram organizados no mesmo padrão hierarquico dos componentes.

## Pricipais dificuldades e duvidas

A principal dificuldade durante o desenvolvimento foi a expertise na tecnologia atual ReactJS por estar a um bom tempo sem utiliza-lo.

## Melhorias propostas

- Melhor organização dos componentes isolando itens como modal.
- Utilização de componentes baseados em funções
- Utilização de typescript para um melhor debug da aplicação
- Utilização de pacote para validações
- Melhor gerenciamento de estados utilizando reatividade de maneira mais consolidada não tendo que recarregar todo um componente após uma atualização, mas sim unicamente os itens necessários.
- Maior cobertura de testes.