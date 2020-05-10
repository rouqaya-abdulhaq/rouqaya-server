const express = require("express");
const app = express();
const port = process.env.PORT || '8000';

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

app.use(bodyParser.json());
app.use(cors());

//temp until data base connection
const blogs = [{title : "blog1" , content : "words"},
                {title : "blog2" , content : "words"},
                {title : "blog3" , content : "words"},
                {title : "blog4" , content : "words"},
                {title : "blog5" , content : "words"}];

const projects = [{title : "project1" , imgUrl: "", url:"ufkdj", info : "info", githubUrl : "github"},
{title : "project2" , imgUrl: "", url:"ufkdj", info : "info",githubUrl : "github"},
{title : "project3" , imgUrl: "", url:"ufkdj", info : "info",githubUrl : "github"},
{title : "project4" , imgUrl: "", url:"ufkdj", info : "info",githubUrl : "github"},
{title : "project5" , imgUrl: "", url:"ufkdj", info : "info",githubUrl : "github"},
];

const projectsController = require('./controllers/projectsController');
const blogsController = require('./controllers/blogsController');
const uploadController = require('./controllers/uploadController');

projectsController(app,projects);
blogsController(app,blogs);
uploadController(app,projects);


app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});