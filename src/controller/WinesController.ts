import {JsonController} from "controllers.ts/decorator/Controllers"
import {Post, Delete, Put, Get} from "controllers.ts/decorator/Methods"
import {Res, Req} from "controllers.ts/decorator/Params";
import {Request, Response} from "express";
import {ObjectID} from "mongodb";
import {Wine} from "../schema/WineSchema";
import {io, clientIdsMap} from "../index";
import {handleAuth, getToken} from "../auth";
var jwt: any = require("jsonwebtoken");

@JsonController("/api/wines")
export class WinesController {
    constructor() {
    }

    @Get("/")
    public get(@Req() req: Request, @Res() res: Response): void {
        let userId: string = handleAuth(req, res);
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
        let userId: string = handleAuth(req, res);
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
        let userId: string = handleAuth(req, res);
        req.body.userId = userId;
        new Wine(req.body).save((error: any, response: any) => {
            if (error) {
                res.send(error);
                return;
            }
            this.handleRt(userId, req, {type: 'WINES_ADD', payload: {wine: response}});
            res.send(response);
        });
    }

    @Put("/:id")
    public put(@Req()req: Request, @Res() res: Response): void {
        let userId: string = handleAuth(req, res);
        Wine.findOneAndUpdate({
            _id: new ObjectID(req.params.id),
            userId: new ObjectID(userId)
        }, req.body, (error: any, response: any) => {
            if (error) {
                res.send(error);
                return;
            }
            this.handleRt(userId, req, {type: 'WINES_UPDATE', payload: {id: response._id, wine: req.body}});
            res.send(response);
        });
    }

    @Delete("/:id")
    public delete(@Req()req: Request, @Res() res: Response): void {
        let userId: string = handleAuth(req, res);
        Wine.remove({_id: new ObjectID(req.params.id), userId: new ObjectID(userId)}, (error: any) => {
            if (error) {
                res.send(error);
                return;
            }
            this.handleRt(userId, req, {type: 'WINES_REMOVE', payload: {id: req.params.id}});
            res.sendStatus(200)
        });
    }

    private handleRt(userId: string, req: Request, action: {type: string, payload: any}): void {
        // based on userId only notify correct user
        if(!clientIdsMap[userId]){
            return;
        }
        clientIdsMap[userId]
            .filter((clientInfo: {clientId: string, jwtToken: string}) => {
                return clientInfo.jwtToken !== getToken(req);
            })
            .forEach((clientInfo: {clientId: string, jwtToken: string}) => {
                io.to('/#' + clientInfo.clientId).emit("UPDATE_REDUX", action);
            });
    }
}