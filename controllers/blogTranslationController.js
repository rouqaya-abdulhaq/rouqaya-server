module.exports = (app,client) => {
    app.post('/translateBlogArabic' , (req , res)=>{
        const translatedBlog = req.body.translatedBlog;
        addArabicBlogToDB(translatedBlog,client,res);
    });

    app.post('/EditBlogArabic' , (req , res)=>{
        const translatedBlog = req.body.translatedBlog;
        editArabicBlogInDB(translatedBlog,client,res);
    });    

    app.get('/getArabicBlog',(req,res)=>{
        const blogId = req.query.blogId;
        getArabicBlogFromDB(blogId,client,res); 
    });

    app.get('/getArabicBlogs',(req,res)=>{
        const loadCount = req.query.loadCount;
        getArabicBlogs(loadCount,client,res); 
    });
}

const getArabicBlogFromDB = (blogId, client, res) =>{
    client.query(`SELECT * FROM arabic_blogs WHERE id = '${blogId}'`,(err, response)=>{
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

const addArabicBlogToDB = (blog,client,res) =>{
    const query = postArabicBlogQuery(blog);
    client.query(query,(err,response)=>{
        if(err){
            res.status(500).send({message : "could not post blog to DB", success : false});
        }else{
            const id = response.rows[0].id;
            getArabicBlogFromDB(id,client,res);
        }
    })
}

const editArabicBlogInDB = (editBlog , client,res) =>{
    const query = editingArabicBlogQuery(editBlog);
    client.query(query,(err, response)=>{
        if(err){
            res.status(500).send({message : "could not edit blog in DB", success : false});
        }else{
            if(response.rows[0]){
                const id = response.rows[0].id;
                getArabicBlogFromDB(id,client,res);
            }else{
                res.status(400).send({message : "the id provided does not match any blog", success : false});
            }
        }
    });
}

const getArabicBlogs = (loadCount, client, res) =>{
    const query = getArabicBlogsQuery(loadCount);
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

const postArabicBlogQuery = (blog) =>{
    return `INSERT INTO arabic_blogs(id,title,content)
    VALUES('${blog.id}','${blog.title}','${blog.content}') 
    RETURNING id`; 
}

const editingArabicBlogQuery = (editedBlog) =>{
    return `UPDATE arabic_blogs SET title = '${editedBlog.title}',content = '${editedBlog.content}'
    WHERE id = '${editedBlog.id}' RETURNING id`;
}

const getArabicBlogsQuery = (count) =>{
    const startIndex = count * 10;
    return `SELECT * FROM arabic_blogs WHERE id >= '${startIndex}' LIMIT 10`;
}