import * as mongodb from "mongodb";

export interface CM{
    Cid : mongodb.ObjectId;
    Mid : mongodb.ObjectId;
    _id?:mongodb.ObjectId;
}