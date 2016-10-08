import * as mongoose from "mongoose";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import {registerActionsInExpressApp} from "controllers.ts/Factory";
import * as socketIo from "socket.io";
import {getUserIdFromToken, validate} from "./auth";
export let clientIdsMap = new Map<string, Array<SocketIdAndJWTToken>>();
let app = express();
app.use(bodyParser.json());
app.use(cors({origin: "*", credentials: true}));
let httpInstance = require("http").Server(app);
export let io = socketIo(httpInstance);
io.on('connection', function (socket) {
    let token = socket.handshake.query["jwttoken"];
    if (validate(token)) {
        let clientIds = clientIdsMap[getUserIdFromToken(token)];
        if (!clientIds) {
            clientIds = [];
        }
        let isJwtTokenKnown = clientIds.filter((clientInfo: SocketIdAndJWTToken) => {
                return clientInfo.jwtToken === token
            }).length > 0;
        if (!isJwtTokenKnown) {
            clientIds.push({clientId: socket.client.id, jwtToken: token});
            clientIdsMap[getUserIdFromToken(token)] = clientIds;
        }
    }

    socket.on('disconnect', function () {
        for (let userId in clientIdsMap) {
            let resultingClientIds = clientIdsMap[userId]
                .filter((clientInfo: {clientId: string, jwtToken: string}) => {
                    return clientInfo.clientId !== socket.client.id;
                });
            if (resultingClientIds.length > 0) {
                clientIdsMap[userId] = resultingClientIds;
            } else {
                delete clientIdsMap[userId];
            }
        }
    });
});
io.origins("*:*");
mongoose.connect("heroku_zz2xndp6:hbqi5o0nefb6095gkl3nc4ccgf@ds047484.mlab.com:47484/heroku_zz2xndp6")
let port: number = process.env.PORT || 3000;
httpInstance.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
registerActionsInExpressApp(app, [__dirname + "/controller"]);

interface SocketIdAndJWTToken {
    clientId: string;
    jwtToken: string;
}