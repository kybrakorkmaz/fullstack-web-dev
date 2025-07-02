import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  password: "123456",
  database: "secrets",
  port:5432,
});

db.connect();
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("home.ejs");
});

app.get("/login", (req, res) => {
  res.render("login.ejs");
});

app.get("/register", (req, res) => {
  res.render("register.ejs");
});

app.post("/register", async (req, res) => {
  const email = req.body.username; //request comes from the form 
  const password = req.body.password;
  //console.log("register username:", username);
  //console.log("register password:", password);
  try {
    const checkResult = await db.query("SELECT * FROM users where user_email = $1"
      [email]
    );
    if(checkResult.rows.length > 0){
      res.send("This email address is already exists!");
    }else{
        const result = await db.query(
        "INSERT INTO users(user_email, user_password) VALUES($1, $2)",
        [email, password]
      );
      console.log("register db result:", result);
      res.render("login.ejs");
    }
  } catch (error) {
    res.status(500).send("Internal Server Error!");
    console.log("register catch:", error);
  }
});

app.post("/login", async (req, res) => {
  const email= req.body.username;
  const password = req.body.password;
  //console.log("login username:", username);
  //console.log("login password:", password);
  try {
    const checkUserExist = await db.query(
      "Select * FROM users where user_email= $1",
      [email]
    );
    if(checkUserExist.rows.length > 0){
      const userInfo = checkUserExist.rows[0];
      console.log("user info:", userInfo);
      if(password === userInfo.user_password){
        //console.log("User email ve şifre", userInfo.user_email, userInfo.user_password);
        res.render("secrets.ejs");
      }
      else{
        res.status(401).send("Invalid password");
      }
    }else{
       res.status(404).send("User does not exist or email address is invalid!");
    }
  } catch (error) {
    console.log("login error:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
