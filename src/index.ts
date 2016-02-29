import * as express from "express";
import {Express, Request, Response} from "express";
import {MongoClient} from "mongodb";
import {Db} from "mongodb";
import {Wine} from "./Wine";
MongoClient.connect(process.env.MONGOLAB_URI, (err: any, db: Db) => {
    console.log("started mongodb with MONGOLAB_URI: " + process.env.MONGOLAB_URI);
    let app: Express = express();
    let port: number = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });

    app.get("/wines", (req: Request, res: Response) => {
        res.send(db.collection("wines").find({}));
    });
    app.post("/wines", (req: Request, res: Response) => {
        db.collection("wines").insertOne(new Wine("test", "test", "test", 0, 0, 4))
    });
    app.post("/wines/:id", (req: Request, res: Response) => {

    });
    app.delete("/wines/:id", (req: Request, res: Response) => {

    });
});
