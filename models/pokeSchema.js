
   
const mongoose = require('mongoose')

const pokeSchema = new mongoose.Schema ({
  id: String,
  name: String,
  img: String,
  type: [String],
  stats: { //////////you can set it as {}
    hp: String,
    attack: String,
    defense: String,
    spattack: String,
    spdefense: String,
    speed: String
  },
  moves: {
    level: [{
      learnedat: String,
      name: String,
      gen: String
    }]} 
})

const Pokemon = mongoose.model('Pokemon', pokeSchema)

module.exports = Pokemon