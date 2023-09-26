// IMPORTS AT THE TOP
const express = require("express");
const Dog = require("./dog-model");

// INSTANCE OF EXPRESS APP
const server = express();

// GLOBAL MIDDLEWARE
server.use(express.json()); //! this is so express can read json

// ENDPOINTS

//!get
server.get("/hello-world",(req,res)=> {
    res.status(200).json({message : "hello world"}); 
})

server.get("/api/dogs",async(req,res) => {
    try {
        const dogs = await Dog.findAll();
        res.status(200).json(dogs);
    }catch {
        res.status(500).json({message : "Error fetching dogs"})
    }
})

server.get("/api/dogs/:id",async(req,res)=> {
    try {
        const {id} = req.params;
        const dogById = await Dog.findById(id);
        if (dogById) {
            res.status(200).json(dogById);
        } else {
            res.status(404).json({message : `dog with id: ${id} could not be found`})
        }
    } catch {
        res.status(500).json({message : "Error fetching dogs"})
    }
})
//!get
//!post
server.post("/api/dogs",async(req,res)=> {
    try {
        const {name,weight} = req.body; 
        const newDog = await Dog.create({name,weight})
        if (!name || !weight) {
            res.status(422).json({message : `Error creating dog with missing ${!name ? "name" : "weight"}`})
        } else {
            res.status(201).json({message : "success creating dog",
            data : newDog,
        }); 
        }
    } catch (err) {
        res.status(500).json({message : `Error creating dog : ${err.message}`}); 
    }
})
//!post
//!put
server.put("/api/dogs/:id",async(req,res)=> {
    try{
        const {weight,name} = req.body;
        const {id} = req.params;
        const changes = {name,weight};
        if (!weight || !name) {
            res.status(422).json({message : `Error creating dog with missing ${!name ? "name" : "weight"}`})
        } else {
            const updatedDog = await Dog.update(id,changes)
            if (!updatedDog) {
                res.status(404).json({message : `dog with id: ${id} not found`})
            } else {
            res.status(200).json({message : "dog was updated successfully", data : updatedDog});
            }
        }
    }catch (err) {
        res.status(500).json({message : `Error updating dog : ${err.message}`});
    }
})
//!put
//!delete
server.delete("/api/dogs/:id",async(req,res)=> {
    try {
        const {id} = req.params;
        const deletedDog = await Dog.delete(id)
        if (!deletedDog) {
            res.status(422).json({message : `Dog with id: ${id} does not exist`});
        } else {
            res.status(200).json({message : "success deleting dog", data : deletedDog});
        }
    } catch (err) {
        res.status(500).json({message : "Error deleting dog"});
    } 
})
//!delete
// [GET]    /             (Hello World endpoint)
// [GET]    /api/dogs     (R of CRUD, fetch all dogs)
// [GET]    /api/dogs/:id (R of CRUD, fetch dog by :id)
// [POST]   /api/dogs     (C of CRUD, create new dog from JSON payload)
// [PUT]    /api/dogs/:id (U of CRUD, update dog with :id using JSON payload)
// [DELETE] /api/dogs/:id (D of CRUD, remove dog with :id)

// EXPOSING THE SERVER TO OTHER MODULES

module.exports = server //! how to flesh out express http server

