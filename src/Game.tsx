import './Game.css'
import { createContext, useEffect, useRef, useState } from 'react'
import Block from './components/Generic'
import ControlsInfo from './components/ControlsInfo'
import { StartMenu } from './components/StartMenu'
// remove import after highscore caching is finished
import { highscoreTestData } from './assets/highscoreData'

export const PlayerContext = createContext<number[]>([])

export function Game() {
  const [isStartMenuVisible, setStartMenuVisible] = useState<boolean>(true)
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false)

  // prettier-ignore
  const [blocks, setBlocks] = useState([
        "b", "b", "b", "b", "b", "b", "b", "b", "b", "b",
        "b", "p", "s", "n", "d", "d", "d", "d", "d", "b",
        "b", "d", "d", "d", "d", "d", "d", "d", "d", "b",
        "b", "d", "d", "s", "s", "s", "d", "i", "d", "b",
        "b", "d", "i", "d", "d", "d", "d", "d", "d", "b",
        "b", "d", "d", "d", "d", "d", "i", "d", "d", "b",
        "b", "d", "d", "d", "d", "d", "d", "d", "d", "b",
        "b", "s", "s", "s", "d", "d", "d", "d", "d", "b",
        "b", "d", "d", "d", "d", "d", "d", "d", "f", "b",
        "b", "b", "b", "b", "b", "b", "b", "b", "b", "b",
    ]);

  // starting player coordinates
  const position = useRef(11)

  function handlePlayClick() {
    setStartMenuVisible(false)
    setIsGameStarted(true)
    // add "start game" logic ie. start timer etc.
  }

  function gravity() {
    setBlocks((prevBlocks: string[]) => {
      const newBlocks = [...prevBlocks]

      for (let i = newBlocks.length - 1; i >= 0; i--) {
        if (
          newBlocks[i] === 's' &&
          i + 10 < newBlocks.length &&
          newBlocks[i + 10] === 'n'
        ) {
          newBlocks[i + 10] = 's'
          newBlocks[i] = 'n'
        }
      }

      return newBlocks
    })
  }

  // updates player coordinates on keypress, eventListener is added and removed on render
  useEffect(() => {
    if (isGameStarted) {
      const keyPress = (e: KeyboardEvent) => {
        console.log(e.code)
        function handleMove(delta: number, direction: number) {
          const newBlocks = [...blocks]
          const copy = newBlocks[position.current + delta]
          if (copy === 'b') {
            return
          } else if (copy === 'd' || copy === 'n') {
            newBlocks[position.current + delta] = newBlocks[position.current]
            newBlocks[position.current] = 'n'
            position.current += delta
          } else if (copy === 'i') {
            newBlocks[position.current + delta] = newBlocks[position.current]
            newBlocks[position.current] = 'n'
            position.current += delta
          } else if (copy === 'f') {
            alert('WE HAVE A WINNER!')
          } else if (
            copy === 's' &&
            direction === 1 &&
            newBlocks[position.current + delta + 1] === 'n'
          ) {
            // right
            newBlocks[position.current + delta] = newBlocks[position.current]
            newBlocks[position.current + delta + 1] = 's'
            newBlocks[position.current] = 'n'
            position.current += delta
          } else if (
            copy === 's' &&
            direction === 2 &&
            newBlocks[position.current + delta - 1] === 'n'
          ) {
            // left
            newBlocks[position.current + delta] = newBlocks[position.current]
            newBlocks[position.current + delta - 1] = 's'
            newBlocks[position.current] = 'n'
            position.current += delta
          }
          setBlocks(newBlocks)
        }
        if (e.code === 'ArrowUp' || e.code === 'KeyW') {
          handleMove(-10, 0)
        } else if (e.code === 'ArrowDown' || e.code === 'KeyS') {
          handleMove(10, 0)
        } else if (e.code === 'ArrowRight' || e.code === 'KeyD') {
          handleMove(1, 1)
        } else if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
          handleMove(-1, 2)
        }
      }
      window.addEventListener('keydown', keyPress)

      return () => {
        window.removeEventListener('keydown', keyPress)
      }
    }
  }, [isGameStarted, blocks])

  useEffect(() => {
    const gravityInterval = setInterval(() => {
      gravity()
    }, 50)

    return () => {
      clearInterval(gravityInterval)
    }
  }, [blocks])

  function toImagePath(type: string) {
    if (type === 'b') {
      return '/textures/bedrock/bedrock.png'
    } else if (type === 'd') {
      return '/textures/dirt/dirt.png'
    } else if (type === 's') {
      return '/textures/boulders/boulder.png'
    } else if (type === 'i') {
      return '/sprites/gems/sapphire.png'
    } else if (type === 'p') {
      return '/sprites/player/player.png'
    } else if (type === 'n') {
      return '/textures/bedrock/bedrock-2.png'
    } else if (type === 'f') {
      return '/finish.png'
    } else {
      return '/player.png'
    }
  }

  return (
    <>
      {isStartMenuVisible ? (
        <StartMenu
          onPlayClick={handlePlayClick}
          highscores={highscoreTestData}
        />
      ) : (
        <div className="Game">
          <ControlsInfo />
          {blocks.map((key: string, index: number) => (
            <Block
              key={index}
              x={(index + 1) % 10}
              y={(index + 1) / 10}
              image={toImagePath(key)}
            />
          ))}
        </div>
      )}
    </>
  )
}

export default Game
