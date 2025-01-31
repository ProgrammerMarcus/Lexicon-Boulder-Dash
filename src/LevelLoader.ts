import { Tile, symbolToTile } from './tiles/Tiles'
import Grid from './Grid'

interface LevelFileData {
  name: string
  nextLevel: string
  layout: string[]
  background: string
  theme: number
}

export interface LevelData {
  grid: Grid<Tile>
  nextLevel: string,
  background: string,
  theme: number
}

export async function loadLevelData(path: string): Promise<LevelData> {
  /**
   * Fetches level file from path url
   */
  const data: LevelFileData = await fetch(path).then(
    async (data) => await data.json(),
  )

  /**
   * Converts character symbols to tiles
   */
  const levelData = data.layout.map((row) =>
    [...row].map((f) => symbolToTile[f]),
  )

  const grid = new Grid<Tile>()
  grid.height = levelData.length
  grid.width = levelData[0].length
  grid.data = levelData.reduce((acc, row) => [...acc, ...row], [])

  return {
    grid,
    nextLevel: data.nextLevel,
    background: data.background,
    theme: data.theme
  }
}
