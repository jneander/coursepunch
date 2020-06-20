const BACKGROUND = [255, 255, 255]
const FOREGROUND = [0, 0, 0]
const DIMENSIONS = [10, 10]

export default function createSketchBuilder({containerId, datastore, modeRef}) {
  function getNewMarkings(lastTimestamp) {
    const markings = datastore.getMarkings()
    if (lastTimestamp == null) {
      return markings
    }

    const newMarkings = []
    for (let i = markings.length - 1; i >= 0; i--) {
      if (markings[i].timestamp < lastTimestamp) {
        break
      }

      // TODO: Filter markings drawn by the current user.
      newMarkings.unshift(markings[i])
    }

    return newMarkings
  }

  return (sketch) => {
    const mousePos = {x: 0, y: 0}

    let lastTimestamp = null

    function drawMarking(position, rgb, dimensions) {
      sketch.noStroke()
      sketch.fill(...rgb)
      sketch.ellipse(position.x, position.y, ...dimensions)
    }

    function draw() {
      const color = modeRef.current === 'eraser' ? BACKGROUND : FOREGROUND
      drawMarking(mousePos, color, DIMENSIONS)
      datastore.addMarking({x: mousePos.x, y: mousePos.y}, color, DIMENSIONS)
    }

    sketch.setup = () => {
      const canvas = sketch.createCanvas(360, 360)
      canvas.parent(containerId)
      sketch.background(...BACKGROUND)
    }

    sketch.draw = () => {
      const newMarkings = getNewMarkings(lastTimestamp)
      if (newMarkings.length) {
        lastTimestamp = newMarkings[newMarkings.length - 1].timestamp

        newMarkings.forEach((marking) =>
          drawMarking(marking.position, marking.rgb, marking.dimensions)
        )
      }

      if (sketch.mouseIsPressed) {
        sketch.mouseDragged()
      }
    }

    sketch.mousePressed = () => {
      mousePos.x = sketch.mouseX
      mousePos.y = sketch.mouseY
    }

    sketch.mouseDragged = () => {
      // TODO: Do not draw if the mouse has not moved.
      // TODO: Ensure minimum mouse movement.
      // TODO: Consider restricting to integer coordinates.
      // Smear the mouse position to achieve a more "filled-in" path.
      mousePos.x = 0.9 * mousePos.x + 0.1 * sketch.mouseX
      mousePos.y = 0.9 * mousePos.y + 0.1 * sketch.mouseY

      draw()
    }
  }
}
