import * as express from "express";
import {Express, Request, Response} from "express";


const app: Express = express();

const root: string = __dirname + "../../../../";
const rootOptions = {root};

app.use(express.static(root + "dist"));

app.get("/favicon.ico", (request: Request, response: Response) => {
    response.sendFile("src/data/CORS.jpg", rootOptions);
});

app.listen(5000, () => console.log("running"));


