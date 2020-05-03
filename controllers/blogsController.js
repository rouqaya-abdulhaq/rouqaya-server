module.exports = (app , blogs) =>{
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

    app.put('/editBlog',(req,res)=>{
        let blogTitle = req.query.blogTitle;
        const updatedBlog = req.body.updatedBlog;
        for(let i = 0; i < blogs.length; i++){
            if(blogs[i].title === blogTitle){
                blogs[i] = updatedBlog;
            }
        }
        res.status(200).send(blogs);
    });

    app.delete('/removeBlog',(req,res)=>{
        const index = req.body.index;
        blogs.splice(index,1);
        res.status(200).send(blogs);
    });
}