import Phaser from 'phaser'
import path from 'path'
import {
  SKY_DEPTH,
  BACKGROUND_DEPTH,
  BACKGROUND_COMPONENT_DEPTH,
  MIDDLEGROUND_DEPTH,
  PLAYER_DEPTH,
  FOREGROUND_DEPTH,
} from '../utils/mapDepth'

const background_path = path.join(
  'assets',
  'image',
  'temple-scene',
  'background'
)
const foreground_path = path.join(
  'assets',
  'image',
  'temple-scene',
  'foreground'
)

let background
let foreground
let clounds
let player

class Temple extends Phaser.Scene {
  constructor() {
    super('Temple')
  }

  preload() {
    this.load.image('sky', path.join(background_path, 'Sky.png'))
    this.load.image('City', path.join(background_path, 'City.png'))
    this.load.image('Clouds', path.join(background_path, 'Clouds.png'))
    this.load.image('fuji', path.join(background_path, 'Volcano fuji.png'))
    this.load.image(
      'bgTree',
      path.join(background_path, 'Background Trees.png')
    )
    this.load.image('brush', path.join(background_path, 'brush.png'))
  }

  create() {
    const { width, height } = this.scale
    const mapWidth = width
    const floorHeight = height - 330
    this.physics.world.setBounds(0, 0, mapWidth, height)
    background = this.add.group()
    let sky = this.add
      .tileSprite(0, 0, width, height, 'sky')
      .setOrigin(0, 0)
      .setScale(1, 0.7)
      .setDepth(SKY_DEPTH)
    let city = this.add
      .tileSprite(0, floorHeight - 100, 550, 200, 'City')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_DEPTH)
    let clouds = this.add
      .tileSprite(0, -200, mapWidth, height, 'Clouds')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(SKY_DEPTH)
    let fuji = this.add
      .image(mapWidth - 1000, floorHeight - 150, 'fuji')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_DEPTH)
    let bgTree = this.add
      .tileSprite(0, floorHeight + 20, width * 2, 180, 'bgTree')
      .setOrigin(0, 0)
      .setScale(0.7)
      .setDepth(BACKGROUND_COMPONENT_DEPTH)
    
    background.add(sky)
    background.add(city)
    background.add(clouds)
    background.add(fuji)
    background.add(bgTree)
  }

  update() {
    background.tilePositionX += 0.5
  }
}
export default Temple
