import * as express from "express";
import {Express, Request, Response} from "express";
let app: Express = express();
let port: number = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

app.get("/wines", (req: Request, res: Response) => {
    res.send("hello world");
});
app.post("/wines", (req: Request, res: Response) => {

});
app.post("/wines/:id", (req: Request, res: Response) => {

});
app.delete("/wines/:id", (req: Request, res: Response) => {

});