const { readJson, writeJson } = require('../db/db');
const { v4: uuidv4 } = require('uuid');

const FILE = 'researchers.json';

function getAllResearchers() {
  return readJson(FILE);
}

function getResearcherById(id) {
  const data = readJson(FILE);
  return data.find(r => r.id === id);
}

function createResearcher(researcher) {
  const data = readJson(FILE);
  const newResearcher = { id: uuidv4(), ...researcher };
  data.push(newResearcher);
  writeJson(FILE, data);
  return newResearcher;
}

function updateResearcher(id, updatedFields) {
  const data = readJson(FILE);
  const index = data.findIndex(r => r.id === id);
  if (index === -1) return null;

  data[index] = { ...data[index], ...updatedFields };
  writeJson(FILE, data);
  return data[index];
}

function deleteResearcher(id) {
  const data = readJson(FILE);
  const newData = data.filter(r => r.id !== id);
  if (data.length === newData.length) return false;
  writeJson(FILE, newData);
  return true;
}

module.exports = {
  getAllResearchers,
  getResearcherById,
  createResearcher,
  updateResearcher,
  deleteResearcher
};
