# ✅ Sistema de Gestão de Pedidos

## 1. Objetivo do Sistema

- [x] Gerenciar todo o ciclo de vida de pedidos desde a criação até a conclusão, com controle de estoque, clientes e status operacional.

## 2. Módulos Principais

- [ ] **Pedidos (Orders)**
- [ ] **Produtos (Products)**
- [ ] **Clientes (Customers)**
- [ ] **Autenticação (Auth)**

## 3. Funcionalidades por Módulo

### 3.1 Módulo de Pedidos

- [ ] Criar novo pedido com múltiplos itens
- [ ] Atualizar status do pedido (`Pendente` → `Processando` → `Concluído` → `Cancelado`)
- [ ] Listar pedidos com filtros (status, cliente, período)
- [ ] Detalhar pedido com itens e valores
- [ ] Cancelar pedido com restrições
- [ ] Calcular total automaticamente
- [ ] Histórico de alterações de status

### 3.2 Módulo de Produtos

- [ ] Cadastrar produtos com nome, preço e estoque
- [ ] Atualizar estoque automaticamente ao criar pedido
- [ ] Bloquear venda sem estoque suficiente
- [ ] Listar produtos com filtros (disponíveis/indisponíveis)

### 3.3 Módulo de Clientes

- [ ] Cadastrar clientes com dados básicos (nome, email, telefone)
- [ ] Vincular pedidos ao cliente
- [ ] Histórico de pedidos por cliente

### 3.4 Autenticação

- [x] Register (Cadastro de usuário)
- [ ] Login com JWT
- [ ] Controle de acesso por roles (usuário/admin)
- [ ] Proteção de rotas sensíveis

## 4. Regras de Negócio

### 4.1 Pedidos

- [ ] Todo pedido deve ter pelo menos **1 item**
- [ ] Só permite cancelamento se o pedido não estiver **"Concluído"**
- [ ] Atualização de status segue fluxo sequencial: `Pendente → Processando → Concluído`
- [ ] Pedidos cancelados devem reverter estoque dos produtos
- [ ] Valor total calculado automaticamente `(preço do produto * quantidade)`

### 4.2 Produtos

- [ ] Não permitir cadastro com **preço ≤ 0**
- [ ] Estoque não pode ficar **negativo**
- [ ] Atualização em lote quando pedido é confirmado

### 4.3 Clientes

- [ ] **Email deve ser único** no sistema
- [ ] Não permitir exclusão de cliente com **pedidos ativos**

### 4.4 Segurança

- [ ] Apenas **usuários autenticados** podem criar pedidos
- [ ] Apenas **administradores** podem alterar status para `"Concluído"`
- [ ] Clientes só visualizam **seus próprios pedidos**

## 5. Workflow Principal

- [ ] Cliente faz login
- [ ] Seleciona produtos e quantidades
- [ ] Sistema verifica estoque e calcula total
- [ ] Confirmação do pedido:
  - [ ] Atualiza estoque dos produtos
  - [ ] Gera registro do pedido
  - [ ] Envia e-mail de confirmação
- [ ] Atualizações de status pelo administrador

## 6. Componentes Técnicos

### 6.1 Model (Entities)

- [ ] **Order:** `ID, Cliente, Itens, Total, Status, Datas (criação/atualização)`
- [ ] **OrderItem:** `ID, Produto, Quantidade, Preço Unitário`
- [ ] **Product:** `ID, Nome, Descrição, Preço, Estoque`
- [ ] **Customer:** `ID, Nome, Email, Telefone, Pedidos`

### 6.2 View (APIs REST)

- [ ] Endpoints para operações **CRUD**
- [ ] Documentação com **Swagger**
- [ ] Respostas padronizadas (**JSON**)

### 6.3 Controller

- [ ] **Validação de inputs**
- [ ] **Tratamento de erros**
- [ ] **Comunicação com Services**

### 6.4 Services

- [ ] **Lógica de negócio**
- [ ] **Comunicação com banco de dados**
- [ ] **Integrações externas** (ex: envio de e-mails)

## 7. Requisitos Não-Funcionais

- [ ] Auditoria de alterações em pedidos
- [ ] Logs de operações críticas
- [ ] Paginação em listagens
- [ ] Validação de dados de entrada
- [ ] Tratamento de erros personalizado
- [ ] Testes unitários básicos

## 8. Fluxo de Implementação Sugerido

- [x] Configurar projeto **NestJS** com **TypeORM**
- [x] Criar módulo de **Autenticação**
- [ ] Implementar **entidades principais**
- [ ] Criar serviços básicos (**CRUD**)
- [ ] Adicionar regras de negócio progressivamente
- [ ] Implementar **endpoints da API**
- [ ] Criar **testes de integração**
- [ ] Documentar API com **Swagger**

## 9. Dependências Externas

- [x] **PostgreSQL** para banco de dados
- [ ] Biblioteca para envio de e-mails (ex: **Nodemailer**)
- [ ] Sistema de logging (ex: **Winston**)
- [ ] Ferramenta de documentação (**Swagger**)
