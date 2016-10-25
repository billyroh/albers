// FOX II
// ANNI ALBERS

// Basic variables
let fox = {
  maxWidth: d3.select('#homage').node().getBoundingClientRect().width,
  maxHeight: d3.select('#homage').node().getBoundingClientRect().width * 1.5,
  primaryColor: {h: 16, s: .11, l: .20},
  secondaryColor: {h: 26, s: .36, l: .55},
  backgroundColor: {h: 23, s: .22, l: .93},
  triangleData: [],
}

fox.triangleHeight = _.floor(fox.maxWidth / 15)

for (let x = 0; x < ((fox.maxWidth / fox.triangleHeight) + 2); x++) {
  for (let y = 0; y < ((fox.maxHeight / fox.triangleHeight) + 2); y++) {
    let xCoordinate = x * fox.triangleHeight - (fox.triangleHeight / 2)
    let yCoordinate = y * fox.triangleHeight - (fox.triangleHeight / 2)
    fox.triangleData.push(getPoints(xCoordinate, yCoordinate))
  }
}

// d3 setup
fox.canvas = d3.select('#fox')
                  .append('svg')
                  .attr('width', fox.maxWidth)
                  .attr('height', fox.maxHeight)
                  .attr('fill', fox.backgroundColor)

fox.triangles = fox.canvas.selectAll('polygon')
                  .data(fox.triangleData)
                  .enter()
                  .append('polygon')

// Drawing the content
fox.triangles.attr('points', (d) => d)
  .attr('fill', fox.secondaryColor)
  .attr('class', 'secondary')

fox.triangles.attr('points', (d) => getOffset(d))
  .attr('fill', fox.primaryColor)
  .attr('class', 'primary')

function getPoints(x, y) {
  let random = _.random(4)
  let point1, point2, point3
  let xPosition = fox.triangleHeight * (x - 1)
  let yPosition = fox.triangleHeight * (y - 1)

  if (random === 0) {
    point1 = `${x}, ${y}`
    point2 = `${fox.triangleHeight + x}, ${y}`
    point3 = `${x}, ${fox.triangleHeight + y}`
  } else if (random === 1) {
    point1 = `${x}, ${y}`
    point2 = `${fox.triangleHeight + x}, ${y}`
    point3 = `${x}, ${fox.triangleHeight + y}`
  } else if (random === 2) {
    point1 = `${x}, ${y}`
    point2 = `${fox.triangleHeight + x}, ${fox.triangleHeight + y}`
    point3 = `${fox.triangleHeight + x}, ${y}`
  } else if (random === 3) {
    point1 = `${fox.triangleHeight + x}, ${y}`
    point2 = `${fox.triangleHeight + x}, ${fox.triangleHeight + y}`
    point3 = `${x}, ${fox.triangleHeight + y}`
  }

  return `${point1}, ${point2}, ${point3}`
}

function getOffset(points) {
  let pointsArray = points.split(',')
  _.forEach(pointsArray, (point, index) => {
    pointsArray[index] = parseFloat(pointsArray[index])
  })
  let halfHeight = (fox.triangleHeight / 2)
  let point1 = `${pointsArray[0] - halfHeight}, ${pointsArray[1] + halfHeight}`
  let point2 = `${pointsArray[2] - halfHeight}, ${pointsArray[3] + halfHeight}`
  let point3 = `${pointsArray[4] - halfHeight}, ${pointsArray[5] + halfHeight}`

  // TODO fix this NaN issue

  return `${point1}, ${point2}, ${point3}`
}
