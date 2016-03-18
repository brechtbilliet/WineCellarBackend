import {JsonController} from "controllers.ts/decorator/Controllers"
import {Post} from "controllers.ts/decorator/Methods"
import {Res, Req} from "controllers.ts/decorator/Params";
import {Request, Response} from "express";
import {User, IUserModel} from "../schema/UserSchema";
import * as bcrypt from "bcrypt";
var jwt: any = require("jsonwebtoken");
@JsonController("/api/authentication")
export class AuthenticationController {
    constructor() {

    }

    @Post("/register")
    public register(@Req()req: Request, @Res() res: Response): void {
        console.log(req.body);
        new User(req.body).save((error: any) => {
            if (error) {
                res.status(500).send({error: "something has gone horribly wrong"});
                return;
            }
            let token: string = jwt.sign({
                fistName: req.body.firstName,
                lastName: req.body.lastName,
                login: req.body.login
            }, "secret");
            res.send({token: token, login: req.body.login, firstName: req.body.firstName, lastName: req.body.lastName});
        });
    }

    @Post("/login")
    public login(@Req()req: Request, @Res() res: Response): void {
        User.find({login: req.body.login}, (err: any, resp: Array<IUserModel>) => {
            if (err) {
                res.status(500).send({error: "something has gone horribly wrong"});
                return;
            }
            if (resp.length === 0) {
                res.status(404).send({error: "User not found"});
                return;
            }
            let user: IUserModel = resp[0];
            bcrypt.compare(req.body.password, user.password, (errC: any, isMatch: boolean) => {
                if (!isMatch) {
                    res.status(400).send({error: "Wrong Username/password combination"});
                    return;
                }
                let token: string = jwt.sign({
                    fistName: user.firstName,
                    lastName: user.lastName,
                    login: user.login,
                    _id: user._id
                }, "secret");
                res.send({token: token, login: user.login, firstName: user.firstName, lastName: user.lastName});
            });
        });
    }
}