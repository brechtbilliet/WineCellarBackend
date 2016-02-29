import * as express from "express";
import {Express, Request, Response} from "express";
import {MongoClient} from "mongodb";
import {Db, ObjectID} from "mongodb";
import * as bodyParser from "body-parser";
MongoClient.connect(process.env.MONGOLAB_URI, (err: any, db: Db) => {
    console.log("started mongodb with MONGOLAB_URI: " + process.env.MONGOLAB_URI);
    console.log(err);
    let app: Express = express();
    let port: number = process.env.PORT || 3000;

    app.use(bodyParser.json());
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });

    app.get("/wines", (req: Request, res: Response) => {
        db.collection("wines").find({}).toArray((error: any, docs: any) => {
            if(error){
                res.send(error);
                return;
            }
            res.send(docs);
        });
    });
    app.get("/wines/:id", (req: Request, res: Response) => {
        db.collection("wines").find({_id: new ObjectID(req.params.id)}).toArray((error: any, docs: any) => {
            if(error){
                res.send(error);
                return;
            }
            res.send(docs[0]);
        });
    });
    app.post("/wines", (req: Request, res: Response) => {
        console.log(req.body);
        db.collection("wines").insertOne(req.body, (error: any) => {
            if(error){
                res.send(error);
                return;
            }
            res.end();
        })
    });
    app.put("/wines/:id", (req: Request, res: Response) => {
        db.collection("wines").updateOne({_id: new ObjectID(req.params.id)}, req.body, (error: any) => {
            if(error){
                res.send(error);
                return;
            }
            res.end();
        })
    });
    app.delete("/wines/:id", (req: Request, res: Response) => {
        db.collection("wines").deleteOne({_id: new ObjectID(req.params.id)}, (error: any) => {
            res.end();
        });
    });
});
