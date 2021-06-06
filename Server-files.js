const express = require("express");
const app = express();
const fs = require("fs");
const mongoose = require("mongoose");

app.use(express.json());

app.get("/products", (req, res) => {
  const { titleQuery } = req.query;
  fs.readFile("Data.json", "utf8", (error, response) => {
    const products = Json.parse(response);
    if (title) {
      const filterProducts = products.filter((item) =>
        item.title.includes(titleQuery)
      );
      res.send(filterProducts);
    } else {
      res.send(products);
    }
  });
});

app.get("/products/:id", (req, res) => {
  fs.readFile("Data.json", "utf8", (err, response) => {
    const products = JSON.parse(response);
    const product = products.find((item) => item.id === +req.params.id);
    if (product) {
      res.send(product);
    }

    res.status(404);
    res.send();
  });
});

app.post("/products", (req, res) => {
  fs.readFile("Data.json", "utf8", (error, response) => {
    const products = JSON.parse(response);
    products.push({
      id: products.length,
      title: req.body.title,
      price: req.body.price,
      description: req.body.description,
      category: req.body.category,
      image: req.body.image,
    });

    fs.writeFile("Data.json", JSON.stringify(products), (err) => {
      if (err) throw err;
    });

    res.status(201);
    res.send();
  });
});

app.put("/products/:id", (req, res) => {
  fs.readFile("Data.json", "utf8", (error, response) => {
    const products = JSON.parse(response);

    const updatedProducts = products.map((item) =>
      (item.id === +req, params.id)
        ? {}
        : {
            ...item,
          }
    );

    fs.writeFile("Data.json", JSON.stringify(products), (err) => {
      if (err) throw err;
    });

    res.status(201);
    res.send();
  });
});

app.delete("/products/:id", (req, res) => {
  console.log("req accepted");
  fs.readFile("Data.json", "utf8", (error, response) => {
    const products = JSON.parse(response);
    const FilterProducts = products.filter(
      (item) => item.id !== +req.params.id
    );
    fs.writeFile("Data.json", JSON.stringify(FilterProducts), (err) => {
      if (err) throw err;
    });
    res.status(200);
    res.send();
  });
});

mongoose.connect("mongodb://localhost/my_db", {}).then(() => {
  console.log("connected!");
  app.listen(8080);

  const productSchema = mongoose.Schema({
    title: String,
    price: Number,
    description: String,
    category: String,
    image: String,
  });

  const Product = mongoose.model("Product", productSchema);
});
