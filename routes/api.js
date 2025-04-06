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