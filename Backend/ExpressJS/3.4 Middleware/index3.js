import express from "express";

const app = express();
const port = 3000;

function logger (req, res, next){
  console.log("Requested method: ", req.method);
  console.log("Requested URL: ", req.url);
  next(); //hanging problem
}
app.use(logger);

app.get("/", (req, res) => {
  res.send("Hello");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
