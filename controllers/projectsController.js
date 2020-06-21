module.exports = (app ,client) => {
    app.post('/addProject',(req,res)=>{
        const project = extractProjectFromReq(req);
        addProjectToDB(project,client,res);
    });

    app.get('/loadProjects',(req,res)=>{
        const loadCount = req.query.loadCount;
        getProjects(loadCount,client,res);
    });

    app.get('/loadProject',(req,res)=>{
        let projectId = req.query.projectId;
        getProjectFromDB(projectId,client,res);
    });

    app.put('/editProject',(req,res)=>{
        const updatedProject = extractProjectFromReq(req);
        editProjectInDB(updatedProject,client,res);
    });

    app.delete('/removeProject',(req,res)=>{
        const id = req.body.id;
        deleteProjectFromDB(id,client,res);
    });
}

const extractProjectFromReq = (req) =>{
    return{
        id : req.body.id,
        title : req.body.title,
        info : req.body.info,
        url : req.body.url,
        github : req.body.github,
        imgUrl : req.body.imgUrl
    }
}

const addProjectToDB = (project,client,res) =>{
    const query = addProjectQuery(project);
    client.query(query,(err,response)=>{
        if(err){
            res.status(403).send({message : "could not post project to DB"});
        }else{
            const id = response.rows[0].id;
            getProjectFromDB(id,client,res);  
        }
    });
}

const editProjectInDB = (editedProject , client,res) =>{
    const query = editingProjectQuery(editedProject);
    client.query(query,(err, response)=>{
        if(err){
            res.status(403).send({message : "could not edit project in DB"});
        }else{
            if(response.rows[0]){
                const id = response.rows[0].id;
                getProjectFromDB(id,client,res);
            }else{
                res.status(403).send({message : "the id provided does not match any project"});
            }
        }
    });
}

const deleteProjectFromDB = (projectId, client, res) =>{
    client.query(`DELETE FROM projects WHERE id = '${projectId}'`,(err, response)=>{
        if(err){
            res.status(403).send({message : "could not delete project from DB"});
        }else{
            res.status(204).send(response);
        }
    });
}

const getProjectFromDB = (projectId, client, res) => {
    client.query(`SELECT * FROM projects WHERE id = '${projectId}'`,(err, response)=>{
        if(err){
            res.status(403).send({message : "could not get project from DB"});
        }else{
            if(response.rows[0]){
                res.status(200).send(response.rows[0]); 
            }else{
                res.status(403).send({message : "the provided id does not match any project"}); 
            }
        }
    });
}

const getProjects = (count,client,res) =>{
    const query = getProjectsQuery(count);
    client.query(query,(err ,response)=>{
        if(err){
            console.log(err);
            res.status(403).send({message : "could not load projects from DB"});
        }else{
            res.status(200).send(response.rows);
        }
    })
}

const addProjectQuery = (project) =>{
    return `INSERT INTO projects(title,info,url,github,img_url)
    VALUES('${project.title}','${project.info}','${project.url}','${project.github}','${project.imgUrl}') 
    RETURNING id`; 
}

const editingProjectQuery = (editedProject) =>{
    return `UPDATE projects SET title = '${editedProject.title}',info = '${editedProject.info}',
    url = '${editedProject.url}', github = '${editedProject.github}', img_url = '${editedProject.imgUrl}'
    WHERE id = '${editedProject.id}' RETURNING id`;
}

const getProjectsQuery = (count) =>{
    const startIndex = count * 4;
    const endIndex = startIndex + 4;
    return `SELECT * FROM projects WHERE id <= '${endIndex}' AND id > '${startIndex}'`;
}
