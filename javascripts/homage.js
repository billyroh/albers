// HOMAGE TO THE SQUARE

// Basic variables
let maxWidth = 500
let minWidth = maxWidth * 0.4

// Palette
let innerColor = {h: 55, s: .92, l: .65}
let outerColor = {h: 79, s: .58, l: .48}

let homageDataset = []

function generatePalette(iterationCount) {
  let hIncrement = (innerColor.h - outerColor.h) / (iterationCount - 1)
  let sIncrement = (innerColor.s - outerColor.s) / (iterationCount - 1)
  let lIncrement = (innerColor.l - outerColor.l) / (iterationCount - 1)

  for (i of Array(iterationCount).keys()) {
    let color = {
      h: (outerColor.h + (hIncrement * i)),
      s: (outerColor.s + (sIncrement * i)),
      l: (outerColor.l + (lIncrement * i))
    }
    homageDataset.push(color)
  }
}

generatePalette(4)

// d3 setup
let homageCanvas = d3.select('#homage')
            .append('svg')
            .attr('width', maxWidth)
            .attr('height', maxWidth)

let squares = homageCanvas.selectAll('rect')
                 .data(homageDataset)
                 .enter()
                 .append('rect')

// Drawing the square
squares.attr('width', (d, i) => getWidth(i))
       .attr('height', (d, i) => getWidth(i))
       .attr('fill', (d) => `hsl(${d.h}, ${d.s * 100}%, ${d.l * 100}%)`)

function getWidth(index) {
  let increment = (maxWidth - minWidth) / (homageDataset.length - 1)
  return maxWidth - (increment * index)
}

setCoordinates()

function setCoordinates() {
  squares.attr('transform', (d, i) => {
    return `translate(${getInitialX(i)}, ${getInitialY(i)}) rotate(0)`
  })
}

function getInitialX(index) {
  return (maxWidth - getWidth(index)) / 2
}

function getInitialY(index) {
  let increment = maxWidth * 0.05
  return maxWidth - getWidth(index) - (increment * index)
}

// Interaction
homageCanvas.on('mousemove', function () {
  let xCoordinate = d3.mouse(this)[0]
  let yCoordinate = d3.mouse(this)[1]

  // Use a transition for the initial animation
  if (!initialAnimationDidFinish) {
    homageCanvas.selectAll('rect')
      .interrupt()
    homageCanvas.selectAll('rect')
      .transition(d3.easeBounce)
        .duration(75)
        .attr('transform', (d, i) => getNewTransform(i, xCoordinate, yCoordinate))
        .on('end', () => { initialAnimationDidFinish = true})
  // Once the initial animation is finished, track the cursor linearly
  } else {
    squares.attr('transform', (d, i) => getNewTransform(i, xCoordinate, yCoordinate))
  }

  // TODO (bonus point) add drop shadow when animating
})

homageCanvas.on('mouseleave', function () {
  homageCanvas.selectAll('rect')
    .transition(d3.easeElasticInOut)
      .duration(250)
      .attr('transform', (d, i) => {
        if (i === 0) { return }
        return `translate(${getInitialX(i)}, ${getInitialY(i)}) rotate(0)`
      })
      .on('end', () => { initialAnimationDidFinish = false})
})

let initialAnimationDidFinish = false

let cursorScale = d3.scaleLinear()
  .domain([0, maxWidth])
  .range([-1, 1])
  .clamp(true)

function getNewTransform(i, xCoordinate, yCoordinate) {
  if (i === 0) { return }
  let translateValues = `${getNewX(i, xCoordinate)}, ${getNewY(i, yCoordinate)}`
  let rotationValue = `${getNewRotation(i, xCoordinate)}`
  return `translate(${translateValues}) rotate(${rotationValue})`
}

function getNewRotation(i, xCoordinate) {
  let rIncrement = (i / homageDataset.length) * 10
  return cursorScale(xCoordinate) * rIncrement
}

function getNewX(i, xCoordinate) {
  let xIncrement = (i / homageDataset.length) * (maxWidth * 0.2)
  return getInitialX(i) + (cursorScale(xCoordinate) * xIncrement)
}

function getNewY(i, yCoordinate) {
  let yIncrement = (i / homageDataset.length) * (maxWidth * 0.2)
  return getInitialY(i) + (cursorScale(yCoordinate) * yIncrement)
}
