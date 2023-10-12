import Phaser from 'phaser'
import playerMove from '../utils/playerMove'
import path from 'path'

const background_path = path.join(
  'assets',
  'image',
  'Sunny-land-files',
  'environment',
  'Background'
)

const props_path = path.join(
  'assets',
  'image',
  'Sunny-land-files',
  'environment',
  'Props'
)

const spritesheet_path = path.join(
  'assets',
  'image',
  'Sunny-land-files',
  'spritesheets'
)

let platforms
let items
let interactObj
let background
let background_2
let player

class FrontEnd extends Phaser.Scene {
  constructor() {
    super({
      key: 'FrontEnd',
    })
  }

  //find puzzle game
  preload() {
    this.load.image('background', path.join(background_path, 'back.png'))
    this.load.image('background_2', path.join(background_path, 'middle.png'))
    this.load.image('platform-long', path.join(props_path, 'platform-long.png'))
    this.load.image('house', path.join(props_path, 'plant-house.png'))
    this.load.spritesheet('player', path.join(spritesheet_path, 'oposum.png'), {
      frameWidth: 36,
      frameHeight: 28,
    })
  }

  create() {
    this.playerMove = playerMove; //Binding function to scene
    const { width, height } = this.scale;

    //world bound
    this.physics.add.world.setBounds(0, 0, width * 3, height)

    //player
    player = this.physics.add
      .sprite(width / 2, height - 200, 'player')
      .setCollideWorldBounds(true)
      .setScale(3)

    //background
    background = this.add
      .tileSprite(0, 0, width, height, 'background')
      .setOrigin(0, 0)
      .setScale(3)
      .setScrollFactor(-1)
      .setDepth(-5)

    //background layer 2
    background_2 = this.add
      .tileSprite(0, height / 2, width, height, 'background_2')
      .setOrigin(0, 0)
      .setScale(3)
      .setScrollFactor(0)
      .setDepth(-5)

    //platforms and ground
    platforms = this.physics.add.staticGroup()
    let ground = this.add
      .tileSprite(0, height - 150, width, 100, 'platform-long')
      .setScale(2)
      .setOrigin(0, 0)
    let platform1 = this.add
      .tileSprite(0, height - 300, 200, 20, 'platform-long')
      .setScale(2)
      .setOrigin(0, 0)
    platforms.add(ground)
    platforms.add(platform1)

    //items object
    interactObj = this.physics.add.group()
    let house = this.physics.add.image(1200, 300, 'house').setScale(3)
    interactObj.add(house)
    interactObj.setDepth(-1)

    items = this.physics.add.group()
    let star = this.physics.add.image(100, 100, 'platform-long')
    items.add(star)

    //collider
    this.physics.add.collider(player, items)
    this.physics.add.collider(player, platforms)
    this.physics.add.collider(items, platforms)
    this.physics.add.collider(interactObj, platforms)
    this.physics.add.overlap(player, interactObj)

    //animations
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', {
        start: 0,
        end: 5,
      }),
      frameRate: 10,
      repeat: -1,
    })
  }

  update(delta, time) {
    this.playerMove(player, 200)
  }
}

export default FrontEnd
