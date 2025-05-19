import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const app = express();
const port = 3000;

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "world",
  password: "123456",
  port: 5432,
});
db.connect();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

let currentUserId = 1;
let users = [];

async function loadUsers() {
  const result = await db.query("SELECT * FROM family_members");
  users = result.rows.map((member) => (
    {
      id: member.id,
      name: member.member_name,
      color: member.colors,
    }
  ));
  const colorlist = result.rows.map((c) => ({
    id: c.id,
    color: c.colors
  }));
  console.log(users);
}

// Sunucu başlatılırken kullanıcıları yükle
loadUsers();

async function getCurrentUser(){
  return users.find((user)=>user.id == currentUserId);
}
async function checkVisisted() {
  const result = await db.query(
  "SELECT country_code FROM member_visited_country AS mem_vis \
   JOIN visited_countries AS vis ON mem_vis.country_id = vis.id \
   WHERE mem_vis.member_id = $1", [currentUserId]
  );
  let countries = [];
  result.rows.forEach((country) => {
    countries.push(country.country_code);
  });
  return countries;
}
app.get("/", async (req, res) => {
  const countries = await checkVisisted();
  const currentUser = await getCurrentUser();
  res.render("index.ejs", {
    countries: countries,
    total: countries.length,
    users: users,
    color: currentUser.color,
  });
});
app.post("/add", async (req, res) => {
  const input = req.body["country"];
  try {
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE '%' || $1 || '%';",
      [input.toLowerCase()]
    );
    const data = result.rows[0];
    const countryCode = data.country_code;
    try {
      await db.query(
        "INSERT INTO visited_countries (country_code) VALUES ($1) ON CONFLICT DO NOTHING",
        [countryCode]
      );
      const countrIdResult = await db.query(
        "SELECT id FROM visited_countries WHERE country_code = $1",
        [countryCode]
      );
      const countrId = countrIdResult.rows[0].id;
      await db.query(
        "INSERT INTO member_visited_country(member_id, country_id) VALUES($1, $2)",
        [currentUserId, countrId]
      );
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  } catch (err) {
    console.log(err);
  }
});
app.post("/user", async (req, res) => {
  try {
    if(req.body.add === "new"){
      res.render("new.ejs");
    }else{
      // "user" submit butonunun name'i, value'su ise id
    const id = parseInt(req.body.user);
    if (isNaN(id)) {
      return res.status(400).json("Geçersiz kullanıcı ID");
    }
    currentUserId = id;
    res.redirect("/");
    }
    
  } catch (error) {
    return res.status(500).json("Internal Server Error");
  }
});

app.post("/new", async (req, res) => {
  //Hint: The RETURNING keyword can return the data that was inserted.
  //https://www.postgresql.org/docs/current/dml-returning.html
  try {
    const name= req.body.name;
    const selectedColor = req.body.color;
    if(!name || !selectedColor){
      return res.status(400).send("Name or color cannot be empty! Try again!");
    }
    const query = "INSERT INTO family_members(member_name, colors) VALUES($1, $2) RETURNING *";
    const value = [name, selectedColor];
    const result = await db.query(query, value);
    console.log(result.rows[0]);
    await loadUsers();
    res.redirect("/");
  } catch (err) {
    return res.status(500).json("Internal Server Error");
  }

});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
