import { TILES, TileList } from './Tiles'

const EXPORT: TileList = {
  LEAF: {
    name: 'LEAF',
    texture: [
      '/textures/pixel/leaf.png',
      '/textures/pixel/leaf.png',
      '/textures/pixel/leaf.png',
      '/textures/pixel/skull.png',
      '/textures/pixel/skull.png',
    ],
    symbol: ':',

    onPlayerMove({ local, updateLocal, moveDirection, soundList }) {
      if (local.get(-moveDirection.x, -moveDirection.y) === TILES.PLAYER) {
        local.set(0, 0, TILES.NOTHING)
        updateLocal(-1, -1, 3, 3)
        soundList.leaf = true
      }
    },
  },
}

export default EXPORT
