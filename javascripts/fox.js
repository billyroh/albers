// FOX II
// ANNI ALBERS

// Basic variables
let fox = {
  width: d3.select('#homage').node().getBoundingClientRect().width,
  primaryColor: {h: 16, s: .11, l: .20},
  secondaryColor: {h: 26, s: .36, l: .55},
  backgroundColor: {h: 23, s: .22, l: .93},
  triangleData: [],
}

fox.triangleHeight = _.floor(fox.width / 30)
fox.padding = _.floor(fox.width * .12)
fox.gutter = _.floor(fox.width * .06)
fox.diptych = {
  width: _.floor(fox.width * .35),
  height: _.floor(fox.width * .76),
}

for (let x = 0; x < ((fox.width / fox.triangleHeight) + 2); x++) {
  for (let y = 0; y < ((fox.width / fox.triangleHeight) + 2); y++) {
    let xCoordinate = x * fox.triangleHeight - (fox.triangleHeight / 2)
    let yCoordinate = y * fox.triangleHeight - (fox.triangleHeight / 2)
    fox.triangleData.push(getPoints(xCoordinate, yCoordinate))
  }
}

// d3 setup
fox.canvas = d3.select('#fox')
                  .append('svg')
                  .attr('width', fox.width)
                  .attr('height', fox.width)
                  .style('background-color', getHsl(fox.backgroundColor))

fox.diptychLeft = fox.canvas.append("clipPath")
      .attr("id", "diptych-left")
    .append("rect")
      .attr("x", fox.padding)
      .attr("y", fox.padding)
      .attr("width", fox.diptych.width)
      .attr("height", fox.diptych.height)

fox.diptychLeft = fox.canvas.append("clipPath")
      .attr("id", "diptych-right")
    .append("rect")
      .attr("x", fox.width - fox.padding - fox.diptych.width)
      .attr("y", fox.padding)
      .attr("width", fox.diptych.width)
      .attr("height", fox.diptych.height)

fox.trianglesSecondary = fox.canvas.selectAll('polygon.secondary')
                          .data(fox.triangleData)
                          .enter()
                          .append('polygon')

fox.trianglesPrimary = fox.canvas.selectAll('polygon.primary')
                  .data(fox.triangleData)
                  .enter()
                  .append('polygon')

fox.trianglesSecondary2 = fox.canvas.selectAll('polygon.secondary')
                          .data(fox.triangleData)
                          .enter()
                          .append('polygon')

fox.trianglesPrimary2 = fox.canvas.selectAll('polygon.primary')
                  .data(fox.triangleData)
                  .enter()
                  .append('polygon')

// Drawing the content
fox.trianglesSecondary.attr('points', (d) => d)
  .attr('fill', (d) => getHsl(fox.secondaryColor))
  .attr('class', 'secondary')
  .attr('clip-path', 'url(#diptych-left)')

fox.trianglesPrimary.attr('points', (d) => getOffset(d))
  .attr('fill', (d) => getHsl(fox.primaryColor))
  .attr('class', 'primary')
  .attr('opacity', .925)
  .attr('clip-path', 'url(#diptych-left)')

fox.trianglesSecondary2.attr('points', (d) => d)
  .attr('fill', (d) => getHsl(fox.secondaryColor))
  .attr('class', 'secondary')
  .attr('clip-path', 'url(#diptych-right)')

fox.trianglesPrimary2.attr('points', (d) => getOffset(d))
  .attr('fill', (d) => getHsl(fox.primaryColor))
  .attr('class', 'primary')
  .attr('opacity', .925)
  .attr('clip-path', 'url(#diptych-right)')

function getPoints(x, y) {
  let random = _.random(3)
  let point1, point2, point3
  let xAdjusted = x - _.floor(fox.triangleHeight / 2)
  let yAdjusted = y - _.floor(fox.triangleHeight / 2)

  if (random === 0) {
    point1 = `${xAdjusted}, ${yAdjusted}`
    point2 = `${fox.triangleHeight + xAdjusted}, ${fox.triangleHeight + yAdjusted}`
    point3 = `${xAdjusted}, ${fox.triangleHeight + yAdjusted}`
  } else if (random === 1) {
    point1 = `${xAdjusted}, ${yAdjusted}`
    point2 = `${fox.triangleHeight + xAdjusted}, ${yAdjusted}`
    point3 = `${xAdjusted}, ${fox.triangleHeight + yAdjusted}`
  } else if (random === 2) {
    point1 = `${xAdjusted}, ${yAdjusted}`
    point2 = `${fox.triangleHeight + xAdjusted}, ${fox.triangleHeight + yAdjusted}`
    point3 = `${fox.triangleHeight + xAdjusted}, ${yAdjusted}`
  } else if (random === 3) {
    point1 = `${fox.triangleHeight + xAdjusted}, ${yAdjusted}`
    point2 = `${fox.triangleHeight + xAdjusted}, ${fox.triangleHeight + yAdjusted}`
    point3 = `${xAdjusted}, ${fox.triangleHeight + yAdjusted}`
  }

  return `${point1}, ${point2}, ${point3}`
}

function getOffset(points) {
  let pointsArray = points.split(',')
  _.forEach(pointsArray, (point, index) => {
    pointsArray[index] = parseFloat(pointsArray[index])
  })
  let halfHeight = _.floor(fox.triangleHeight / 3.5)
  let point1 = `${pointsArray[0] + halfHeight}, ${pointsArray[1] - halfHeight}`
  let point2 = `${pointsArray[2] + halfHeight}, ${pointsArray[3] - halfHeight}`
  let point3 = `${pointsArray[4] + halfHeight}, ${pointsArray[5] - halfHeight}`

  return `${point1}, ${point2}, ${point3}`
}

function getHsl(color) {
  return `hsl(${color.h}, ${color.s * 100}%, ${color.l * 100}%)`
}
