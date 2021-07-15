module.exports = {
    secret: process.env.SECRET,
    jwtExpiration: 60 * 60 * 24 * 7, // one week
    jwtRefreshExpiration: 60 * 60 * 24 * 14 // two weeks
};