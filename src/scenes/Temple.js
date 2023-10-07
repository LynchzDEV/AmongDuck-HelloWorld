import Phaser from 'phaser'
import path from 'path'
import { BACKGROUND_TEMPLE_PATH, FOREGROUND_TEMPLE_PATH } from '../utils/mapPath'
import {
  SKY_DEPTH,
  BACKGROUND_DEPTH,
  BACKGROUND_COMPONENT_DEPTH,
  MIDDLEGROUND_DEPTH,
  PLAYER_DEPTH,
  FOREGROUND_DEPTH,
} from '../utils/mapDepth'

let background
let foreground
let clounds
let player

class Temple extends Phaser.Scene {
  constructor() {
    super('Temple')
  }

  preload() {
    this.load.image('sky', path.join(BACKGROUND_TEMPLE_PATH, 'Sky.png'))
    this.load.image('City', path.join(BACKGROUND_TEMPLE_PATH, 'City.png'))
    this.load.image('Clouds', path.join(BACKGROUND_TEMPLE_PATH, 'Clouds.png'))
    this.load.image('fuji', path.join(BACKGROUND_TEMPLE_PATH, 'Volcano fuji.png'))
    this.load.image(
      'bgTree',
      path.join(BACKGROUND_TEMPLE_PATH, 'Background Trees.png')
    )
    this.load.image('brush', path.join(BACKGROUND_TEMPLE_PATH, 'Brush.png'))
    this.load.image('peddlerCar', path.join(BACKGROUND_TEMPLE_PATH, 'Peddler Car.png'))
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
