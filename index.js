const express = require('express');
const app = express();
const cors = require('cors');
const db = require("./models");
db.sequelize.sync();

// CORS
const corsOptions = {
    origin: process.env.ORIGIN,
    methods: ['GET', 'PUT', 'POST', 'DELETE'],
    allowedHeaders: ['Authorization', 'X-API-KEY', 'X-Requested-With', 'Origin', 'Content-Type', 'X-Auth-Token', 'Accept', 'Access-Control-Allow-Request-Method'],
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Routes
require('./routes/auth')(app);
require('./routes/test')(app);
require('./routes/testComment')(app);

// Server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
