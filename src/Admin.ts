import * as mongodb from "mongodb";

export interface Admin{
    _id? : mongodb.ObjectId;
    Aname : string;
    Apassword : string;
}