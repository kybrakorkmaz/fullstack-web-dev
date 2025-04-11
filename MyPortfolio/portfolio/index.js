import express from 'express';
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.urlencoded({extended:true}));

// Route'lar
app.get('/', (req, res) => {
    res.render('index');
});
app.get('/about', (req, res) => {
    res.render('about');
});
app.get('/project', (req, res) => {
    res.render('project');
});
app.get('/contact', (req, res) => {
    res.render('contact');
});

// Sunucu başlatma
app.listen(port, () => {
    console.log(`Port ${port} üzerinden çalışıyor.`);
});
