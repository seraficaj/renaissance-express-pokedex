const mongoose = require('mongoose')
const express = require('express');
const app = express();
const methodOverride = require('method-override');
const port = 3000;

//===SEED

const PokeSeed = require('./models/pokemon.js')
const Pokemon = require('./models/pokeSchema.js')
app.use(express.static('public'))
app.use(express.urlencoded({extended:true }));
app.use(express.json())
app.use(methodOverride('_method'));

//===SEED
app.get('/pokeseed', (req, res)=>{
    Pokemon.create(PokeSeed, (err, data)=>{
        res.send(data)
    })
})

//===GET

app.get('/', (req, res) => {
	Pokemon.find({}, (err, allPokemon)=>{
    res.render('index.ejs', { Pokemon: allPokemon })
  })
})

//===NEW
app.get('/new', (req, res)=>{
    res.render('new.ejs')
  })

app.post('/', (req, res)=>{
    Pokemon.create(req.body)
    res.redirect('/')
  })

//==SHOW

app.get('/:id', (req, res) => {
    Pokemon.findById(req.params.id, (err, currentPokemon)=>{
      res.render('show.ejs', {
        Pokemon: currentPokemon
      })
    })
  })

  //==search


  app.get('/:id/edit', (req, res)=>{
    Pokemon.findById(req.params.id, (err, currentPokemon)=>{
      res.render('edit.ejs', {Pokemon: currentPokemon})
    })
  })
  
  app.put('/:id', (req, res)=>{
    let convertedBody = {
      name: req.body.name,
      img: req.body.img,
      type: req.body.type.split(', '),
      stats: {
        hp: req.body.hp,
        attack: req.body.attack,
        defense: req.body.defense,
        spattack: req.body.spattack,
        spdefense: req.body.spdefense,
        speed: req.body.speed
      }
    }
    Pokemon.findByIdAndUpdate(req.params.id, convertedBody, {new: true}, (err, updatedItem)=>{
      res.redirect('/')
    })
  })
  
  app.post('/', (req, res)=>{
    Pokemon.create(req.body)
    res.redirect('/')
  })
  
  //DELETE
  app.delete('/:id', (req, res)=>{
    Pokemon.findByIdAndRemove(req.params.id, (err, data)=>{
      res.redirect('/')
    })
  })

app.listen(port, () => {
    console.log(`Pokedex app listening on port: ${port}`)
  });
  mongoose.connect('mongodb://localhost:27017/pokemon', ()=>{
      console.log('The connection was established')
  })