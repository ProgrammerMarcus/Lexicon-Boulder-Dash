import { useState, useEffect } from 'react'
import { determineSoundFile } from './utils/soundUtils'

interface SoundState {
  id: number
  audio: HTMLAudioElement
}

export interface SoundOptions {
  id: number
  duration?: number
  volume?: number
}

export interface SoundManagerHook {
  playInteraction: (interactionType: string, options?: SoundOptions) => void
  clearSounds: () => void
  hasSound: (id: number) => boolean
}

export const useSoundManagerLogic = () => {
  const [sounds, setSounds] = useState<SoundState[]>([])

  const hasSound = (id: number): boolean => {
    return sounds.some((sound) => sound.id === id)
  }

  useEffect(() => {
    sounds.forEach((sound) => {
      const { audio } = sound
      audio
        .play()
        .catch((error) => console.error('Error playing audio:', error))

      const audioEndedHandler = () => {
        setSounds((prevSounds) =>
          prevSounds.filter((prevSound) => prevSound.id !== sound.id),
        )
        // Cleanup
        audio.removeEventListener('ended', audioEndedHandler)
        audio.pause()
        audio.src = ''
      }

      audio.addEventListener('ended', audioEndedHandler)
    })

    // Cleanup on unmount
    return () => {
      sounds.forEach((sound) => {
        sound.audio.pause()
        sound.audio.src = ''
      })
    }
  }, [sounds])

  const playInteraction = (
    interactionType: string,
    options: SoundOptions = {
      id: 0,
    },
  ): void => {
    // Clear all sounds from the state
    clearSounds()

    const calculatedSoundFile = determineSoundFile(interactionType)
    const soundId = options.id || Math.random() // Assign a random id if not provided

    // Create a new audio instance
    const audio = new Audio(calculatedSoundFile)
    audio.volume = options.volume !== undefined ? options.volume : 1

    // Add the new sound to the list
    setSounds([
      {
        id: soundId,
        audio: audio,
      },
    ])

    // Cleanup audio after playing (remove it from sounds state)
    audio.addEventListener('ended', () => {
      setSounds((prevSounds) =>
        prevSounds.filter((sound) => sound.id !== soundId),
      )
    })

    // Preload audio before playing
    audio.preload = 'auto'
    audio.addEventListener('loadeddata', () => {
      audio
        .play()
        .catch((error) => console.error('Error playing audio:', error))
    })
  }

  const clearSounds = () => {
    setSounds([])
    console.log('Sounds cleared')
  }

  const out: SoundManagerHook = { playInteraction, clearSounds, hasSound }
  return out
}
