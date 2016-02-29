import * as express from "express";
import {Express} from "express";
import * as bodyParser from "body-parser";
import {registerActionsInExpressApp} from "controllers.ts/Factory";

let app: Express = express();
let port: number = process.env.PORT || 3000;

app.use(bodyParser.json());
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

registerActionsInExpressApp(app, [__dirname + "/controller"]);

