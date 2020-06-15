module.exports = (app , blogs, client) =>{
    app.put('/postBlog', (req, res)=>{
        const blog = {
            title : req.body.title,
            content : req.body.content
        }
        addBlogToDB(blog,client,res);
    });
    //calculate load count to send 10 blogs from count
    app.get('/loadBlogs',(req,res)=>{
        getLastTenBlogs(client,res);
    });

    app.get('/loadLastBlogs',(req,res)=>{
        getLastFourBlogs(client,res);
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

const getLastTenBlogs = (client,res) =>{
    const query = getBlogsQuery(10);
    client.query(query,(err ,response)=>{
        if(err){
            res.status(403).send({message : "could not load blogs from DB"});
        }else{
            res.status(200).send(response.rows);
        }
    })
}

const getLastFourBlogs = (client,res) =>{
    const query = getBlogsQuery(4);
    client.query(query,(err ,response)=>{
        if(err){
            res.status(403).send({message : "could not load blogs from DB"});
        }else{
            res.status(200).send(response.rows);
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

const getBlogsQuery = (limit) =>{
    return `SELECT * FROM blogs ORDER BY id DESC LIMIT ${limit}`;
}