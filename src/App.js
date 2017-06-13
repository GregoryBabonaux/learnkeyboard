import React from 'react';
import logo from './logo.svg';
import './App.css';

import Bubbles from './bubble256.png'
import Background from './abc.jpg'

var createReactClass = require('create-react-class');

window.PIXI = require('phaser/build/custom/pixi')
window.p2 = require('phaser/build/custom/p2')
window.Phaser = require('phaser/build/custom/phaser-split')

let Phaser = window.Phaser;

var App = createReactClass({

  getInitialState(){
    return {
      game: new Phaser.Game(800, 600, Phaser.AUTO, 'canvasContainer', { 
          preload: this.preload, 
          create: this.create, 
          update: this.update 
        }
      ),
      bg: null,
      sprites: [],
      win: 0,
      failed: 0,
      totalLetters: 40,
      lettersToType:[],
      letters: ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
      position:0
    }
  },

  randLetter() {
    var letters = this.state.letters;
    var letter = letters[Math.floor(Math.random() * letters.length)];
    return letter
  },

  preload() {
    // Define sprites before rendering 
    this.state.game.load.image('space', Background); // Background
    this.state.game.load.image('ball', Bubbles); // Bubbles
  },
  

  create() {
    // assign background as a tile
    this.state.bg = this.state.game.add.tileSprite(0, 0, 800, 600, 'space');

    let delay = 0;

    // Render 40 bubbles
    for (let i = 0; i < this.state.totalLetters; i++)
    {
        // Insert a new bubble sprite with random values for size and position 
        let sprite = this.state.game.add.sprite(0 + (this.state.game.world.randomX), 600, 'ball'); // Random pos
        
        // Random scale size 
        sprite.scale.set(this.state.game.rnd.realInRange(0.4, 0.6));

        // For instance, random speed for each bubble
        let speed = this.state.game.rnd.between(4000, 8000);

        // ... or we can set the same speed for each bubble for our game
        speed = 20000;

        // adding sprite to the game 
        let bubble = this.state.game.add.tween(sprite).to({ y: -256 }, speed, Phaser.Easing.Sinusoidal.InOut, true, delay, 1000, false);

        // Random letter =) 
        let letter = this.randLetter();

        // Need to fix a letter to the bubble 
        let style = { font: "32px Arial", fill: "#000000", align: "center"};
        let text = this.state.game.add.text(0, 0, letter.toUpperCase(), style);
        text.anchor.set(0.5);

        // We push the created bubble into our state for more control in update 
        this.state.sprites.push({sprite: sprite, bubble: bubble, text: text, letter: letter})

        // Increment delay 
        delay += 1000;

        this.state.lettersToType.push(letter);
    }

    console.log(this.state.lettersToType);
    console.log(this.state.sprites);

    // Draw the line
    let line1 = new Phaser.Line(10, 100, 790, 100);
    this.state.game.debug.geom(line1);

    let _self = this;

    this.state.game.input.keyboard.onUpCallback = function(e){
      // Check if the last letter match with key pressed
      if( _self.state.sprites[_self.state.position].letter == e.key){

        _self.removeBubble(_self.state.position, 1)
      } else {
        
        _self.removeBubble(_self.state.position, 0)
      }

    }
  },

  update() {
    // move the background 
    this.state.bg.tilePosition.y += 0.4;

    let _self = this;

    let bubbleToRemove = false;

    // Here we check if the bubble is on the line, if true, we remove the bubble
    this.state.sprites.map( (bubble, index) => {
      // Fix the text to match with bubble position in animation
      bubble.text.y =  Math.floor(bubble.bubble.target.position.y + bubble.sprite.width / 2);
      bubble.text.x = Math.floor(bubble.bubble.target.position.x + bubble.sprite.width / 2);

      if( bubble.bubble.target.position.y < 100 ){
        // kill bubble
        bubbleToRemove = index
      }

    })

    if( bubbleToRemove != false ){
      _self.removeBubble(bubbleToRemove, 0)
    }

  },

  removeBubble(index, status){
    let spriteToRemove = this.state.sprites[index]

    spriteToRemove.sprite.destroy()
    spriteToRemove.text.destroy()

    this.setState({
      // sprites: this.state.sprites.slice(index),
      win: (status === 1) ? this.state.win + 1 : this.state.win, 
      failed: (status === 0) ? this.state.failed + 1 : this.state.failed, 
      position: index + 1 
    })

  },

  render(){
      return (
        <div className="App">
          <div className="App-header">
            <h2>Welcome to React Bubble Keyboard Learning :)</h2>
            <h3>See this <a href="">post</a>, and <a href="">this one</a> too</h3>
            <span>Success : {this.state.win}/{this.state.totalLetters}</span>
            {' '}
            <span>Fail : {this.state.failed}/{this.state.totalLetters} </span>
          </div>

          <div id="canvasContainer" ref="canvasContainer" style={{margin: 'auto', width:'800px'}}></div>


          <div style={{fontSize: '9px'}}>
            Background by  {' '}
              <a href="http://aeiblogs.blogspot.fr/2009/08/more-free-layouts.html" target="_blank">
                http://aeiblogs.blogspot.fr/2009/08/more-free-layouts.html
              </a>
          </div>
        </div>
      );
  }
})
export default App;
