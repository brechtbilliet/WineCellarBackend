import {JsonController} from "controllers.ts/decorator/Controllers"
import {Post, Delete, Put, Get} from "controllers.ts/decorator/Methods"
import {Res, Req} from "controllers.ts/decorator/Params";
import {Request, Response} from "express";
import {ObjectID} from "mongodb";
import {MongoConnector} from "../MongoConnector";
@JsonController("/api/wines")
export class WinesController {
    constructor() {

    }

    @Get("/")
    public get(@Req() req: Request, @Res() res: Response) {
        MongoConnector.getDb().collection("wines").find({}).toArray((error: any, docs: any) => {
            if (error) {
                res.send(error);
                return;
            }
            res.send(docs);
        });
    }

    @Get("/:id")
    public getById(@Req()req: Request, @Res() res: Response) {
        MongoConnector.getDb().collection("wines").find({_id: new ObjectID(req.params.id)}).toArray((error: any, docs: any) => {
            if (error) {
                res.send(error);
                return;
            }
            res.send(docs[0]);
        });
    }

    @Post("/")
    public post(@Req()req: Request, @Res() res: Response) {
        MongoConnector.getDb().collection("wines").insertOne(req.body, (error: any) => {
            if (error) {
                res.send(error);
                return;
            }
            res.end();
        })
    }

    @Put("/:id")
    public put(@Req()req: Request, @Res() res: Response) {
        MongoConnector.getDb().collection("wines").updateOne({_id: new ObjectID(req.params.id)}, req.body, (error: any) => {
            if (error) {
                res.send(error);
                return;
            }
            res.end();
        })
    }

    @Delete("/:id")
    public delete(@Req()req: Request, res: Response) {
        MongoConnector.getDb().collection("wines").deleteOne({_id: new ObjectID(req.params.id)}, (error: any) => {
            res.end();
        });
    }
}