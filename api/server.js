// IMPORTS AT THE TOP
const express = require("express");
const Dog = require("./dog-model");

// INSTANCE OF EXPRESS APP
const server = express();

// GLOBAL MIDDLEWARE
server.use(express.json()); //! this is so express can read json

// ENDPOINTS
server.get("/hello-world",(req,res)=> {
    res.status(200).json({ message : "hello, world"})
})

server.get("/api/dogs",async(req,res) => {
    try {
        const dogs = await Dog.findAll()
        res.status(200).json(dogs)
    } catch(err) {
        res.status(500).json({message : `Error fetching dogs : ${err.message}`});
    }
})

server.get("/api/dogs/:id",async(req,res)=> {
    try {
        const {id} = req.params;
        const dogs = await Dog.findById(id)
        if (!dogs) {
            res.status(404).json({message : `no dog with id ${id}`});
        } else {
            res.status(200).json(dogs); 
        }
    } catch {
        res.status(500).json({message : `Error fetching dog ${req.params.id} : ${err.message}`});
    }
})
// [GET]    /             (Hello World endpoint)
// [GET]    /api/dogs     (R of CRUD, fetch all dogs)
// [GET]    /api/dogs/:id (R of CRUD, fetch dog by :id)
// [POST]   /api/dogs     (C of CRUD, create new dog from JSON payload)
// [PUT]    /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)

// EXPOSING THE SERVER TO OTHER MODULES

module.exports = server //! how to flesh out express http server