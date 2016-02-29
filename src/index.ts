import * as express from "express";
import {Express} from "express";
import * as bodyParser from "body-parser";
import {registerActionsInExpressApp} from "controllers.ts/Factory";
import {MongoConnector} from "./MongoConnector";
let app: Express = express();
app.use(bodyParser.json());

MongoConnector.connect(() => {
    let port: number = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Listening on port ${port}`);
    });
});
registerActionsInExpressApp(app, [__dirname + "/controller"]);


