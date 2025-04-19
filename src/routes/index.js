function setupRoutes(app) {
  app.get('/researchers', researchersController.getAll);
  app.get('/researchers/:id', researchersController.getById);
    app.post('/researchers', researchersController.create);
   app.put('/researchers/:id', researchersController.update);
  app.delete('/researchers/:id', researchersController.remove);
}
module.exports = setupRoutes;

const researchersController = require('../controllers/researchersController');
const experimentsController = require('../controllers/experimentsController');
function setupRoutes(app) {
     app.get('/researchers', researchersController.getAll);
  app.get('/researchers/:id', researchersController.getById);
   app.post('/researchers', researchersController.create);
  app.put('/researchers/:id', researchersController.update);
   app.delete('/researchers/:id', researchersController.remove);




   app.get('/experiments', experimentsController.getAll);
  app.get('/experiments/:id', experimentsController.getById);
  app.post('/experiments', experimentsController.create);
  app.put('/experiments/:id', experimentsController.update);
  app.delete('/experiments/:id', experimentsController.remove);
}

module.exports = setupRoutes;
