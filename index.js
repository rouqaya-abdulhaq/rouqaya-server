const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || '8000';

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({extended : false}));

app.use(bodyParser.json());
app.use(cors());

const blogs = [];

const projects = [];

app.get('/', (req,res)=>{
    res.status(200).send("initial setup");
});

app.put('/postBlog', (req, res)=>{
    const title = req.body.title;
    const content = req.body.content;
    const blog = {
        title : title,
        content : content
    }
    blogs.push(blog);
    res.status(200).send(blog);
});

app.post('/addProject',(req,res)=>{
    const title = req.body.title;
    const info = req.body.info;
    const url = req.body.url;
    const imgUrl = req.body.imgUrl;

    const project = {
        title : title,
        info : info,
        url : url,
        imgUrl : imgUrl
    }
    projects.push(project)
    res.status(200).send(projects);
});

//INDEX WILL BE ID LATER WILL DELETE BY ID 
app.put('/removeBlog',(req,res)=>{
    const index = req.body.index;
    blogs.splice(index,1);
    res.status(200).send(blogs);
});

app.put('/removeProject',(req,res)=>{
    const index = req.body.index;
    projects.splice(index,1);
    res.status(200).send(projects);
});

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});