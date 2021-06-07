const express = require("express");
const app = express();
const mongoose = require("mongoose");
const fs = require("fs");
app.use(express.json());

const productSchema = mongoose.Schema({
  title: String,
  price: Number,
  description: String,
  category: String,
  image: String,
});

const Product = mongoose.model("Product", productSchema);

mongoose
  .connect("mongodb://localhost/GoCodeShop", {
    useFindAndModify: false,
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected!");

    fs.readFile("Data.json", "utf8", (error, response) => {
      const data = JSON.parse(response);

      Product.remove({}, (err) => {
        console.log(err);
      });

      Product.insertMany(data, (err, res) => {
        err ? console.log(err) : console.log(res);
      });
    });
    app.listen(8080);
  });

app.get("/products", (req, res) => {
  const { titleQuery } = req.query;
  const { minvalue, maxvalue } = req.body;

  Product.find({})
    .exec()
    .then((response) => {
      if (titleQuery) {
        const filterProducts = response.filter((item) =>
          item.title.includes(titleQuery)
        );
        res.send(filterProducts.length > 0 ? filterProducts : "No Data Found");
      } else if (minvalue && maxvalue) {
        const filterByRangePrice = response.filter(
          (item) => item.price >= +minvalue && item.price <= +maxvalue
        );
        res.send(
          filterByRangePrice.length > 0 ? filterByRangePrice : "No Data Found"
        );
      } else {
        res.send(response);
      }
    });
});

app.get("/products/:id", (req, res) => {
  Product.find({ id: req.params.id })
    .exec()
    .then((response) => {
      if (response) {
        res.send(response);
      } else {
        res.status(404);
        res.send();
      }
    });
});

app.post("/products", (req, res) => {
  Product.insertMany({
    title: req.body.title,
    price: req.body.price,
    description: req.body.description,
    category: req.body.category,
    image: req.body.image,
  }).then((response) => {
    res.status(201);
    res.send(response);
  });
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params.id;
  const { title, price, description, image, category } = req.body;
  console.log("req.body", req.body);
  Product.updateOne(
    { id: id },
    { title, price, description, image, category },
    (err, response) => {
      err ? console.log(err) : res.send(response);
    }
  );
});

app.delete("/products/:id", (req, res) => {
  Product.deleteOne({ id: +req.params.id }).then((res) => {
    if (res) {
      res.status(200);
      res.send();
    } else {
      res.status(404);
      res.send();
    }
  });
});
