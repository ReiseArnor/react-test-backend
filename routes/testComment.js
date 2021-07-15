const controller = require('../controllers/testComment');
const { authJwt } = require("../middleware");

module.exports = function(app) {

    app.get('/get-comments/:id', controller.getComments);

    app.post(
        '/create-comment',
        [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
        controller.createComment
    );

    app.delete(
        '/delete-comment',
        [authJwt.verifyToken, authJwt.isAdmin],
        controller.deleteComment
    );
};