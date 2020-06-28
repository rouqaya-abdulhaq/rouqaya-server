
module.exports = (app , client) =>{
    app.put('/postBlog' ,(req, res)=>{
        const blog = req.body.blog;
        addBlogToDB(blog,client,res);
    });
    
    app.get('/loadBlogs',(req,res)=>{
        const loadCount = req.query.loadCount;
        getBlogs(loadCount,client,res);
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
            res.status(500).send({message : "could not post blog to DB", success : false});
        }else{
            const id = response.rows[0].id;
            getBlogFromDB(id,client,res);
        }
    })
}

const getBlogs = (count,client,res) =>{
    const query = getBlogsQuery(count);
    client.query(query,(err ,response)=>{
        if(err){
            res.status(500).send({message : "could not load blogs from DB", success : false});
        }else{
            const serverRes = {
                blogs : [
                    ...response.rows
                ],
                success : true
            }
            res.status(200).send(serverRes);
        }
    })
}

const getLastFourBlogs = (client,res) =>{
    const query = getLastBlogsQuery(4);
    client.query(query,(err ,response)=>{
        if(err){
            res.status(500).send({message : "could not load blogs from DB", success : false});
        }else{
            const serverRes = {
                blogs : [
                    ...response.rows
                ],
                success : true
            }
            res.status(200).send(serverRes);
        }
    })
}

const getBlogFromDB = (blogId, client, res) =>{
    client.query(`SELECT * FROM blogs WHERE id = '${blogId}'`,(err, response)=>{
        if(err){
            res.status(500).send({message : "could not get blog from DB", success : false});
        }else{
            if(response.rows[0]){
                const serverRes = {
                    blog : {
                        ...response.rows[0]
                    },
                    success : true
                }
                res.status(200).send(serverRes); 
            }else{
                res.status(400).send({message : "the provided id does not match any blog", success : false}); 
            }
        }
    })
}

const editBlogInDB = (editBlog , client,res) =>{
    const query = editingBlogQuery(editBlog);
    client.query(query,(err, response)=>{
        if(err){
            res.status(500).send({message : "could not edit blog in DB", success : false});
        }else{
            if(response.rows[0]){
                const id = response.rows[0].id;
                getBlogFromDB(id,client,res);
            }else{
                res.status(400).send({message : "the id provided does not match any blog", success : false});
            }
        }
    });
}

const deleteBlogFromDB = (blogId, client, res) =>{
    client.query(`DELETE FROM blogs WHERE id = '${blogId}'`,(err, response)=>{
        if(err){
            res.status(500).send({message : "could not delete blog from DB", success : false});
        }else{
            const serverRes = {
                success : true
            }
            res.status(200).send(serverRes);
        }
    });
}

const postBlogQuery = (blog) =>{
    return `INSERT INTO blogs(title,content,img_url)
    VALUES('${blog.title}','${blog.content}','${blog.imgUrl}') 
    RETURNING id`; 
}

const getBlogsQuery = (count) =>{
    const startIndex = count * 10;
    return `SELECT * FROM blogs WHERE id >= '${startIndex}' LIMIT 10`;
}

const getLastBlogsQuery = (limit) =>{
    return `SELECT * FROM blogs ORDER BY id DESC LIMIT ${limit}`;
}

const editingBlogQuery = (editedBlog) =>{
    return `UPDATE blogs SET title = '${editedBlog.title}',content = '${editedBlog.content}',img_url = '${editedBlog.imgUrl}'
    WHERE id = '${editedBlog.id}' RETURNING id`;
}
