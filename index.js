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
const blogs = [{id : 1,title : "blog1" , content : "words"},
                {id:2,title : "blog2" , content : "words"},
                {id: 3,title : "blog3" , content : "words"},
                {id:4,title : "blog4" , content : "words"},
                {id:5,title : "blog5" , content : "words"}];

const projects = [{id : 1,title : "project1" , imgUrl: "", url:"ufkdj", info : "info", githubUrl : "github"},
{id : 2,title : "project2" , imgUrl: "", url:"ufkdj", info : "info",githubUrl : "github"},
{id: 3,title : "project3" , imgUrl: "", url:"ufkdj", info : "info",githubUrl : "github"},
{id:4,title : "project4" , imgUrl: "", url:"ufkdj", info : "info",githubUrl : "github"},
{id: 5,title : "project5" , imgUrl: "", url:"ufkdj", info : "info",githubUrl : "github"},
];

const projectsController = require('./controllers/projectsController');
const blogsController = require('./controllers/blogsController');

projectsController(app,projects);
blogsController(app,blogs);


app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});