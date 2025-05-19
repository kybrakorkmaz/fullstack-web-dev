import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;
const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  password: "123456",
  database: "permalist",
  port: 5432
});

db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let items = [];

async function getList() {
  const dbResult = await db.query("SELECT * FROM todo_list");
  items = dbResult.rows.map((task) => ({
    id: task.id,
    title: task.task
  }));
  console.log(items);
}

app.get("/", async(req, res) => {
  await getList();
  res.render("index.ejs", {
    listTitle: "Today",
    listItems: items,
  });
});

app.post("/add", async(req, res) => {
  const input = req.body.newItem?.trim();
  if (!input) {//if the input is empty redirect user 
    return res.redirect("/");
  }
  try {
    await db.query(
      "INSERT INTO todo_list(task) VALUES($1) ON CONFLICT (task) DO NOTHING",
      [input]
    );
  } catch (error) {
    console.log("Error adding task:", error.stack);
  }
  res.redirect("/");
});

app.post("/edit", async(req, res) => {
  const textId = req.body.updatedItemId;
  const text = req.body.updatedItemTitle?.trim();
  if(!text){
    return res.redirect("/");
  }
  try {

    await db.query(
      "UPDATE todo_list SET task = $1 WHERE id = $2",
      [text, textId]
    );
    res.redirect("/");
  } catch (error) {
      console.log("Error editing task: ", error.stack);
      res.status(500).send("Internal Server Error");
  }
});

app.post("/delete", async(req, res) => {
  try {
    const deletedTaskId = req.body.deleteItemId;
    await db.query("DELETE FROM todo_list WHERE id = $1",
      [deletedTaskId]
    );
    res.redirect("/");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
