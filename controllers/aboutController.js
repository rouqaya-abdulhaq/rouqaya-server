module.exports = (app, client) =>{
    app.get('/loadAbout',(req,res)=>{
        client.query(`SELECT content FROM about WHERE id = 1`,(err,response)=>{
            if(err){
                DbErrorHandler(res);
            }else{
                sendAbouteHandler(res,response);
            }
        });
    });
}

const DbErrorHandler = (res) =>{
    res.status(500).send({message : "could not get about page from DB", success : false});
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