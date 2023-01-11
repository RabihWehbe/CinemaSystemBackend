import * as dotenv from 'dotenv';
import cors from 'cors'
import express from 'express'
import {connectToDatabase} from './database'
import { castRouter } from './cast.routes';
import { movieRouter } from './movie.routes';
import { cmRouter } from './cm.routes';
import {adminRouter} from './admin.routes'
import path from 'path';

dotenv.config();

const {URI} = process.env;

if(!URI){
    console.log("no uri environment variable");
    process.exit(1);
}

connectToDatabase(URI)
.then(()=>{
    const app = express();

    app.use(cors());
    app.use('/casts',castRouter);
    app.use('/movies',movieRouter);
    app.use('/casts-movies',cmRouter);
    app.use('/admins',adminRouter);

    app.use('/uploads',express.static(path.join('src/uploads')));

    app.listen(5200,()=>{console.log("app is listening on post 5200")});
})
.catch(error=>console.error(error));