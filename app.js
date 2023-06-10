
const express = require('express');
const cors = require('cors');

const cookieParser = require('cookie-parser');
const connectDB = require('./db/conn');
const routes = require('./router/routes');
const manager = require('./router/manager');
const branch = require('./router/branches');
const package = require('./router/package');

const app = express();
connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());

app.use('/api', routes);
app.use('/api', manager);
app.use('/api', branch);
app.use('/api', package);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}...`));
