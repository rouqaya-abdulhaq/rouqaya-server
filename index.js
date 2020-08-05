const express = require("express");
const app = express();
const port = process.env.PORT || '8000';
const {client} = require('./config');
client.connect();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

app.use(helmet());
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
app.use(bodyParser.json());
app.use(cors());
app.use(compression());

const projectsController = require('./controllers/projectsController');
const blogsController = require('./controllers/blogsController');
const blogTranslationController = require('./controllers/blogTranslationController');
const aboutController = require('./controllers/aboutController');

projectsController(app,client);
blogsController(app,client);
blogTranslationController(app,client);
aboutController(app,client);

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});