module.exports = (app,client) => {
    app.post('/translateBlogArabic' , (req , res)=>{
        const translatedBlog = req.body.translatedBlog;
        addArabicBlogToDB(translatedBlog,client,res);
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

const postArabicBlogQuery = (blog) =>{
    return `INSERT INTO arabic_blogs(id,title,content)
    VALUES('${blog.id}','${blog.title}','${blog.content}') 
    RETURNING id`; 
}