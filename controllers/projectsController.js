const multer = require('multer');
const fs = require('fs');

const storage = multer.memoryStorage();
  
const uploadDisk = multer({storage : storage});

module.exports = (app ,client) => {
    app.post('/addProject',uploadDisk.single('img'),(req,res)=>{
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

    app.put('/editProject',uploadDisk.single('img'),(req,res)=>{
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
        img : req.file
    }
}

// const checkAndAssignImgUrl = (file) =>{
//     if(file){
//         return 'C:\\Users\\acer\\Desktop\\projects\\rouqaya-server\\' + file.path;
//     }else{
//         return "";
//     }
// }

const addProjectToDB = (project,client,res) =>{
    const query = addProjectQuery(project);
    client.query(query,(err,response)=>{
        if(err){
            res.status(403).send({message : "could not post project to DB"});
        }else{
            const id = response.rows[0].id;
            if(addProjectImg(project.img,client,id)){
                getProjectFromDB(id,client,res);  
            }
            else{
                res.status(403).send({message : "could not upload img to DB"})
            }
        }
    });
}

const addProjectImg = (imgFile,client,projectId) =>{
    const query = postProjectImgQuery(imgFile,projectId);
    client.query(query,(err,response)=>{
        if(err){
            console.log(err);
            return false;
        }else{
            console.log(response);
            return true;
        }
    })
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
    return `INSERT INTO projects(title,info,url,github)
    VALUES('${project.title}','${project.info}','${project.url}','${project.github}') 
    RETURNING id`; 
}

const editingProjectQuery = (editedProject) =>{
    return `UPDATE projects SET title = '${editedProject.title}',info = '${editedProject.info}',
    url = '${editedProject.url}', github = '${editedProject.github}'
    WHERE id = '${editedProject.id}' RETURNING id`;
}

const getProjectsQuery = (count) =>{
    const startIndex = count * 4;
    const endIndex = startIndex + 4;
    return `SELECT * FROM projects WHERE id <= '${endIndex}' AND id > '${startIndex}'`;
}

const postProjectImgQuery = (img,projectId) =>{
    return `INSERT INTO project_img(type,name,data,project_id)
    VALUES('img/png','${img.originalname}','${img}','${projectId}') 
    RETURNING id`; 
}