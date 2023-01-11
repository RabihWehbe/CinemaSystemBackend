import * as mongodb from "mongodb";
import { Admin } from "./Admin";
import { Cast } from "./Cast";
import { CM } from "./CM";
import { Movie } from "./Movie";
 
export const collections: {
   casts?: mongodb.Collection<Cast>;   
   movies?: mongodb.Collection<Movie>;   
   cms? : mongodb.Collection<CM>;
   admins? : mongodb.Collection<Admin>;
} = {};
 
export async function connectToDatabase(uri: string) {
   const client = new mongodb.MongoClient(uri);
   await client.connect();
 
   const db = client.db("CinemaDB");
   await applySchemaValidation_Cast(db);
   await applySchemaValidation_Movie(db);
   await applySchemaValidation_CM(db);
   await applySchemaValidation_Admin(db);
 
   const castsCollection = db.collection<Cast>("casts");
   collections.casts = castsCollection;

   const moviesCollection = db.collection<Movie>("movies");
   collections.movies = moviesCollection;

   const cmsCollection = db.collection<CM>("cast-movies");
   collections.cms = cmsCollection;

   const adminsCollection = db.collection<Admin>("admins");
   collections.admins = adminsCollection;
}
 
// Update our existing collection with JSON schema validation so we know our documents will always match the shape of our Employee model, even if added elsewhere.
// For more information about schema validation, see this blog series: https://www.mongodb.com/blog/post/json-schema-validation--locking-down-your-model-the-smart-way
async function applySchemaValidation_Cast(db: mongodb.Db) {
   const jsonSchema = {
       $jsonSchema: {
           bsonType: "object",
           required: ["Cname", "Cdesc", "Cnationality","Cimg"],
           additionalProperties: false,
           properties: {
               _id: {},
               Cname: {
                   bsonType: "string",
                   description: "'name' is required and is a string",
               },
               Cdesc: {
                   bsonType: "string",
                   description: "'description' is required and is a string",
                   minLength: 5
               },
               Cnationality: {
                   bsonType: "string",
                   description: "'nationality' is required",
               },
               Cimg :{
                bsonType : "string",
                description : "image path is required"
               }
           },
       },
   };
 
   // Try applying the modification to the collection, if the collection doesn't exist, create it
  await db.command({
       collMod: "casts",
       validator: jsonSchema
   }).catch(async (error: mongodb.MongoServerError) => {
       if (error.codeName === 'NamespaceNotFound') {
           await db.createCollection("casts", {validator: jsonSchema});
       }
   });
}



async function applySchemaValidation_CM(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["Cid", "Mid"],
            additionalProperties: false,
            properties: {
                _id: {},
                Cid: {
                    bsonType: "objectId",
                    description: "'cast id' is required and is an object id",
                },
                Mid: {
                    bsonType: "objectId",
                    description: "'movie id' is required and is an object id",
                }
            },
        },
    };
  
    // Try applying the modification to the collection, if the collection doesn't exist, create it
   await db.command({
        collMod: "cast-movies",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection("cast-movies", {validator: jsonSchema});
        }
    });
 }

async function applySchemaValidation_Movie(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["Mname","Mgenere","Mrate","Mimg","Myear"],
            additionalProperties: false,
            properties: {
                _id: {},
                Mname: {
                    bsonType: "string",
                    description: "'movie name' is required and is a string",
                },
                Mimg: {
                    bsonType: "string",
                    description: "'movie img path' is required and is a string",
                },
                Mrate: {
                    bsonType: "string",
                    description: "'movie rate' is required and is a number",
                },
                Myear: {
                    bsonType: "string",
                    description: "'movie release year' is required and is a string",
                },
                Mgenere: {
                    bsonType: "string",
                    description: "'movie genere' is required and is a string",
                },
            },
        },
    };
  
    // Try applying the modification to the collection, if the collection doesn't exist, create it
   await db.command({
        collMod: "movies",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection("movies", {validator: jsonSchema});
        }
    });
 }

 async function applySchemaValidation_Admin(db: mongodb.Db) {
    const jsonSchema = {
        $jsonSchema: {
            bsonType: "object",
            required: ["Aname","Apassword"],
            additionalProperties: false,
            properties: {
                _id: {},
                Aname: {
                    bsonType: "string",
                    description: "'admin name' is required and is a string",
                },
                Apassword: {
                    bsonType: "string",
                    description: "'admin password' is required and is a string",
                },
            },
        },
    };
  
    // Try applying the modification to the collection, if the collection doesn't exist, create it
   await db.command({
        collMod: "admins",
        validator: jsonSchema
    }).catch(async (error: mongodb.MongoServerError) => {
        if (error.codeName === 'NamespaceNotFound') {
            await db.createCollection("admins", {validator: jsonSchema});
        }
    });
 }