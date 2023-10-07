import Phaser from 'phaser'
import path from 'path'
import {
  BACKGROUND_TEMPLE_PATH,
  FOREGROUND_TEMPLE_PATH,
  COMPONENT_TEMPLE_PATH,
} from '../utils/mapPath'
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
let components

class Temple extends Phaser.Scene {
  constructor() {
    super('Temple')
  }

  preload() {
    //load background
    this.load.image('sky', path.join(BACKGROUND_TEMPLE_PATH, 'Sky.png'))
    this.load.image('City', path.join(BACKGROUND_TEMPLE_PATH, 'City.png'))
    this.load.image('Clouds', path.join(BACKGROUND_TEMPLE_PATH, 'Clouds.png'))
    this.load.image(
      'fuji',
      path.join(BACKGROUND_TEMPLE_PATH, 'Volcano fuji.png')
    )
    this.load.image(
      'bgTree',
      path.join(BACKGROUND_TEMPLE_PATH, 'Background Trees.png')
    )
    this.load.image('bushes', path.join(BACKGROUND_TEMPLE_PATH, 'Bushes.png'))
    this.load.image(
      'peddlerCar',
      path.join(COMPONENT_TEMPLE_PATH, 'Trading Cart.png')
    )
    this.load.image('ground', path.join(COMPONENT_TEMPLE_PATH, 'ground.png'))

    //load foreground
    this.load.image(
      'tree',
      path.join(FOREGROUND_TEMPLE_PATH, 'sakura-tree-short.png')
    )
    this.load.image('water', path.join(FOREGROUND_TEMPLE_PATH, 'Water.png'))

    // load components
    this.load.image('House', path.join(COMPONENT_TEMPLE_PATH, 'House.png'))
    this.load.image('torii', path.join(COMPONENT_TEMPLE_PATH, 'Arc.png'))
  }

  create() {
    //config
    const { width, height } = this.scale
    const mapWidth = width
    const floorHeight = height - 330

    //setting world bounds
    this.physics.world.setBounds(0, 0, mapWidth, height)

    //background
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
    let brush1 = this.add
      .image(300, floorHeight + 20, 'bushes')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH)
    let brush2 = this.add
      .image(mapWidth/2  - 550, floorHeight + 20, 'bushes')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH)
    brush2.flipX = true
    let brush3 = this.add
      .image(mapWidth/2  + 180, floorHeight + 20, 'bushes')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(BACKGROUND_COMPONENT_DEPTH)
    let peddlerCar = this.add
      .image(300, floorHeight, 'peddlerCar')
      .setOrigin(0, 0)
      .setScale(0.7)
      .setDepth(MIDDLEGROUND_DEPTH)
    background.add(sky)
    background.add(city)
    background.add(clouds)
    background.add(fuji)
    background.add(bgTree)
    background.add(peddlerCar)
    background.add(brush1)
    background.add(brush2)
    background.add(brush3)

    //components background
    components = this.add.group()
    let house = this.add
      .image(mapWidth / 2 - 380, floorHeight - 100, 'House')
      .setOrigin(0, 0)
      .setScale(0.5)
      .setDepth(MIDDLEGROUND_DEPTH)
    let torii = this.add
      .image(mapWidth / 2 + 500, floorHeight - 50, 'torii')
      .setOrigin(0, 0)
      .setScale(0.5)
      .setDepth(MIDDLEGROUND_DEPTH)
    components.add(house)
    components.add(torii)

    //ground physics
    const grounds = this.physics.add.staticGroup()
    let ground = this.add
      .tileSprite(0, floorHeight + 100, width, 60, 'ground')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(PLAYER_DEPTH)
    grounds.add(ground)

    //foreground
    foreground = this.add.group()
    let water = this.add
      .tileSprite(0, 460, mapWidth, 250, 'water')
      .setOrigin(0, 0)
      .setScale(1.1)
      .setDepth(FOREGROUND_DEPTH)
    let tree = this.add
      .image(0, 100, 'tree')
      .setOrigin(0, 0)
      .setScale(1)
      .setDepth(FOREGROUND_DEPTH)
    foreground.add(tree)
    foreground.add(water)
  }

  update() {
    background.tilePositionX += 0.5
  }
}
export default Temple
