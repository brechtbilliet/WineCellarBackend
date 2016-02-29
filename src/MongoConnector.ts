import {MongoClient} from "mongodb";
import {Db} from "mongodb";

export class MongoConnector{
    private static database: Db;
    public static connect(cb): void{
        MongoClient.connect(process.env.MONGOLAB_URI, (err: any, db: Db) => {
            console.log("started mongodb with MONGOLAB_URI: " + process.env.MONGOLAB_URI);
            this.database = db
            cb();
        });
    }
    public static getDb(): Db{
        return this.database;
    }
}