const express = require('express');
const mongoose = require('mongoose');
const Cliente = require('./models/cliente'); // Modelo do Cliente
const cors = require('cors');

// Iniciar o app Express
const app = express();

// Middleware para tratar JSON
app.use(express.json());
app.use(cors());

// Conectar ao MongoDB
mongoose.connect('mongodb://localhost:27017/oficina', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => {
    console.log('Conectado ao MongoDB');
  })
  .catch((err) => {
    console.error('Erro ao conectar ao MongoDB', err);
  });

// Definir as rotas
// Rota para obter todos os clientes (GET)
app.get('/api/clientes', async (req, res) => {
  try {
    const clientes = await Cliente.find(); // Buscar todos os clientes
    res.json(clientes); // Retorna todos os clientes
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar clientes', error: err });
  }
});

// Rota para criar um novo cliente (POST)
app.post('/api/clientes', async (req, res) => {
  const { nome, telefone, email } = req.body;

  if (!nome || !telefone || !email) {
    return res.status(400).json({
      error: 'Os campos nome, telefone e email são obrigatórios.'
    });
  }

  try {
    const cliente = new Cliente(req.body);  // Cria uma nova instância do modelo Cliente
    await cliente.save();  // Salva o cliente no MongoDB
    res.status(201).json(cliente);  // Retorna o cliente criado
  } catch (err) {
    res.status(400).json({ error: 'Erro ao salvar cliente', details: err });
  }
});

// Iniciar o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});