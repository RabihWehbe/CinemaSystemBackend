import * as express from 'express'
import * as mongodb from 'mongodb'
import { collections } from './database';

export const adminRouter = express.Router();
adminRouter.use(express.json());

adminRouter.post('/',async (req,res)=>{
    const admin = req.body;
    const check = await collections.admins.findOne({$and:[{Aname : req.body.Aname},{Apassword : req.body.Apassword}]});

    try {
        if(check){
            res.status(409).send("account already exists under the provided informations");
        }

        const result = await collections.admins.insertOne(admin);
        if(result.acknowledged){
            res.status(200).send(`new admin added with id ${result.insertedId}`);
        }
        else res.status(500).send("couldn't create a new admin document");
    } catch (error) {
        res.status(400).send(error.message);
    }
})

adminRouter.post('/authenticate',async (req,res)=>{
    try {
        const user = req.body;
        const query = {Aname : user.Aname};
        const Foundadmin = await collections.admins.findOne(query);
        const authorize = {ack : false, msg : ""};
        if(Foundadmin){
            console.log(Foundadmin);
            //compare the passwords:
            if(user.Apassword !== Foundadmin.Apassword){
                authorize.msg = "Incorrect password";
                res.status(401).send(authorize);
            }
            else{
                authorize.ack = true;
                authorize.msg = "valid login";
                res.status(200).send(authorize);
            }
        }
        else{
            authorize.msg = user.Aname;
            res.status(403).send(authorize);
        }
    } catch (error) {
        res.send(400).send(error.message);
    }
    
})