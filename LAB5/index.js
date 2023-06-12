const express = require("express");
const ejs = require("ejs");
const sqlite3 = require("sqlite3").verbose();
const sqlite = require("sqlite");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();

app.set("views", "./views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));

async function getDBConnection() {
  const db = await sqlite.open({
    filename: "product.db",
    driver: sqlite3.Database,
  });
  return db;
}

app.get("/", async (req, res) => {
  const db = await getDBConnection();
  const products = await db.all("SELECT * FROM product");
  res.render("index.ejs", { products: products });
});

app.get("/login", async (req, res) => {
  res.render("login.ejs");
});

app.get("/signup", async (req, res) => {
  res.render("signup.ejs");
});

app.get("/product/:product_id", async (req, res) => {
  const db = await getDBConnection();
  const product = await db.all(
    "SELECT * FROM product WHERE product_id=" + req.params.product_id
  );
  res.render("product.ejs", { product: product });
});

app.post("/product/:product_id", (req, res) => {
  const commentJson = fs.readFileSync("./public/comment.json");
  const dataJSON = commentJson.toString();
  const comments = JSON.parse(dataJSON);
  const id = parseInt(String(req.params.product_id).slice(1));
  const len = Object.keys(comments[id]).length;

  comments[id][String(len + 1)] = req.body.comment;

  const commentsJSON = JSON.stringify(comments);
  fs.writeFileSync("./public/comment.json", commentsJSON);
});

app.listen(3000);
