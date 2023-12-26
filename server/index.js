import dotenv from "dotenv";
import express from "express";
const app = express();

dotenv.config({ path: `./.env.${process.env.NODE_ENV}` });

app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${process.env.PORT}`);
});
