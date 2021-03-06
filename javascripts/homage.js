// HOMAGE TO THE SQUARE
// JOSEF ALBERS

// Basic variables
var homage = {
  width: d3.select('#homage').node().getBoundingClientRect().width,
  dataset: [],
}

// Palette
homage.dataset = getHomagePalette();

function getHomagePalette() {
  let type = d3.select('input[name="homageType"]:checked').node().value
  if (type === 'analogous') {
    return getAnalogousHomagePalette()
  } else if (type === 'triad') {
    return getTriadHomagePalette()
  }
}

function getAnalogousHomagePalette() {
  let color1 = getRandomColor()
  color1.l = _.floor(_.random(.6, .9, true), 2)

  let color4 = getRandomColor()
  color4.h = getRandomHue(color1.h, .2)
  color4.l = _.floor(_.random(.1, .4, true), 2)

  let hIncrement = _.round((color1.h - color4.h) / 3)
  let sIncrement = _.floor((color1.s - color4.s) / 3, 2)
  let lIncrement = _.floor((color1.l - color4.l) / 3, 2)

  let color2 = {
    h: (color4.h + hIncrement),
    s: (color4.s + sIncrement),
    l: (color4.l + lIncrement)
  }
  let color3 = {
    h: (color4.h + (hIncrement * 2)),
    s: (color4.s + (sIncrement * 2)),
    l: (color4.l + (lIncrement * 2))
  }

  return _.shuffle([color1, color2, color3, color4])
}

function getTriadHomagePalette() {
  let color1 = getRandomColor()
  let color2 = getRandomColor()
  color2.h = getRandomHue(color1.h, .1)

  let triadHue = (color1.h + _.sample([100, -100])) % 360
  let color4 = getRandomColor()
  color4.h = getRandomHue(triadHue, .2)

  let color3 = getRandomColor()
  color3.h = getRandomHue(color4.h, .1)

  return [color1, color2, color3, color4]
}

function getRandomColor() {
  return {
    h: _.random(0, 360),
    s: _.floor(_.random(.1, .6, true), 2),
    l: _.floor(_.random(.1, .9, true), 2),
  }
}

function getRandomHue(hue, margin) {
  let randomHue = _.random(hue * (1 - margin), hue * (1 + margin), true)
  randomHue = _.min([randomHue, 360])
  return _.floor(randomHue)
}

function setHomageSwatches(colors) {
  _.forEach(colors, (color, i) => {
    d3.select(`#square${i + 1}-h`).property('value', `${color.h}`)
    d3.select(`#square${i + 1}-s`).property('value', `${color.s * 100}`)
    d3.select(`#square${i + 1}-l`).property('value', `${color.l * 100}`)
    d3.select(`#square${i + 1}-swatch`).style('background-color', getHsl(color))
  })
}

function getHsl(color) {
  return `hsl(${color.h}, ${color.s * 100}%, ${color.l * 100}%)`
}

// d3 setup
homage.canvas = d3.select('#homage')
                  .append('svg')
                  .attr('width', homage.width)
                  .attr('height', homage.width)

homage.squares = homage.canvas.selectAll('rect')
                  .data(homage.dataset)
                  .enter()
                  .append('rect')

// Drawing the square
drawSquares()

function drawSquares() {
  setHomageSwatches(homage.dataset)

  homage.canvas.selectAll('rect')
    .data(homage.dataset)

  homage.squares.attr('width', (d, i) => getWidth(i))
    .attr('height', (d, i) => getWidth(i))
    .attr('fill', (d) => getHsl(d))
}

function getWidth(index) {
  let minWidth = homage.width * 0.4
  let increment = (homage.width - minWidth) / (homage.dataset.length - 1)
  return homage.width - (increment * index)
}

setCoordinates()

function setCoordinates() {
  homage.squares.attr('transform', (d, i) => {
    return `translate(${getInitialX(i)}, ${getInitialY(i)}) rotate(0)`
  })
}

function getInitialX(index) {
  return (homage.width - getWidth(index)) / 2
}

function getInitialY(index) {
  let increment = homage.width * 0.05
  return homage.width - getWidth(index) - (increment * index)
}

// Interaction
homage.initialAnimationDidFinish = false

homage.canvas.on('mousemove', function () {
  let xCoordinate = d3.mouse(this)[0]
  let yCoordinate = d3.mouse(this)[1]

  animateHomage(xCoordinate, yCoordinate)
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

homage.canvas.on('mouseup', () => {
  homage.dataset = getHomagePalette()
  drawSquares()
})

homage.cursorScale = d3.scaleLinear()
  .domain([0, homage.width])
  .range([-1, 1])
  .clamp(true)

function animateHomage(x, y) {
  // Use a transition for the initial animation
  if (!homage.initialAnimationDidFinish) {
    homage.canvas.selectAll('rect')
      .interrupt()
      .transition(d3.easeBounce)
        .duration(75)
        .attr('transform', (d, i) => getNewTransform(i, x, y))
        .on('end', () => { homage.initialAnimationDidFinish = true})
  // Once the initial animation is finished, track the cursor linearly
  } else {
    homage.squares.attr('transform', (d, i) => getNewTransform(i, x, y))
  }
}

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
  let xIncrement = (i / homage.dataset.length) * (homage.width * 0.2)
  return getInitialX(i) + (homage.cursorScale(xCoordinate) * xIncrement)
}

function getNewY(i, yCoordinate) {
  let yIncrement = (i / homage.dataset.length) * (homage.width * 0.2)
  return getInitialY(i) + (homage.cursorScale(yCoordinate) * yIncrement)
}

// Listeners
d3.selectAll('.homage-input').on('input', () => {
  // Get values from input fields
  let colors = []
  _.forEach(_.range(1, 5), (index) => {
    let color = {
      h: parseFloat(d3.select(`#square${index}-h`).property('value')),
      s: parseFloat(d3.select(`#square${index}-s`).property('value')) / 100,
      l: parseFloat(d3.select(`#square${index}-l`).property('value')) / 100,
    }
    colors.push(color)
  })

  homage.dataset = colors
  drawSquares()
})

let initialBeta, initialGamma

function handleOrientation(event) {
  // On initial load, record the initial beta and gamma values.
  if (!initialBeta && !initialGamma) {
    initialBeta = event.beta
    initialGamma = event.gamma
  }

  let deviceBetaScale = d3.scaleLinear()
    .domain([initialBeta - 90, initialBeta + 90])
    .range([0, homage.width])
    .clamp(true)

  let deviceGammaScale = d3.scaleLinear()
    .domain([initialGamma - 45, initialGamma + 45])
    .range([0, homage.width])
    .clamp(true)

  let relativeBeta = deviceBetaScale(event.beta)
  let relativeGamma = deviceGammaScale(event.gamma)

  animateHomage(relativeGamma, relativeBeta)
  animateFox(relativeGamma, relativeBeta)
  animateOrchestra(relativeGamma, relativeBeta)
}

if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", _.throttle(handleOrientation, 10), true);
} else if (window.DeviceMotionEvent) {
  window.addEventListener('devicemotion', _.throttle(handleOrientation, 10), true);
}
