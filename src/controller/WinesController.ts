import {JsonController} from "controllers.ts/decorator/Controllers"
import {Post, Delete, Put, Get} from "controllers.ts/decorator/Methods"
import {MongoClient} from "mongodb";
import {Db} from "mongodb";
import {Request, Response} from "express";
import {ObjectID} from "mongodb";
@JsonController("/api/wines")
export class WinesController {
    private db: Db;

    constructor() {
        MongoClient.connect(process.env.MONGOLAB_URI, (err: any, db: Db) => {
            console.log("started mongodb with MONGOLAB_URI: " + process.env.MONGOLAB_URI);
            this.db = db;
        });
    }

    @Get("/")
    public post(req: Request, res: Response) {
        this.db.collection("wines").find({}).toArray((error: any, docs: any) => {
            if (error) {
                res.send(error);
                return;
            }
            res.send(docs);
        });
    }

    @Get("/:id")
    public put(req: Request, res: Response) {
        this.db.collection("wines").find({_id: new ObjectID(req.params.id)}).toArray((error: any, docs: any) => {
            if (error) {
                res.send(error);
                return;
            }
            res.send(docs[0]);
        });
    }

    @Post("/")
    public get(req: Request, res: Response) {
        this.db.collection("wines").insertOne(req.body, (error: any) => {
            if (error) {
                res.send(error);
                return;
            }
            res.end();
        })
    }

    @Put("/:id")
    public getAll(req: Request, res: Response) {
        this.db.collection("wines").updateOne({_id: new ObjectID(req.params.id)}, req.body, (error: any) => {
            if (error) {
                res.send(error);
                return;
            }
            res.end();
        })
    }

    @Delete("/:id")
    public delete(req: Request, res: Response) {
        this.db.collection("wines").deleteOne({_id: new ObjectID(req.params.id)}, (error: any) => {
            res.end();
        });
    }
}