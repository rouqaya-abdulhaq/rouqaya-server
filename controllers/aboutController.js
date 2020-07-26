module.exports = (app, client) =>{
    app.get('/loadAbout',(req,res)=>{
        client.query(`SELECT content FROM about WHERE id = 1`,(err,response)=>{
            if(err){
                DbErrorHandler(res,"could not get about page from DB");
            }else{
                sendAbouteHandler(res,response);
            }
        });
    });

    app.put('/editAbout',(req,res)=>{
        const newContent = req.body.data.content;
        const query = editAboutQuery(newContent);
        client.query(query,(err,response)=>{
            if(err){
                DbErrorHandler(res,"could not edit about page");
            }else{
                sendAbouteHandler(res,response)
            }
        });
    });
}

const DbErrorHandler = (res,msg) =>{
    res.status(500).send({message : msg, success : false});
}

const sendAbouteHandler = (res,DBresponse) =>{
    if(DBresponse.rows[0]){
        const serverRes = {
            about : {
                ...DBresponse.rows[0]
            },
            success : true
        }
        res.status(200).send(serverRes); 
    }else{
        res.status(400).send({message : "the provided id does not match the about page id", success : false}); 
    }
}


const editAboutQuery = (newContent) =>{
    return `UPDATE about SET content ='${newContent}' WHERE id = 1 RETURNING content`;
}