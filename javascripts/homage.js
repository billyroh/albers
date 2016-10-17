// HOMAGE TO THE SQUARE
// JOSEF ALBERS

// Basic variables
let homage = {
  maxWidth: 500,
  dataset: [],
  innerColor: {h: 55, s: .92, l: .65},
  outerColor: {h: 79, s: .58, l: .48},
}

// Palette
function generatePalette(iterationCount) {
  let hIncrement = (homage.innerColor.h - homage.outerColor.h) / (iterationCount - 1)
  let sIncrement = (homage.innerColor.s - homage.outerColor.s) / (iterationCount - 1)
  let lIncrement = (homage.innerColor.l - homage.outerColor.l) / (iterationCount - 1)

  for (i of Array(iterationCount).keys()) {
    let color = {
      h: (homage.outerColor.h + (hIncrement * i)),
      s: (homage.outerColor.s + (sIncrement * i)),
      l: (homage.outerColor.l + (lIncrement * i))
    }
    homage.dataset.push(color)
  }
}

generatePalette(4)

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
homage.squares.attr('width', (d, i) => getWidth(i))
  .attr('height', (d, i) => getWidth(i))
  .attr('fill', (d) => `hsl(${d.h}, ${d.s * 100}%, ${d.l * 100}%)`)

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
