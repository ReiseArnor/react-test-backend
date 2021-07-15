const { authJwt } = require("../middleware");
const controller = require('../controllers/test');

module.exports = function(app) {

    app.get('/test', controller.getTests);

    app.get('/test/:id', controller.getTestById);

    app.get('/test-count', controller.getTestCount);

    app.post(
        '/create-test',
        [authJwt.verifyToken],
        controller.createTest
    );

    app.put(
        '/update-test',
        [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
        controller.updateTest
    );

    app.delete(
        '/delete-test',
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteTest
    );
};