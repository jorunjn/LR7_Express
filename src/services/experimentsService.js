const { readJson, writeJson } = require('../db/db');
const { v4: uuidv4 } = require('uuid');

const FILE = 'experiments.json';

function getAllExperiments() {
  return readJson(FILE);
}

function getExperimentById(id) {
  const data = readJson(FILE);
  return data.find(e => e.id === id);
}

function createExperiment(experiment) {
  const data = readJson(FILE);
  const newExperiment = { id: uuidv4(), ...experiment };
  data.push(newExperiment);
  writeJson(FILE, data);
  return newExperiment;
}

function updateExperiment(id, updatedFields) {
  const data = readJson(FILE);
  const index = data.findIndex(e => e.id === id);
  if (index === -1) return null;

  data[index] = { ...data[index], ...updatedFields };
  writeJson(FILE, data);
  return data[index];
}

function deleteExperiment(id) {
  const data = readJson(FILE);
  const newData = data.filter(e => e.id !== id);
  if (data.length === newData.length) return false;
  writeJson(FILE, newData);
  return true;
}

module.exports = {
  getAllExperiments,
  getExperimentById,
  createExperiment,
  updateExperiment,
  deleteExperiment
};
