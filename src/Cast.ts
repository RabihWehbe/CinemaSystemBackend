import * as mongodb from 'mongodb';


export interface Cast{
    Cname : string;
    Cdesc : string;
    Cnationality : string;
    Cimg : string;
    _id? : mongodb.ObjectId;
}

/*export class CastContainer implements Cast{
    Cname: string;
    Cdesc: string;
    Cnationality: string;
    Cimg: string;
    _id?: mongodb.ObjectId;
}*/