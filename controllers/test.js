const db = require("../models");
const Test = db.test;

exports.getTests = async (req, res) => {
    const startIndex = Number(req.query.startIndex);
    const numberOfItems = Number(req.query.numberOfItems);

    try {
    const testsList = await Test.findAll({ offset: startIndex, limit: numberOfItems });
    return res.send({ databaseMessage: testsList });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

exports.getTestById = async (req, res) => {
    const { id } = req.params;
    try {
        const test = await Test.findByPk(id);
        return res.send(test);
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

exports.createTest = async (req, res) => {
    const { text } = req.body;
    try {
        await Test.create({ value: text });
        return res.send({ done: true });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

exports.updateTest = async (req, res) => {
    const { id, text } = req.body;
    try {
        const result = await Test.update({ value: text }, {
            where: { id: id }
        });

        if(!result[0]) { // Not updated any row
            return res.status(404).send({ message: "Test not found!" });
        }

        return res.send({ done: true });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

exports.deleteTest = async (req, res) => {
    const { id } = req.body;
    try {
        const result = await Test.destroy({
            where: { id: id }
        });

        if(!result) { // Not deleted any row
            return res.status(404).send({ message: "Test not found!" });
        }

        return res.send({ done: true });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};

exports.getTestCount = async (req, res) => {
    try {
        const count = await Test.count();
        return res.send({ count: count });
    } catch (err) {
        return res.status(500).send({ message: err });
    }
};