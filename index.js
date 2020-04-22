const express = require("express");
const path = require("path");
const queryString = require('querystring');

const app = express();
const port = process.env.PORT || '8000';

const bodyParser = require('body-parser');
const cors = require('cors');

app.use(bodyParser.urlencoded({extended : false}));

app.use(bodyParser.json());
app.use(cors());
//temp until data base connection
const blogs = [{title : "blog1" , contenet : "words"},
                {title : "blog2" , contenet : "words"},
                {title : "blog3" , contenet : "words"},
                {title : "blog4" , contenet : "words"},
                {title : "blog5" , contenet : "words"}];

const projects = [{title : "project1" , imgUrl: "img", url:"ufkdj", info : "info", githubUrl : "github"},
{title : "project2" , imgUrl: "img", url:"ufkdj", info : "info",githubUrl : "github"},
{title : "project3" , imgUrl: "img", url:"ufkdj", info : "info",githubUrl : "github"},
{title : "project4" , imgUrl: "img", url:"ufkdj", info : "info",githubUrl : "github"},
{title : "project5" , imgUrl: "img", url:"ufkdj", info : "info",githubUrl : "github"},
];

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

app.get('/loadProjects',(req,res)=>{
    let beginIndex = req.query.loadCount * 10;
    const projectCopy = [...projects];
    const projectsToSend = projectCopy.splice(beginIndex, 10) 
    res.status(200).send(projectsToSend);
});

app.get('/loadBlogs',(req,res)=>{
    let beginIndex = req.query.loadCount * 10;
    const blogCopy = [...blogs];
    const blogsToSend = blogCopy.splice(beginIndex, 10); 
    res.status(200).send(blogsToSend);
});

app.get('/loadBlog',(req,res)=>{
    let blogTitle = req.query.blogTitle;
    for(let i = 0; i < blogs.length; i++){
        if(blogs[i].title === blogTitle){
            res.status(200).send(blogs[i]);
        }
    }
});

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});