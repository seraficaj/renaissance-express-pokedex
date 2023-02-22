const mongoose = require("mongoose");
const express = require("express");
const app = express();
require("dotenv").config();
const methodOverride = require("method-override");
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

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

//===GET
app.get("/", (req, res) => {
  res.redirect("/pokedex");
});
app.get("/pokedex", (req, res) => {
  Pokemon.find({}, (err, allPokemon) => {
    if (err) console.log(err);
    res.render("index.ejs", { allPokemon });
  });
});

//==SHOW

app.get("/pokedex/:id", (req, res) => {
  Pokemon.findById(req.params.id, (err, currentPokemon) => {
    if (err) {
      console.log(err);
    }
    console.log(currentPokemon);
    res.render("show.ejs", {
      pokemon: currentPokemon,
    });
  });
});

//===NEW
app.get("/new", (req, res) => {
  res.render("new.ejs");
});

app.post("/", (req, res) => {
  Pokemon.create(req.body);
  res.redirect("/pokedex");
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
      res.redirect("/pokedex");
    }
  );
});

app.post("/", (req, res) => {
  Pokemon.create(req.body);
  res.redirect("/pokedex");
});

//DELETE
app.delete("/:id", (req, res) => {
  Pokemon.findByIdAndRemove(req.params.id, (err, data) => {
    res.redirect("/pokedex");
  });
});

app.listen(PORT, () => {
  console.log(`Pokedex app listening on PORT: ${PORT}`);
});
mongoose.connect(process.env.MONGO_URI, () => {
  console.log("The connection was established at" + process.env.MONGO_URI);
});
