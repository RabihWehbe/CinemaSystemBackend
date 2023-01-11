import * as mongodb from 'mongodb';

export interface Movie{
    Mname : string;
    Mgenere : string;
    Mrate : number;
    Myear : string;
    Mimg : string;
    _id? : mongodb.ObjectId;
}