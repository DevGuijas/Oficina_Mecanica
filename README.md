# Oficina_Mecanica
Ordem de serviço back-end para Oficina Mecânica

npm install cors


Baixar: 
https://www.mongodb.com/try/download/community

https://www.postman.com/downloads/


Abaixo está um exemplo básico de como você pode construir uma aplicação em Node.js para gerenciar os cadastros de clientes e ordens de serviço em uma oficina mecânica, utilizando o Express para gerenciar as rotas, o MongoDB para armazenamento de dados, e o Mongoose para manipulação do banco de dados.

Passos:
Instalação de dependências: Vamos usar o Express para as rotas, o Mongoose para a interação com o MongoDB e o body-parser para processar os dados das requisições.

Crie um novo projeto e instale as dependências necessárias.

bash
Copiar
mkdir oficina-mecanica
cd oficina-mecanica
npm init -y
npm install express mongoose body-parser
Estrutura de arquivos: A estrutura do projeto será:

pgsql
Copiar
oficina-mecanica/
├── node_modules/
├── models/
│   ├── cliente.js
│   └── ordemServico.js
├── routes/
│   └── api.js
├── server.js
└── package.json
Definindo o modelo de Cliente (models/cliente.js):

javascript
Copiar
const mongoose = require('mongoose');

const clienteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
  },
  telefone: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Cliente', clienteSchema);
Definindo o modelo de Ordem de Serviço (models/ordemServico.js):

javascript
Copiar
const mongoose = require('mongoose');
const Cliente = require('./cliente');

const ordemServicoSchema = new mongoose.Schema({
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cliente',
    required: true
  },
  modeloVeiculo: {
    type: String,
    required: true
  },
  placaVeiculo: {
    type: String,
    required: true
  },
  corVeiculo: {
    type: String,
    required: true
  },
  descricaoProblema: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('OrdemServico', ordemServicoSchema);
Configurando as rotas e a lógica de CRUD (routes/api.js):

javascript
Copiar
const express = require('express');
const Cliente = require('../models/cliente');
const OrdemServico = require('../models/ordemServico');

const router = express.Router();

// Criar um cliente
router.post('/clientes', async (req, res) => {
  try {
    const cliente = new Cliente(req.body);
    await cliente.save();
    res.status(201).send(cliente);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Editar um cliente
router.put('/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!cliente) {
      return res.status(404).send();
    }
    res.send(cliente);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Apagar um cliente
router.delete('/clientes/:id', async (req, res) => {
  try {
    const cliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!cliente) {
      return res.status(404).send();
    }
    res.send(cliente);
  } catch (err) {
    res.status(500).send(err);
  }
});

// Criar uma ordem de serviço
router.post('/ordens', async (req, res) => {
  try {
    const { clienteId, modeloVeiculo, placaVeiculo, corVeiculo, descricaoProblema } = req.body;

    const cliente = await Cliente.findById(clienteId);
    if (!cliente) {
      return res.status(404).send('Cliente não encontrado');
    }

    const ordemServico = new OrdemServico({
      cliente: cliente._id,
      modeloVeiculo,
      placaVeiculo,
      corVeiculo,
      descricaoProblema
    });

    await ordemServico.save();
    res.status(201).send(ordemServico);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Editar uma ordem de serviço
router.put('/ordens/:id', async (req, res) => {
  try {
    const ordemServico = await OrdemServico.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!ordemServico) {
      return res.status(404).send();
    }
    res.send(ordemServico);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Apagar uma ordem de serviço
router.delete('/ordens/:id', async (req, res) => {
  try {
    const ordemServico = await OrdemServico.findByIdAndDelete(req.params.id);
    if (!ordemServico) {
      return res.status(404).send();
    }
    res.send(ordemServico);
  } catch (err) {
    res.status(500).send(err);
  }
});

module.exports = router;
Configurando o servidor principal (server.js):

javascript
Copiar
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const apiRoutes = require('./routes/api');

const app = express();
const port = 3000;

// Conectando ao MongoDB
mongoose.connect('mongodb://localhost:27017/oficina', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB', err);
  });

// Middlewares
app.use(bodyParser.json());

// Definindo as rotas
app.use('/api', apiRoutes);

// Iniciando o servidor
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
Rodando o servidor: Para rodar o servidor, use o comando:

bash
Copiar
node server.js
Como a aplicação funciona:
Cadastro de clientes: Você pode criar, editar e deletar clientes.

Cadastro de ordens de serviço: Você pode criar, editar e deletar ordens de serviço.

Relacionamento: Uma ordem de serviço precisa de um cliente existente para ser criada.

Exemplos de requisições:
Criar cliente:

Método: POST

URL: http://localhost:3000/api/clientes

Corpo (JSON):

json
Copiar
{
  "nome": "João Silva",
  "telefone": "123456789",
  "email": "joao@gmail.com"
}
Criar ordem de serviço:

Método: POST

URL: http://localhost:3000/api/ordens

Corpo (JSON):

json
Copiar
{
  "clienteId": "id-do-cliente",
  "modeloVeiculo": "Fusca 1970",
  "placaVeiculo": "ABC1234",
  "corVeiculo": "Azul",
  "descricaoProblema": "Problema no motor"
}
Com isso, você tem uma aplicação simples de gestão de clientes e ordens de serviço para uma oficina mecânica!

------------------------------------------------------------------------------------------------------------------------

1. Verifique as rotas do seu servidor
O servidor está rodando corretamente, então o próximo passo é testar as rotas no Postman ou diretamente no navegador.

Rota GET /api/clientes:
Esta rota é usada para listar todos os clientes cadastrados no MongoDB.

Abra o Postman.

Selecione o método GET.

Na barra de URL do Postman, coloque a URL:

bash
Copiar
http://localhost:3000/api/clientes
Clique em Send.

Se houver clientes cadastrados, você verá uma lista de clientes no corpo da resposta. Se a lista estiver vazia, significa que ainda não há clientes no banco de dados.

Rota POST /api/clientes:
Esta rota é usada para criar um novo cliente. Para isso, você precisa enviar os dados no formato JSON.

No Postman, selecione o método POST.

Na barra de URL, coloque:

bash
Copiar
http://localhost:3000/api/clientes
No corpo da requisição (Body), selecione raw e, em seguida, escolha o tipo JSON. Então, insira o seguinte conteúdo JSON:

json
Copiar
{
  "nome": "João Silva",
  "telefone": "123456789",
  "email": "joao.silva@example.com"
}
Clique em Send.
