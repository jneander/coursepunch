import p5 from 'p5'
import React, {useEffect, useRef, useState} from 'react'

import createSketchBuilder from './createSketchBuilder'

const CANVAS_CONTAINER_ID = 'draw-canvas'

export default function Draw({datastore}) {
  const [mode, setMode] = useState('pen')

  const modeRef = useRef(mode)

  useEffect(() => {
    new p5(createSketchBuilder({containerId: CANVAS_CONTAINER_ID, datastore, modeRef}))
  }, [])

  function handleModeChange(event) {
    const mode = event.target.value
    modeRef.current = mode
    setMode(mode)
  }

  return (
    <>
      <h1>Draw</h1>

      <div className="drawing">
        <div className="draw-canvas" id={CANVAS_CONTAINER_ID}></div>

        <div className="draw-controls">
          <div className="draw-control--radio">
            <input
              checked={mode === 'pen'}
              id="input-pen"
              onChange={handleModeChange}
              type="radio"
              value="pen"
            ></input>

            <label htmlFor="input-pen">Pen</label>
          </div>

          <div className="draw-control--radio">
            <input
              checked={mode === 'eraser'}
              id="input-eraser"
              onChange={handleModeChange}
              type="radio"
              value="eraser"
            ></input>

            <label htmlFor="input-eraser">Eraser</label>
          </div>
        </div>
      </div>
    </>
  )
}
