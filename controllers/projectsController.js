module.exports = (app ,client) => {
    app.post('/addProject',(req,res)=>{
        const project = req.body.project;
        addProjectToDB(project,client,res);
    });

    app.get('/loadProjects',(req,res)=>{
        const loadCount = req.query.loadCount;
        getProjects(loadCount,client,res);
    });

    app.get('/getProjectsCount',(req,res)=>{
        getProjectsCount(client,res);
    });

    app.get('/loadProject',(req,res)=>{
        let projectId = req.query.projectId;
        getProjectFromDB(projectId,client,res);
    });

    app.put('/editProject',(req,res)=>{
        const updatedProject = req.body.updatedProject;
        editProjectInDB(updatedProject,client,res);
    });

    app.delete('/removeProject',(req,res)=>{
        const id = req.body.id;
        deleteProjectFromDB(id,client,res);
    });
}

const addProjectToDB = (project,client,res) =>{
    const query = addProjectQuery(project);
    client.query(query,(err,response)=>{
        if(err){
            res.status(500).send({message : "could not post project to DB", success : false});
        }else{
            const id = response.rows[0].id;
            getProjectFromDB(id,client,res);  
        }
    });
}

const getProjects = (count,client,res) =>{
    const query = getProjectsQuery(count);
    client.query(query,(err ,response)=>{
        if(err){
            res.status(500).send({message : "could not load projects from DB", success : false});
        }else{
            const serverRes = {
                projects : [
                    ...response.rows
                ],
                success : true
            }
            res.status(200).send(serverRes);
        }
    })
}

const getProjectsCount = (client,res) =>{
    client.query('SELECT COUNT(*) FROM projects',(err,response)=>{
        if(err){
            res.status(500).send({message : "could not get projects count from DB", success : false})
        }else{
            let count = response.rows[0].count < 10 ? 0 : response.rows[0].count / 10;
            if(response.rows[0].count % 10 >= 1 && response.rows[0].count > 10){
                count += 1
            }
            const data = {
                count : count,
                success : true
            }
            res.status(200).send(data);
        }
    });
}

const getProjectFromDB = (projectId, client, res) => {
    client.query(`SELECT * FROM projects WHERE id = '${projectId}'`,(err, response)=>{
        if(err){
            res.status(500).send({message : "could not get project from DB", success : false});
        }else{
            if(response.rows[0]){
                const serverRes = {
                    project : {
                        ...response.rows[0]
                    },
                    success : true
                }
                res.status(200).send(serverRes); 
            }else{
                res.status(400).send({message : "the provided id does not match any project", success : false}); 
            }
        }
    });
}

const editProjectInDB = (editedProject , client,res) =>{
    const query = editingProjectQuery(editedProject);
    client.query(query,(err, response)=>{
        if(err){
            res.status(500).send({message : "could not edit project in DB", success : false});
        }else{
            if(response.rows[0]){
                const id = response.rows[0].id;
                getProjectFromDB(id,client,res);
            }else{
                res.status(400).send({message : "the id provided does not match any project", success : false});
            }
        }
    });
}

const deleteProjectFromDB = (projectId, client, res) =>{
    client.query(`DELETE FROM projects WHERE id = '${projectId}'`,(err, response)=>{
        if(err){
            res.status(500).send({message : "could not delete project from DB", success : false});
        }else{
            const serverRes = {
                success : true
            }
            res.status(200).send(serverRes);
        }
    });
}


const addProjectQuery = (project) =>{
    return `INSERT INTO projects(title,info,url,github,img_url,disable_url)
    VALUES('${project.title}','${project.info}','${project.url}','${project.github}','${project.imgUrl}','${project.disableUrl}') 
    RETURNING id`; 
}

const getProjectsQuery = (count) =>{
    const startIndex = count * 4;
    return `SELECT * FROM projects WHERE id >= '${startIndex}' LIMIT 4`;
}

const editingProjectQuery = (editedProject) =>{
    return `UPDATE projects SET title = '${editedProject.title}',info = '${editedProject.info}',
    url = '${editedProject.url}', github = '${editedProject.github}', img_url = '${editedProject.imgUrl}', disable_url = '${editedProject.disableUrl}'
    WHERE id = '${editedProject.id}' RETURNING id`;
}
