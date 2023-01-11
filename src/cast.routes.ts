import * as express from 'express'
import * as mongodb from 'mongodb'
import { collections } from './database';
import * as dotenv from 'dotenv';
import { filePath } from './helpers/funcs';
import path from 'path';
import { Cast } from './Cast';
const storage = require("./helpers/castHelpers");

const fs = require('fs');

dotenv.config();

const castURL = process.env.castURL;

export const castRouter = express.Router();
castRouter.use(express.json());

//castRouter.use('/uploads',express.static(path.join('src/uploads')));

castRouter.get('/',async (req,res)=>{
    try {
        const casts = await collections.casts.find({}).toArray();
        res.status(200).send(casts)
    } catch (error) {
        res.status(500).send(error.message)
    }
});


castRouter.get('/:id',async (req,res)=>{
    const id = req?.params?.id;
    try {
        const query = {_id : new mongodb.ObjectId(id)};
        const cast = await collections.casts.findOne(query);
        res.status(200).send(cast);
    } catch (error) {
        res.status(404).send(`failed to find cast with id : ${id}`);
    }
})

castRouter.post('/',storage,async (req,res)=>{
    try {
        if(!req.file){
            res.status(400).send('No image provided');
        }
        const cast : Cast  = req.body;
        cast.Cimg = castURL + req.file.filename;

        /*
        console.log(req.file.filename);
        console.log(cast);
        res.status(201).send(`Trying to print successfully`)
        */


        const result = await collections.casts.insertOne(cast);
        if(result.acknowledged){
            res.status(201).send({msg : `Created a new cast: ID ${result.insertedId}`});
        }
        else{
            res.status(500).send("Failed to create a new cast");
        }
    } catch (error) {
        console.log(error.message);
        res.status(400).send(`failed to create cast id`);
    }
})


castRouter.delete('/:id',async (req,res)=>{
    try {
        const id = req.params.id;
        const query = {_id : new mongodb.ObjectId(id)};
        
        const doc = await collections.casts.findOne(query);
        const filepath = filePath(doc.Cimg);

        //check for file deletion process
        let check = 0;
        let msg = '';

        fs.unlinkSync(filepath, (err : Error)=>{
            if(err){
                console.log("entered Here!!!!!!");
                check = 1;
                console.log(check);
                msg = err.message;
            }
            else console.log("image deleted successfully");
        });

        if(check === 1){
            console.log("we entered when check = "+check);
            res.status(500).send(msg);
        }

        else{
            console.log("we entered when check = "+check);
            const result = await collections.casts.deleteOne(query);

            if (result && result.deletedCount) {
                res.status(202).send(`We Removed Cast with id : ${id}`)
            } else if (!result){
                res.status(400).send(`Failed to remove Removed Cast with id : ${id}`)
            } if (!result.deletedCount){
                res.status(404).send(`Failed to find Removed Cast with id : ${id}`)
            }
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
})