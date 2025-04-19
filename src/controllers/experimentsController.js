const service = require('../services/experimentsService');

function getAll(req, res) {
  const experiments = service.getAllExperiments();
  res.json(experiments);
}

function getById(req, res) {
  const experiment = service.getExperimentById(req.params.id);
  if (!experiment) {
    return res.status(404).json({ error: 'Эксперимент не найден' });
  }
  res.json(experiment);
}

function create(req, res) {
  const newExperiment = service.createExperiment(req.body);
  res.status(201).json(newExperiment);
}

function update(req, res) {
  const updated = service.updateExperiment(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Эксперимент не найден' });
  }
  res.json(updated);
}

function remove(req, res) {
  const success = service.deleteExperiment(req.params.id);
  if (!success) {
    return res.status(404).json({ error: 'Не удалось удалить' });
  }
  res.status(204).send();
}

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove
};
