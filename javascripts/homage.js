// HOMAGE TO THE SQUARE
// JOSEF ALBERS

// Basic variables
let homage = {
  maxWidth: d3.select('#homage').node().getBoundingClientRect().width,
  dataset: [],
}

// Palette
homage.dataset = getPalette()

function getPalette() {
  let type = d3.select('input[name="homageType"]:checked').node().value
  if (type === 'analagous') {
    return getAnalagousPalette()
  } else if (type === 'complementary') {
    return getComplementaryPalette()
  }
}

function getAnalagousPalette() {
  let color1 = getRandomColor()
  let color4 = {
    h: _.min([_.random(color1.h * .7, color1.h * 1.3, true), 360]),
    s: _.random(.2, .8, true),
    l: _.random(.2, .8, true),
  }

  let hIncrement = _.round((color1.h - color4.h) / 3)
  let sIncrement = (color1.s - color4.s) / 3
  let lIncrement = (color1.l - color4.l) / 3

  let color2 = {
    h: (color1.h + hIncrement),
    s: (color1.s + sIncrement),
    l: (color1.l + lIncrement)
  }
  let color3 = {
    h: (color1.h + (hIncrement * 2)),
    s: (color1.s + (sIncrement * 2)),
    l: (color1.l + (lIncrement * 2))
  }

  let palette = _.shuffle([color1, color2, color3, color4])
  setSwatches(palette)

  return palette
}

function getComplementaryPalette() {
  let color1 = getRandomColor()
  let color2 = {
    h: _.round(color1.h + (color1.h * _.random(-.1, .1, true))),
    s: _.random(.2, .8, true),
    l: _.random(.2, .8, true)
  }

  let color4 = getRandomColor()
  let color3 = {
    h: _.round(color4.h + (color4.h * _.random(-.1, .1, true))),
    s: _.random(.2, .8, true),
    l: _.random(.2, .8, true)
  }

  let palette = [color1, color2, color3, color4]
  setSwatches(palette)

  return palette
}

function getRandomColor(h) {
  return {
    h: _.random(0, 360),
    s: _.random(.2, .8, true),
    l: _.random(.2, .8, true)
  }
}

function setSwatches(colors) {
  _.forEach(colors, (color, i) => {
    d3.select(`#square${i + 1}-h`).attr('value', `${color.h}`)
    d3.select(`#square${i + 1}-s`).attr('value', `${color.s * 100}`)
    d3.select(`#square${i + 1}-l`).attr('value', `${color.l * 100}`)
    d3.select(`#square${i + 1}-swatch`).style('background-color', `hsl(${color.h}, ${color.s * 100}%, ${color.l * 100}%)`)
  })
}

// d3 setup
homage.canvas = d3.select('#homage')
                  .append('svg')
                  .attr('width', homage.maxWidth)
                  .attr('height', homage.maxWidth)

homage.squares = homage.canvas.selectAll('rect')
                  .data(homage.dataset)
                  .enter()
                  .append('rect')

// Drawing the square
drawSquares()

function drawSquares() {
  homage.canvas.selectAll('rect')
    .data(homage.dataset)
  homage.squares.attr('width', (d, i) => getWidth(i))
    .attr('height', (d, i) => getWidth(i))
    .attr('fill', (d) => `hsl(${d.h}, ${d.s * 100}%, ${d.l * 100}%)`)
}

function getWidth(index) {
  let minWidth = homage.maxWidth * 0.4
  let increment = (homage.maxWidth - minWidth) / (homage.dataset.length - 1)
  return homage.maxWidth - (increment * index)
}

setCoordinates()

function setCoordinates() {
  homage.squares.attr('transform', (d, i) => {
    return `translate(${getInitialX(i)}, ${getInitialY(i)}) rotate(0)`
  })
}

function getInitialX(index) {
  return (homage.maxWidth - getWidth(index)) / 2
}

function getInitialY(index) {
  let increment = homage.maxWidth * 0.05
  return homage.maxWidth - getWidth(index) - (increment * index)
}

// Interaction
homage.canvas.on('mousemove', function () {
  let xCoordinate = d3.mouse(this)[0]
  let yCoordinate = d3.mouse(this)[1]

  // Use a transition for the initial animation
  if (!homage.initialAnimationDidFinish) {
    homage.canvas.selectAll('rect')
      .interrupt()
      .transition(d3.easeBounce)
        .duration(75)
        .attr('transform', (d, i) => getNewTransform(i, xCoordinate, yCoordinate))
        .on('end', () => { homage.initialAnimationDidFinish = true})
  // Once the initial animation is finished, track the cursor linearly
  } else {
    homage.squares.attr('transform', (d, i) => getNewTransform(i, xCoordinate, yCoordinate))
  }

  // TODO (bonus point) add drop shadow when animating
  // TODO (bonus point) click to change colours and have the squares radiate out
})

homage.canvas.on('mouseleave', function () {
  homage.canvas.selectAll('rect')
    .transition(d3.easeElasticInOut)
      .duration(250)
      .attr('transform', (d, i) => {
        if (i === 0) { return }
        return `translate(${getInitialX(i)}, ${getInitialY(i)}) rotate(0)`
      })
      .on('end', () => { homage.initialAnimationDidFinish = false})
})

homage.initialAnimationDidFinish = false

homage.cursorScale = d3.scaleLinear()
  .domain([0, homage.maxWidth])
  .range([-1, 1])
  .clamp(true)

function getNewTransform(i, xCoordinate, yCoordinate) {
  if (i === 0) { return }
  let translateValues = `${getNewX(i, xCoordinate)}, ${getNewY(i, yCoordinate)}`
  let rotationValue = `${getNewRotation(i, xCoordinate)}`
  return `translate(${translateValues}) rotate(${rotationValue})`
}

function getNewRotation(i, xCoordinate) {
  let rIncrement = (i / homage.dataset.length) * 10
  return homage.cursorScale(xCoordinate) * rIncrement
}

function getNewX(i, xCoordinate) {
  let xIncrement = (i / homage.dataset.length) * (homage.maxWidth * 0.2)
  return getInitialX(i) + (homage.cursorScale(xCoordinate) * xIncrement)
}

function getNewY(i, yCoordinate) {
  let yIncrement = (i / homage.dataset.length) * (homage.maxWidth * 0.2)
  return getInitialY(i) + (homage.cursorScale(yCoordinate) * yIncrement)
}

// Listeners
d3.selectAll('.homageType').on('mouseup', () => {
  console.log('hi')
  homage.dataset = getPalette()
  drawSquares()
})
