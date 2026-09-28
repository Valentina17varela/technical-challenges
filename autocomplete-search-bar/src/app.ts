import express from "express";
import { Request, Response } from "express";
import { autocomplete } from "./autocomplete";

const app = express();
const port = 3001;

app.get("/", (req: Request, res: Response) => {
  const products = autocomplete((req.query.q || "") as string);
  res.send(products);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
