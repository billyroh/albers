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
    l: _.floor(_.random(.9, .98, true), 2),
  }

  let color2 = {
    h: getRandomHue(color1.h, .1),
    s: color1.s,
    l: _.floor(_.random(.4, .6, true), 2),
  }

  let color3 = {
    h: getRandomHue(color1.h, .1),
    s: _.floor((color1.s + color2.s) / 2, 2),
    l: _.floor(_.random(.1, .2, true), 2),
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
fox.coordinates = {}
fox.coordinates.primary = getPrimaryCoordinates()
fox.coordinates.secondary = getSecondaryCoordinates(fox.coordinates.primary)

function getPrimaryCoordinates() {
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

function getSecondaryCoordinates(primary) {
  let dataset = primary.slice()
  _.forEach(dataset, (point, index) => {
    dataset[index] = getOffset(point)
  })
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
  let point1 = `${pointsArray[0] - halfHeight}, ${pointsArray[1] + halfHeight}`
  let point2 = `${pointsArray[2] - halfHeight}, ${pointsArray[3] + halfHeight}`
  let point3 = `${pointsArray[4] - halfHeight}, ${pointsArray[5] + halfHeight}`

  return `${point1}, ${point2}, ${point3}`
}

function drawTriangles() {
  // Reset
  fox.canvas.selectAll('g.secondary > polygon').remove()
  fox.canvas.selectAll('g.primary > polygon').remove()

  // Draw background
  fox.canvas.style('background-color', getHsl(fox.palette[0]))

  //// Draw left diptych
  fox.diptychLeft.trianglesSecondary =
    fox.canvas.append('g')
      .attr('class', 'secondary left')
      .attr('clip-path', 'url(#diptych-left)')

  fox.diptychLeft.trianglesSecondary.selectAll('polygon')
    .data(fox.coordinates.secondary)
    .enter()
    .append('polygon')
      .attr('points', (d) => d)
      .attr('fill', (d) => getHsl(fox.palette[1]))

  fox.diptychLeft.trianglesPrimary =
    fox.canvas.append('g')
      .attr('class', 'primary left')
      .attr('clip-path', 'url(#diptych-left)')

  fox.diptychLeft.trianglesPrimary.selectAll('polygon')
    .data(fox.coordinates.primary)
    .enter()
    .append('polygon')
      .attr('points', (d) => d)
      .attr('fill', (d) => getHsl(fox.palette[2]))
      .attr('opacity', .9)

  //// Draw right diptych
  fox.diptychRight.trianglesSecondary =
    fox.canvas.append('g')
      .attr('class', 'secondary right')

  fox.diptychRight.trianglesSecondary.selectAll('polygon')
    .data(fox.coordinates.secondary)
    .enter()
    .append('polygon')
      .attr('points', (d) => d)
      .attr('fill', (d) => getHsl(fox.palette[1]))
      .attr('clip-path', 'url(#diptych-right)')

  fox.diptychRight.trianglesPrimary =
    fox.canvas.append('g')
      .attr('class', 'primary right')

  fox.diptychRight.trianglesPrimary.selectAll('polygon')
    .data(fox.coordinates.primary)
    .enter()
    .append('polygon')
      .attr('points', (d) => d)
      .attr('fill', (d) => getHsl(fox.palette[2]))
      .attr('opacity', .9)
      .attr('clip-path', 'url(#diptych-right)')
}

// Interaction
fox.canvas.on('mouseup', () => {
  redrawFox()
})

fox.initialAnimationDidFinish = false

fox.cursorScale = d3.scaleLinear()
  .domain([0, fox.width])
  .range([-1, 1])
  .clamp(true)

fox.canvas.on('mousemove', function () {
  let xCoordinate = d3.mouse(this)[0]
  let yCoordinate = d3.mouse(this)[1]

  let xIncrement = -fox.cursorScale(xCoordinate) * (fox.triangleHeight / 2)
  let yIncrement = -fox.cursorScale(yCoordinate) * (fox.triangleHeight / 2)

  fox.diptychLeft.trianglesSecondary.attr('transform', (d, i) => {
    return `translate(${xIncrement}, ${yIncrement})`
  })
})

function getShadow(points, xCoordinate, yCoordinate) {
  let pointsArray = points.split(',')
  _.forEach(pointsArray, (point, index) => {
    pointsArray[index] = parseFloat(pointsArray[index])
  })
  let point1 = `${pointsArray[0] - xCoordinate}, ${pointsArray[1] + yCoordinate}`
  let point2 = `${pointsArray[2] - xCoordinate}, ${pointsArray[3] + yCoordinate}`
  let point3 = `${pointsArray[4] - xCoordinate}, ${pointsArray[5] + yCoordinate}`

  return `${point1}, ${point2}, ${point3}`
}

function redrawFox() {
  fox.palette = getFoxPalette()
  fox.coordinates.primary = getPrimaryCoordinates()
  fox.coordinates.secondary = getSecondaryCoordinates(fox.coordinates.primary)
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
