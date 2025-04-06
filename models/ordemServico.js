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