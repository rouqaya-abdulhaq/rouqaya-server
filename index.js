const express = require("express");
const path = require("path");

const app = express();
const port = process.env.PORT || '8000';

const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended : false}));

app.use(bodyParser.json());

app.get('/', (req,res)=>{
    res.status(200).send("initial setup");
});

app.post('/postBlog', (req, res)=>{
    const title = req.body.title;
    const content = req.body.content;
    const blog = {
        title : title,
        content : content
    }
    res.status(200).send(blog);
})

app.listen(port, () => {
    console.log(`Listening to requests on http://localhost:${port}`);
});