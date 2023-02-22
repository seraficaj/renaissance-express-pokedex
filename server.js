const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();
const methodOverride = require("method-override");
const port = 3000;

//===SEED

const PokeSeed = require("./models/pokemon.js");
const Pokemon = require("./models/pokeSchema.js");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

//===SEED
app.get("/pokeseed", (req, res) => {
  Pokemon.create(PokeSeed, (err, data) => {
    res.send(data);
  });
});

//==SHOW

app.get("/:id", (req, res) => {
  Pokemon.findById(req.params.id, (err, currentPokemon) => {
    console.log(currentPokemon);
    res.render("show.ejs", {
      pokemon: currentPokemon,
    });
  });
});

//===GET

app.get("/", (req, res) => {
  Pokemon.find({}, (err, allPokemon) => {
    console.log(allPokemon);
    res.render("index.ejs", { allPokemon });
  });
});

//===NEW
app.get("/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/", (req, res) => {
  Pokemon.create(req.body);
  res.redirect("/");
});

//==search

app.get("/:id/edit", (req, res) => {
  Pokemon.findById(req.params.id, (err, currentPokemon) => {
    res.render("edit.ejs", { Pokemon: currentPokemon });
  });
});

app.put("/:id", (req, res) => {
  let convertedBody = {
    name: req.body.name,
    img: req.body.img,
    type: req.body.type.split(", "),
    stats: {
      hp: req.body.hp,
      attack: req.body.attack,
      defense: req.body.defense,
      spattack: req.body.spattack,
      spdefense: req.body.spdefense,
      speed: req.body.speed,
    },
  };
  Pokemon.findByIdAndUpdate(
    req.params.id,
    convertedBody,
    { new: true },
    (err, updatedItem) => {
      res.redirect("/");
    }
  );
});

app.post("/", (req, res) => {
  Pokemon.create(req.body);
  res.redirect("/");
});

//DELETE
app.delete("/:id", (req, res) => {
  Pokemon.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect("/");
  });
});

app.listen(port, () => {
  console.log(`Pokedex app listening on port: ${port}`);
});
mongoose.connect(process.env.MONGO_URI, () => {
  console.log("The connection was established at" + process.env.MONGO_URI);
});
