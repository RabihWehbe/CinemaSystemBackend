import * as express from 'express'
import * as mongodb from 'mongodb'
import { collections } from './database';
import { filePath } from './helpers/funcs';
import * as dotenv from 'dotenv';
import { Movie } from './Movie';
const storage = require("./helpers/movieHelpers");
const fs = require('fs');

dotenv.config();
const movieURL = process.env.movieURL;


export const movieRouter = express.Router();
movieRouter.use(express.json());

movieRouter.get('/',async (req,res)=>{
    try {
        const movies = await collections.movies.find({}).toArray();
        res.status(200).send(movies)
    } catch (error) {
        res.status(500).send(error.message)
    }
});


movieRouter.get('/:id',async (req,res)=>{
    const id = req?.params?.id;
    try {
        const query = {_id : new mongodb.ObjectId(id)};
        const movie = await collections.movies.findOne(query);
        res.status(200).send(movie);
    } catch (error) {
        res.status(404).send(`failed to find movie with id : ${id}`);
    }
})

movieRouter.post('/',storage,async (req,res)=>{
    try {
        if(!req.file){
            res.status(400).send('No image provided');
        }
        const movie : Movie = req.body;
        movie.Mimg = movieURL+req.file.filename;

        const result = await collections.movies.insertOne(movie);
        if(result.acknowledged){
            res.status(201).send({msg:`Created a new movie: ID ${result.insertedId}`
        ,_id : result.insertedId,Mimg : movie.Mimg});
        }
        else{
            res.status(500).send("Failed to create a new movie");
        }
    } catch (error) {
        res.status(400).send(`failed to create movie id`);
    }
})


movieRouter.delete('/:id',async (req,res)=>{
    try {
        const id = req.params.id;
        const query = {_id : new mongodb.ObjectId(id)};
        
        const doc : Movie = await collections.movies.findOne(query);
        const filepath = filePath(doc.Mimg);

        //check for file deletion process
        let check = 0;
        let msg = '';

        fs.unlinkSync(filepath, (err : Error)=>{
            if(err){
                console.log(err);
                msg = err.message;
            }
            else console.log("image deleted successfully");
        });

        if(check === 1){
            res.status(500).send(msg);
        }

        else{
            const result = await collections.movies.deleteOne(query);

            if (result && result.deletedCount) {
                res.status(202).send({msg : `We Removed Movie with id : ${id}`,doc})
            } else if (!result){
                res.status(400).send(`Failed to remove movie with id : ${id}`)
            } if (!result.deletedCount){
                res.status(404).send(`Failed to find movie with id : ${id}`)
            }
        }
        
    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
})