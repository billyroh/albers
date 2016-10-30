// FOX II
// ANNI ALBERS

// Basic variables
let fox = {
  width: d3.select('#homage').node().getBoundingClientRect().width,
}

fox.triangleHeight = _.floor(fox.width / 30)
fox.padding = _.floor(fox.width * .12)
fox.gutter = _.floor(fox.width * .06)
fox.diptych = {
  width: _.floor(fox.width * .35),
  height: _.floor(fox.width * .76),
}

// Palette
fox.palette = getFoxPalette()
setFoxSwatches(fox.palette)

function getFoxPalette() {
  let type = d3.select('input[name="foxType"]:checked').node().value
  if (type === 'analagous') {
    return getAnalagousFoxPalette()
  } else if (type === 'complementary') {
    return getComplementaryFoxPalette()
  }
}

function getAnalagousFoxPalette() {
  let color1 = {
    h: _.random(0, 360),
    s: _.floor(_.random(.2, .3, true), 2),
    l: _.floor(_.random(.7, .9, true), 2),
  }

  let color2 = {
    h: getRandomHue(color1.h, .1),
    s: color1.s,
    l: _.floor(_.random(.4, .6, true), 2),
  }

  let color3 = {
    h: getRandomHue(color1.h, .1),
    s: _.floor((color1.s + color2.s) / 2, 2),
    l: _.floor(_.random(.1, .3, true), 2),
  }

  return [color1, color2, color3]
}

function getComplementaryFoxPalette() {
  let color1 = {
    h: _.random(0, 360),
    s: _.floor(_.random(.6, .8, true), 2),
    l: _.floor(_.random(.7, .9, true), 2),
  }

  let complementaryHue = getRandomHue((color1.h + 180) % 360, .1);
  let color2 = {
    h: complementaryHue,
    s: _.floor(_.random(.6, .8, true), 2),
    l: _.floor(_.random(.4, .6, true), 2),
  }

  let color3 = {
    h: complementaryHue,
    s: _.floor(_.random(.6, .8, true), 2),
    l: _.floor(_.random(.1, .3, true), 2),
  }

  return [color1, color2, color3]
}

function setFoxSwatches(colors) {
  _.forEach(colors, (color, i) => {
    d3.select(`#fox${i + 1}-h`).property('value', `${color.h}`)
    d3.select(`#fox${i + 1}-s`).property('value', `${color.s * 100}`)
    d3.select(`#fox${i + 1}-l`).property('value', `${color.l * 100}`)
    d3.select(`#fox${i + 1}-swatch`).style('background-color', getHsl(color))
  })
}


// d3 setup
fox.canvas =
  d3.select('#fox')
      .append('svg')
      .attr('width', fox.width)
      .attr('height', fox.width)

fox.canvas.style('background-color', getHsl(fox.palette[0]))

//// The left mask
fox.diptychLeft =
  fox.canvas.append("clipPath")
      .attr("id", "diptych-left")
    .append("rect")
      .attr("x", fox.padding)
      .attr("y", fox.padding)
      .attr("width", fox.diptych.width)
      .attr("height", fox.diptych.height)

//// The right mask
fox.diptychRight =
  fox.canvas.append("clipPath")
      .attr("id", "diptych-right")
    .append("rect")
      .attr("x", fox.padding + fox.diptych.width + fox.gutter)
      .attr("y", fox.padding)
      .attr("width", fox.diptych.width)
      .attr("height", fox.diptych.height)

// Generate dataset
fox.dataset = getTriangleData()

function getTriangleData() {
  let dataset = []
  for (let x = 0; x < ((fox.width / fox.triangleHeight) + 2); x++) {
    for (let y = 0; y < ((fox.width / fox.triangleHeight) + 2); y++) {
      let xCoordinate = x * fox.triangleHeight - (fox.triangleHeight / 2)
      let yCoordinate = y * fox.triangleHeight - (fox.triangleHeight / 2)
      dataset.push(getPoints(xCoordinate, yCoordinate))
    }
  }
  return dataset
}

// Draw content
drawTriangles()

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

function drawTriangles() {
  // Reset
  fox.canvas.selectAll('polygon.secondary').remove()
  fox.canvas.selectAll('polygon.primary').remove()

  // Redraw
  fox.canvas.style('background-color', getHsl(fox.palette[0]))

  fox.diptychLeft.trianglesSecondary =
    fox.canvas.selectAll('polygon.secondary')
      .data(fox.dataset)
      .enter()
      .append('polygon')

  fox.diptychLeft.trianglesPrimary =
    fox.canvas.selectAll('polygon.primary')
      .data(fox.dataset)
      .enter()
      .append('polygon')

  fox.diptychRight.trianglesSecondary =
    fox.canvas.selectAll('polygon.secondary')
      .data(fox.dataset)
      .enter()
      .append('polygon')

  fox.diptychRight.trianglesPrimary =
    fox.canvas.selectAll('polygon.primary')
      .data(fox.dataset)
      .enter()
      .append('polygon')

  fox.diptychLeft.trianglesSecondary.attr('points', (d) => d)
    .attr('fill', (d) => getHsl(fox.palette[1]))
    .attr('class', 'secondary')
    .attr('clip-path', 'url(#diptych-left)')

  fox.diptychLeft.trianglesPrimary.attr('points', (d) => getOffset(d))
    .attr('fill', (d) => getHsl(fox.palette[2]))
    .attr('class', 'primary')
    .attr('opacity', .9)
    .attr('clip-path', 'url(#diptych-left)')

  fox.diptychRight.trianglesSecondary.attr('points', (d) => d)
    .attr('fill', (d) => getHsl(fox.palette[1]))
    .attr('class', 'secondary')
    .attr('clip-path', 'url(#diptych-right)')

  fox.diptychRight.trianglesPrimary.attr('points', (d) => getOffset(d))
    .attr('fill', (d) => getHsl(fox.palette[2]))
    .attr('class', 'primary')
    .attr('opacity', .9)
    .attr('clip-path', 'url(#diptych-right)')
}

// Interaction
fox.canvas.on('mouseup', () => {
  redrawFox()
})
function redrawFox() {
  fox.palette = getFoxPalette()
  fox.dataset = getTriangleData()
  drawTriangles()
  setFoxSwatches(fox.palette)
}

// Listeners
d3.selectAll('.fox-input').on('input', () => {
  // Get values from input fields
  let colors = []
  _.forEach(_.range(1, 4), (index) => {
    let color = {
      h: parseFloat(d3.select(`#fox${index}-h`).property('value')),
      s: parseFloat(d3.select(`#fox${index}-s`).property('value')) / 100,
      l: parseFloat(d3.select(`#fox${index}-l`).property('value')) / 100,
    }
    colors.push(color)
  })

  fox.palette = colors
  drawTriangles()
})
