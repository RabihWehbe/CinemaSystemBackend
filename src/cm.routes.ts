import * as express from 'express'
import * as mongodb from 'mongodb'
import { json } from 'stream/consumers';
import { Cast } from './Cast';
import { collections } from './database';
import { Movie } from './Movie';

export const cmRouter = express.Router();
cmRouter.use(express.json());

//get movies of specified cast id:
cmRouter.get('/movies/:cid',async (req,res)=>{
    const cid = req.params.cid;
    try {
        const movies_ids = await collections.cms.find({Cid : new mongodb.ObjectId(cid)}).toArray();
        const Movies : any[] = [];

        for(const e of movies_ids){
            const movie : Movie = await collections.movies.findOne({_id: e.Mid});
            Movies.push(movie);
        }
        res.status(200).send(Movies)
    } catch (error) {
        res.status(500).send(error.message)
    }
});

//find casts of specified movie id:
cmRouter.get('/casts/:mid',async (req,res)=>{
    const mid = req.params.mid;
    try {
        const casts_ids = await collections.cms.find({Mid : new mongodb.ObjectId(mid)}).toArray();
        const Casts : any[] = [];

        for(const e of casts_ids){
            const cast : Cast = await collections.casts.findOne({_id : e.Cid});
            console.log(cast);
            Casts.push(cast);
        }
        res.status(200).send(Casts);
    } catch (error) {
        res.status(500).send(error.message)
    }
});

/*cmRouter.post('/',async (req,res)=>{
    try {
        const cm = req.body;
        const Mid = req.body.Mid;
        const Cid = req.body.Cid;
        let msg : string = 'no matcing ids: ';
        let ack : boolean = true;
        
        const resultc = await collections.casts.findOne({_id : new mongodb.ObjectId(Cid)});
        const resultm = await collections.movies.findOne({_id : new mongodb.ObjectId(Mid)});
        if(resultc === null){
            msg.concat(`no cast with id : ${Cid}`);
            ack = false;
        }
        if(resultm === null){
            msg.concat(`no movie with id : ${Mid}`);
            ack = false;
        }

        if(!ack){
            res.status(404).send(msg);
        }

        cm.Mid = new mongodb.ObjectId(Mid);
        cm.Cid = new mongodb.ObjectId(Cid);

        const result = await collections.cms.insertOne(cm); 
        
        if(result.acknowledged){
            res.status(201).send(`Created a new CastMovie: ID ${result.insertedId}`)
        }
        else{
            res.status(500).send("Failed to create a new Cast_Movie");
        }
    } catch (error) {
        res.status(400).send(`failed to create cm id`);
    }
})*/

cmRouter.post('/',async (req,res)=>{
    const values = req.body;
    const checkers = [];
    for(let i of values){
        let querym = {Mname : i.Mname}
        const movie = await collections.movies.findOne(querym);
        let queryc = {Cname : i.Cname};
        const cast = await collections.casts.findOne(queryc);
        if(movie === null || cast === null){
            checkers.push({Mname : i.Mname,Cname : i.Cname});
        }
        else{
            const cm = {Cid : cast._id,Mid : movie._id};
            await collections.cms.insertOne(cm);
        }
    }

    res.status(200).send({message : "done operations",ack : checkers});
})