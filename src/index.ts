import * as mongoose from "mongoose";
import * as express from "express";
import {Express} from "express";
import * as bodyParser from "body-parser";
import {registerActionsInExpressApp} from "controllers.ts/Factory";
let app: Express = express();
app.use(bodyParser.json());

mongoose.connect(process.env.MONGOLAB_URI)
let port: number = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});
registerActionsInExpressApp(app, [__dirname + "/controller"]);


