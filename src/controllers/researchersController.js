const service = require('../services/researchersService');

function getAll(req, res) {
  const researchers = service.getAllResearchers();
  res.json(researchers);
}

function getById(req, res) {
  const researcher = service.getResearcherById(req.params.id);
  if (!researcher) {
    return res.status(404).json({ error: 'Исследователь не найден' });
  }
  res.json(researcher);
}

 function create(req, res) {
  const newResearcher = service.createResearcher(req.body);
  res.status(201).json(newResearcher);
}

function update(req, res) {
  const updated = service.updateResearcher(req.params.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Исследователь не найден' });
  }
  res.json(updated);
}

function remove(req, res) {
  const success = service.deleteResearcher(req.params.id);
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
