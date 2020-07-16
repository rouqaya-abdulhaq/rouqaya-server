const express = require("express");
const app = express();
const port = process.env.PORT || '8000';

const bodyParser = require('body-parser');
const cors = require('cors');
const pg = require('pg');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

app.use(bodyParser.json());
app.use(cors());

const DATABASE_URL = 'postgres://postgres:patapon2012@127.0.0.1:5432/rouqaya_abdulhaq';

const client = new pg.Client({
    connectionString : DATABASE_URL
});

client.connect();

const projectsController = require('./controllers/projectsController');
const blogsController = require('./controllers/blogsController');
const blogTranslationController = require('./controllers/blogTranslationController');

projectsController(app,client);
blogsController(app,client);
blogTranslationController(app,client);

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});