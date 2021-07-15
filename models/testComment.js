module.exports = (sequelize, dataType) => {
    const TestComment = sequelize.define('test_comments', {
        comment: {
            type: dataType.STRING
        }
    });

    return TestComment;
};