"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
const root = __dirname + "../../../../";
const rootOptions = { root };
app.use(express.static(root + "dist"));
app.get("/favicon.ico", (request, response) => {
    response.sendFile("src/data/CORS.jpg", rootOptions);
});
app.listen(5000, () => console.log("running"));
//# sourceMappingURL=server.js.map