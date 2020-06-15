module.exports = (app , blogs, client) =>{
    app.put('/postBlog', (req, res)=>{
        const blog = {
            title : req.body.title,
            content : req.body.content
        }
        addBlogToDB(blog,client,res);
    });

    app.get('/loadBlogs',(req,res)=>{
        let beginIndex = req.query.loadCount * 10;
        const blogCopy = [...blogs];
        const blogsToSend = blogCopy.splice(beginIndex, 10); 
        res.status(200).send(blogsToSend);
    });

    app.get('/loadLastBlogs',(req,res)=>{
        const blogCopy = [...blogs];
        const blogsToSend = blogCopy.slice(-4); 
        res.status(200).send(blogsToSend);
    });
    
    app.get('/loadBlog',(req,res)=>{
        let blogId = req.query.blogId;
        getBlogFromDB(blogId,client,res);
    });

    app.put('/editBlog',(req,res)=>{
        const updatedBlog = req.body.updatedBlog;
        editBlogInDB(updatedBlog,client,res);
    });

    app.delete('/removeBlog',(req,res)=>{
        const id = req.body.id;
        deleteBlogFromDB(id,client,res);
    });
}

const addBlogToDB = (blog,client,res) =>{
    const query = postBlogQuery(blog);
    client.query(query,(err,response)=>{
        if(err){
            res.status(403).send({message : "could not post blog to DB"});
        }else{
            const id = response.rows[0].id;
            getBlogFromDB(id,client,res);
        }
    })
}

const editBlogInDB = (editBlog , client,res) =>{
    const query = editingBlogQuery(editBlog);
    client.query(query,(err, response)=>{
        if(err){
            res.status(403).send({message : "could not edit blog in DB"});
        }else{
            if(response.rows[0]){
                const id = response.rows[0].id;
                getBlogFromDB(id,client,res);
            }else{
                res.status(403).send({message : "the id provided does not match any blog"});
            }
        }
    });
}

const deleteBlogFromDB = (blogId, client, res) =>{
    client.query(`DELETE FROM blogs WHERE id = '${blogId}'`,(err, response)=>{
        if(err){
            res.status(403).send({message : "could not delete blog from DB"});
        }else{
            res.status(204).send(response);
        }
    });
}

const getBlogFromDB = (blogId, client, res) =>{
    client.query(`SELECT * FROM blogs WHERE id = '${blogId}'`,(err, response)=>{
        if(err){
            res.status(403).send({message : "could not get blog from DB"});
        }else{
            if(response.rows[0]){
                res.status(200).send(response.rows[0]); 
            }else{
                res.status(403).send({message : "the provided id does not match any blog"}); 
            }
        }
    })
}

const postBlogQuery = (blog) =>{
    return `INSERT INTO blogs(title,content)
    VALUES('${blog.title}','${blog.content}') 
    RETURNING id`; 
}

const editingBlogQuery = (editedBlog) =>{
    return `UPDATE blogs SET title = '${editedBlog.title}',content = '${editedBlog.content}'
    WHERE id = '${editedBlog.id}' RETURNING id`;
}