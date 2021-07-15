module.exports = (sequelize, dataType) => {
    const Test = sequelize.define('test', {
        value: {
            type: dataType.STRING
        }
    });

    return Test;
};