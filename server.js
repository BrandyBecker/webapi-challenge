const express = require('express')
const projModel = require('./data/helpers/projectModel')
const actModel = require('./data/helpers/actionModel')

const server = express()
server.use(express.json())

//GET: '/' 
server.get('/projects', (req,res)=>{
    projModel.get()
    .then(projects => {
        res.status(200).json(projects)
    })
})

//GET: '/projects/:id' 
server.get('/projects/:id', validateAction, (req,res)=>{
    projModel.get(req.project)
        .then(project => {
            res.status(200).json(action)
        })
        .catch(()=>{
            res.status(500).json({Error: 'AHG! Could not RETRIEVE an Action from the Database!'})
        })
})


//POST: '/projects' 
server.post('/projects', (req,res)=>{
    const {name, description} = req.body
    
    !name||!description
    ?
    res.status(400).json({Error: 'HALT! You MUST provide both a Name and a Description!'})
    :
    projModel.insert(req.body)

    .then(post=>{
        res.status(201).json(post)
    })
    .catch(()=>{
        res.status(500).json({Error: 'AH! There was an ERROR adding the Post to the Database!'})
    })

})

//PUT: '/projects/:id'
server.put('/projects/:id', validatePost, (req,res)=>{
    const {name, description} = req.body

    !name||!description
    ?
    res.status(400).json({Error: 'OOF! You must provide BOTH a Name and a Description!'})
    :
    projModel.update(req.project, req.body)

    .then(post=>{
        res.status(200).json(post)
    })
    .catch(()=>{
        res.status(500).json({Error: 'UGH! There was an ERROR updating the Post in the Database!'})
    })
})

//DELETE: '/projects/:id' 
server.delete('/projects/:id', validatePost, (req,res)=>{
    projModel.remove(req.project)
        .then(number => {
            res.status(200).json({Success: `${number}s' items were SUCESSFULLY DELETED from the Database!`})
        })
        .catch(()=>{
            res.status(500).json({Error: 'AHK! There was an ERROR when trying to REMOVE the Post from the Database!'})
        })
})

//-----------------------

//GET: '/projects/:id/actions' 
server.get('/projects/:id/actions', validatePost, (req,res)=> {
    projModel.getProjectActions(req.project)
    .then(actions => {
        res.status(200).json(actions)
    })
    .catch(()=> {
        res.status(500).json({Error: 'RIP! There was an ISSUE getting the actions for that Project from the Database!'})
    })
})

//GET: '/actions/:id' 
server.get('/actions/:id', validateAction, (req,res)=>{
    actModel.get(req.action)
        .then(action => {
            res.status(200).json(action)
        })
        .catch(()=>{
            res.status(500).json({Error: 'AHG! Could not RETRIEVE an Action from the Database!'})
        })
})

//POST: '/projects/:id/actions'
server.post('/projects/:id/actions', validatePost, (req,res)=>{
    const {description, notes} = req.body
    req.body.project_id = req.project

    !description || !notes
    ?
    res.status(400).json({Denied: `You MUST Provide a Description and Notes!`})
    :
    actModel.insert(req.body)
    
    .then(action=>{
        res.status(201).json(action)
    })
    .catch(error => {
        res.status(500).json({ Error: 'AWH! There was an ISSUE creating the Action for the Project!'})
    })
})

//PUT: '/actions/:id'
server.put('/actions/:id', validateAction, (req,res)=>{
    const {description, notes} = req.body;

    !description || !notes
    ?
    res.status(400).json({Denied: 'You MUST provide a description and notes.'})
    :
    actModel.update(req.action, req.body)

    .then(action=>{
        res.status(200).json(action)
    })
    .catch(()=>{
        res.status(500).json({Error: 'OPE! There was an error updating the action!'})
    })
})

//DELETE: '/actions/:id'
server.delete('/actions/:id', validateAction, (req,res)=>{
    actModel.remove(req.action)
    .then(num => {
        res.status(200).json({Sucess: `${num}s' items were sucessfully DELETED!`})
    })
    .catch(() => {
        res.status(500).json({Error: "OOF! There was an ERROR Deleting the Action from the Database!"})
    })
})

server.get('/', (req, res) => {
    res.send('Yes, you are indeed- Not Crazy.')
})

function validatePost(req, res, next) {
    projModel.get(req.params.id)
        .then(got => {
            if (!got) {
                res.status(400).json({Error: "AWK! There is NO Project with that ID!"})
            } else {
                req.body.project_id = got.project_id
                req.project = req.params.id
                next()
            }
        })
} 

function validateAction(req, res, next) {
    actModel.get(req.params.id)
        .then(got => {
            if (!got) {
                res.status(400).json({Error: "OOF! There is NO Action with that ID!"})
            } else {
                req.action = req.params.id
                next()
            }
        })
}

module.exports=server