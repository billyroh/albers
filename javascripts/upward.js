// UPWARD
// JOSEF ALBERS

// Basic variables
var upward = {
  width: d3.select('#upward').node().getBoundingClientRect().width,
}

// Grab height of the canvas
// Divide it by 40 to get the width and height of the 'pixel'
let pixelValue = _.round(upward.width / 40);

upward.palette = getUpwardPalette()

function getUpwardPalette() {
  return _.sample(['#B81736', '#101812', '#526875', '#96ACBA', '#D3DADB'])
}


// d3 setup
upward.canvas =
  d3.select('#upward')
      .append('svg')
      .attr('width', upward.width)
      .attr('height', upward.width)

upward.canvas.style('background-color', getUpwardPalette())

// Horizontal bars
function generateHorizontalBars() {
  let width = _.random(5, 20)
  let numberOfRows = _.random(3, 10)

  let xOffset = _.random(30) * pixelValue
  let yOffset = _.random(30) * pixelValue

  let path = ''
  for (let i = 0; i < numberOfRows; i++) {
    let baseY = i * pixelValue * 2
    let point1 = `M ${xOffset}, ${yOffset + baseY}`
    let point2 = `L ${xOffset + width * pixelValue}, ${yOffset + baseY}`
    let point3 = `L ${xOffset + width * pixelValue}, ${yOffset + baseY + pixelValue}`
    let point4 = `L ${xOffset}, ${yOffset + baseY + pixelValue} Z`
    path += `${point1} ${point2} ${point3} ${point4}`
  }

  return {
    type: 'horizontal',
    path: path,
    color: getUpwardPalette(),
  }
}

let horizontalBarsData = []
let numberOfHorizontalBars = _.random(8, 15)
for (let i = 0; i < numberOfHorizontalBars; i++) {
  horizontalBarsData.push(generateHorizontalBars())
}

// upward.horizontalBars = upward.canvas.selectAll('path.horizontal')
//   .data(horizontalBarsData)
//   .enter()
//   .append('path')
//     .attr('class', (d) => d.type)
//     .attr('d', (d) => d.path)
//     .attr('fill', (d) => d.color)

// Vertical bars
function generateVerticalBars() {
  let height = _.random(5, 10)
  let numberOfColumns = _.random(3, 8)

  let xOffset = _.random(30) * pixelValue
  let yOffset = _.random(30) * pixelValue

  let path = ''
  for (let i = 0; i < numberOfColumns; i++) {
    let baseX = i * pixelValue * 2

    let point1 = `M ${xOffset + baseX}, ${yOffset}`
    let point2 = `L ${xOffset + baseX + pixelValue}, ${yOffset}`
    let point3 = `L ${xOffset + baseX + pixelValue}, ${yOffset + height * pixelValue}`
    let point4 = `L ${xOffset + baseX}, ${yOffset + height * pixelValue} Z`
    path += `${point1} ${point2} ${point3} ${point4}`
  }

  return {
    type: 'vertical',
    path: path,
    color: getUpwardPalette(),
  }
}

let verticalBarsData = []
let numberOfVerticalBars = _.random(3, 8)
for (let i = 0; i < numberOfVerticalBars; i++) {
  verticalBarsData.push(generateVerticalBars())
}

// upward.verticalBars = upward.canvas.selectAll('path.vertical')
//   .data(verticalBarsData)
//   .enter()
//   .append('path')
//     .attr('class', (d) => d.type)
//     .attr('d', (d) => d.path)
//     .attr('fill', (d) => d.color)


// Rectangles
function generateRectangles() {
  let xOffset = _.random(30) * pixelValue
  let yOffset = _.random(30) * pixelValue

  let width = _.random(10, 35) * pixelValue
  let height = _.random(10, 35) * pixelValue

  let point1 = `M ${xOffset}, ${yOffset}`
  let point2 = `L ${xOffset + width}, ${yOffset}`
  let point3 = `L ${xOffset + width}, ${yOffset + height}`
  let point4 = `L ${xOffset}, ${yOffset + height} Z`

  return {
    type: 'rectangle',
    path: `${point1} ${point2} ${point3} ${point4}`,
    color: getUpwardPalette(),
  }
}

let rectangleData = []
let numberOfRectangles = _.random(2, 8)
for (let i = 0; i < numberOfRectangles; i++) {
  rectangleData.push(generateRectangles())
}

let dataset = _.flatten([horizontalBarsData, verticalBarsData])
dataset = _.shuffle(dataset)
dataset = _.flatten([rectangleData, dataset])
// dataset = horizontalBarsData

// upward.rectangles = upward.canvas.selectAll('path.rectangle')
//   .data(rectangleData)
//   .enter()
//   .append('path')
//     .attr('class', (d) => { console.log('d', d); return d.type })
//     .attr('d', (d) => d.path)
//     .attr('fill', (d) => d.color)

upward.canvas.selectAll('path')
  .data(dataset)
  .enter()
  .append('path')
    .attr('class', (d) => d.type)
    .attr('d', (d) => d.path)
    .attr('fill', (d) => d.color)
