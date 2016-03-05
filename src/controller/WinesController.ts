import {JsonController} from "controllers.ts/decorator/Controllers"
import {Post, Delete, Put, Get} from "controllers.ts/decorator/Methods"
import {Res, Req} from "controllers.ts/decorator/Params";
import {Request, Response} from "express";
import {ObjectID} from "mongodb";
import {Wine} from "../schema/WineSchema";
var jwt: any = require("jsonwebtoken");

@JsonController("/api/wines")
export class WinesController {
    constructor() {

    }

    @Get("/")
    public get(@Req() req: Request, @Res() res: Response): void {
        let userId: string = this.handleAuth(req, res);
        Wine.find({userId: new ObjectID(userId)}, (error: any, wines: any) => {
            if (error) {
                res.send(error);
                return;
            }
            res.send(wines);
        });
    }

    @Get("/:id")
    public getById(@Req()req: Request, @Res() res: Response): void {
        let userId: string = this.handleAuth(req, res);
        Wine.find({_id: new ObjectID(req.params.id), userId: new ObjectID(userId)}, (error: any, docs: any) => {
            if (error) {
                res.send(error);
                return;
            }
            res.send(docs[0]);
        });
    }

    @Post("/")
    public post(@Req()req: Request, @Res() res: Response): void {
        let userId: string = this.handleAuth(req, res);
        req.body.userId = userId;
        new Wine(req.body).save((error: any) => {
            if (error) {
                res.send(error);
                return;
            }
            res.end();
        });
    }

    @Put("/:id")
    public put(@Req()req: Request, @Res() res: Response): void {
        let userId: string = this.handleAuth(req, res);
        Wine.findOneAndUpdate({_id: new ObjectID(req.params.id), userId: new ObjectID(userId)}, req.body, (error: any) => {
            if (error) {
                res.send(error);
                return;
            }
            res.end();
        });
    }

    @Delete("/:id")
    public delete(@Req()req: Request, res: Response): void {
        let userId: string = this.handleAuth(req, res);
        Wine.remove({_id: new ObjectID(req.params.id), userId: new ObjectID(userId)}, (error: any) => {
            res.end();
        });
    }

    private handleAuth(req: Request, res: Response): string {
        let token: string = req.header("Authorization").replace("Bearer ", "");
        if (!jwt.verify(token, "secret")) {
            res.status(400).send({error: "UNAUTHORIZED"});
            return;
        }
        return jwt.decode(token, "secret")._id;
    }
}