import express from "express";
import bodyParser from "body-parser";
import pg from "pg";

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  password: "123456",
  database: "world",
  port: 5432
});

db.connect();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Ana sayfa
app.get("/", async (req, res) => {
  try {
    const result = await db.query("SELECT country_code FROM visited_countries");
    const visitedCountries = result.rows.map(row => row.country_code);
    res.render("index.ejs", {
      countries: visitedCountries,
      total: visitedCountries.length
    });
  } catch (error) {
    console.error("Veri çekme hatası:", error.message);
    res.status(500).send("Sunucu hatası.");
  }
});

// Yeni ülke ekleme
app.post("/add", async (req, res) => {
  try {
    const input = req.body["country"];

    // 1. Ülke kodunu bul
    const result = await db.query(
      "SELECT country_code FROM countries WHERE LOWER(country_name) LIKE $1",
      [`%${input.toLowerCase()}%`]
    );
    const data = await db.query("SELECT country_code FROM visited_countries");
    const visitedCountries = data.rows.map(row=>row.country_code);
    if (result.rows.length === 0) {
      return res.render("index.ejs", {
        countries: visitedCountries,
        total: visitedCountries.length,
        error: "Country does not exist, try again!"});
    }
    const countryCode = result.rows[0].country_code;

    // 2. Zaten eklenmiş mi kontrol et
    const check = await db.query(
      "SELECT * FROM visited_countries WHERE country_code = $1",
      [countryCode]
    );

    if (check.rows.length > 0) {
      return res.render("index.ejs", {
      countries: visitedCountries,
      total: visitedCountries.length,
      error: "The country has already been added, try again!"
     });
    }

    // 3. Eklemeyi yap
    await db.query(
      "INSERT INTO visited_countries (country_code) VALUES ($1)",
      [countryCode]
    );

    res.redirect("/");
  } catch (error) {
    console.error("Bir hata oluştu:", error.message);
    res.status(500).send("Sunucu hatası.");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
