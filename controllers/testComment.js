const db = require("../models");
const TestComment = db.testComment;

exports.getComments = async (req, res) => {
    const { id } = req.params;
    try {
        const comments = await TestComment.findAll({
            where: { testId: id },
            order: [
                ['id', 'DESC']
            ]
        });
        return res.send(comments);
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

exports.createComment = async (req, res) => {
    const { test_id, comment } = req.body;
    try {
        await TestComment.create({ testId: test_id, comment: comment });
        return res.send({ done: true });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
}

exports.deleteComment = async (req, res) => {
    const { id, test_id } = req.body;
    try {
        await TestComment.destroy({
            where: {
                id: id,
                testId: test_id
            }
        })
        return res.send({ done: true });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};