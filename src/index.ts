import * as mongoose from "mongoose";
import * as express from "express";
import * as cors from "cors";
import * as bodyParser from "body-parser";
import {registerActionsInExpressApp} from "controllers.ts/Factory";
import * as socketIo from "socket.io";
import {getUserIdFromToken, validate} from "./auth";
export let clientIdsMap = new Map<string, Array<string>>();
let app = express();
app.use(bodyParser.json());
app.use(cors({origin: "http://winecellar.surge.sh", credentials: true}));
let httpInstance = require("http").Server(app);
export let io = socketIo(httpInstance);
io.on('connection', function (socket) {
    let token = socket.handshake.query["jwttoken"];
    if (validate(token)) {
        let clientIds = clientIdsMap[getUserIdFromToken(token)];
        if(!clientIds) {
            clientIds = [];
            clientIdsMap[getUserIdFromToken(token)] = clientIds;
        }
        clientIds.push({clientId: socket.client.id, jwtToken: token});
    }
});
io.origins("http://winecellar.surge.sh");
mongoose.connect(process.env.MONGOLAB_URI)
let port: number = process.env.PORT || 3000;
httpInstance.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
registerActionsInExpressApp(app, [__dirname + "/controller"]);

