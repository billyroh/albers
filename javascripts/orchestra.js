// ORCHESTRA
// ANNI ALBERS

// Basic variables
var orchestra = {
  width: d3.select('#orchestra').node().getBoundingClientRect().width,
}
orchestra.columnCount = 22
orchestra.padding = _.round(orchestra.width * 0.15)
let pixelValue = _.round((orchestra.width - orchestra.padding * 2) / orchestra.columnCount)

// d3 setup
orchestra.palette = getOrchestraPalette()
orchestra.canvas = d3.select('#orchestra')
                  .append('svg')
                  .attr('width', orchestra.width)
                  .attr('height', orchestra.width)
                  .style('background-color', `${getHsl(orchestra.palette[0])}`)

// Generate palette
function getOrchestraPalette() {
  let type = d3.select('input[name="orchestraType"]:checked').node().value
  if (type === 'highContrast') {
    return getHighContrastOrchestraPalette()
  } else if (type === 'lowContrast') {
    return getLowContrastOrchestraPalette()
  }
}

function getHighContrastOrchestraPalette() {
  let darkL = {
    min: 0.0,
    max: 0.2,
  }

  let lightL = {
    min: 0.9,
    max: 1.0,
  }

  let color1 = {
    h: _.random(0, 360),
    s: _.floor(_.random(.1, .5, true), 2),
    l: _.floor(_.random(darkL.min, darkL.max, true), 2),
  }

  let color2 = {
    h: Math.abs(color1.h - 180),
    s: _.floor(_.random(.1, .5, true), 2),
    l: _.floor(_.random(lightL.min, lightL.max, true), 2),
  }

  let color3 = color2

  return [color1, color2, color3]
}

function getLowContrastOrchestraPalette() {
  let color1 = {
    h: _.random(0, 360),
    s: _.floor(_.random(.1, .4, true), 2),
    l: _.floor(_.random(.6, .8, true), 2),
  }

  let color2 = {
    h: getRandomHue(color1.h, .2),
    s: _.floor(_.random(.1, .4, true), 2),
    l: _.floor(_.random(.3, .5, true), 2),
  }

  let color3 = {
    h: (color1.h + _.random(100, 130)) % 360,
    s: _.floor(_.random(.1, .4, true), 2),
    l: _.floor(_.random(.3, .5, true), 2),
  }

  return [color1, color2, color3]
}


// Generate dataset
let avoidCross = false

function generateLine(startX, startY) {
  let random
  let type = d3.select('input[name="orchestraType"]:checked').node().value
  random = _.random(2, 3)

  // If the previous line was diagonal, the current line should not be.
  // This is to avoid making a cross, which Orchestra does not have.
  if (avoidCross) {
    random = _.random(2, 3)
  } else {
    random = _.random(0, 3)
  }

  // Line 0: Down and to the left
  if (random === 0) {
    avoidCross = true
    return {
      line: `M ${startX} ${startY} L ${startX - pixelValue} ${startY + pixelValue} `,
      type: 'down-left'
    }
  // Line 1: Down and to the right
  } else if (random === 1) {
    avoidCross = true
    return {
      line: `M ${startX} ${startY} L ${startX + pixelValue} ${startY + pixelValue} `,
      type: 'down-right'
    }
  // Line 2.1: Horizontal, left
  } else if (random === 2 && type === 'highContrast') {
    avoidCross = false
    return {
      line: `M ${startX} ${startY} L ${startX - pixelValue} ${startY} `,
      type: 'horizontal'
    }
  // Line 2.2: Straight down
  } else if (random === 2 && type === 'lowContrast') {
    avoidCross = false
    return {
      line: `M ${startX} ${startY} L ${startX} ${startY + pixelValue} `,
      type: 'horizontal'
    }
  // Line 3: None
  } else if (random === 3) {
    avoidCross = false
    return {
      line: ``,
      type: ``
    }
  }
}

let downLeftLineDataset = ''
let downRightLineDataset = ''
let horizontalDataset = ''

function getLineDataset() {
  downLeftLineDataset = ''
  downRightLineDataset = ''
  horizontalDataset = ''
  for (let y = 0; y < orchestra.columnCount; y++) {
    for (let x = 0; x < orchestra.columnCount; x ++) {
      let startX = pixelValue * x
      let startY = pixelValue * y

      let random = _.random(0, 2)
      let result = generateLine(startX, startY)
      let line = result.line
      let lineType = result.type
      if (lineType === 'down-left') {
        downLeftLineDataset += line
      } else if (lineType === 'down-right') {
        downRightLineDataset += line
      } else if (lineType === 'horizontal') {
        horizontalDataset += line
      }
    }
  }
}

orchestra.wrapper =
  orchestra.canvas.append('g')
    .attr('class', 'wrapper')
    .style('transform', `translate(${orchestra.padding}px, ${orchestra.padding}px)`)

orchestra.backgroundLines =
  orchestra.wrapper.append('g')
    .attr('class', 'background')
    .attr('width', orchestra.columnCount * pixelValue)
    .attr('height', orchestra.columnCount * pixelValue)

orchestra.midgroundLines =
  orchestra.wrapper.append('g')
    .attr('class', 'midground')
    .attr('width', orchestra.columnCount * pixelValue)
    .attr('height', orchestra.columnCount * pixelValue)
    .attr('x', orchestra.padding)
    .attr('y', orchestra.padding)

orchestra.foregroundLines =
  orchestra.wrapper.append('g')
    .attr('class', 'foreground')
    .attr('width', orchestra.columnCount * pixelValue)
    .attr('height', orchestra.columnCount * pixelValue)
    .attr('x', orchestra.padding)
    .attr('y', orchestra.padding)


// Draw
function redrawOrchestra() {
  orchestra.palette = getOrchestraPalette()
  getLineDataset()
  setOrchestraSwatches(orchestra.palette)

  orchestra.canvas.selectAll('g.background > path').remove()
  orchestra.canvas.selectAll('g.midground > path').remove()
  orchestra.canvas.selectAll('g.foreground > path').remove()

  orchestra.canvas.style('background-color', `${getHsl(orchestra.palette[0])}`)

  let dataSuperset = _.shuffle([downLeftLineDataset, downRightLineDataset, horizontalDataset])

  orchestra.backgroundLines.selectAll('path.background-line')
    .data([1])
    .enter()
    .append('path')
      .attr('d', dataSuperset[0])
      .attr('fill', 'none')
      .attr('stroke', `${getHsl(orchestra.palette[1])}`)
      .attr('class', 'background-line')

  orchestra.midgroundLines.selectAll('path.midground-line')
    .data([1])
    .enter()
    .append('path')
      .attr('d', dataSuperset[1])
      .attr('fill', 'none')
      .attr('stroke', `${getHsl(orchestra.palette[2])}`)
      .attr('class', 'midground-line')

  orchestra.foregroundLines.selectAll('path.foreground-line')
    .data([1])
    .enter()
    .append('path')
      .attr('d', dataSuperset[2])
      .attr('fill', 'none')
      .attr('stroke', `${getHsl(orchestra.palette[2])}`)
      .attr('class', 'foreground-line')
}

function setOrchestraSwatches(colors) {
  _.forEach(colors, (color, i) => {
    d3.select(`#orchestra${i + 1}-h`).property('value', `${color.h}`)
    d3.select(`#orchestra${i + 1}-s`).property('value', `${color.s * 100}`)
    d3.select(`#orchestra${i + 1}-l`).property('value', `${color.l * 100}`)
    d3.select(`#orchestra${i + 1}-swatch`).style('background-color', getHsl(color))
  })
}

redrawOrchestra()

// Interaction
foregroundRotate = 15
midgroundRotate = foregroundRotate * .9
backgroundRotate = midgroundRotate * .9
foregroundTranslate = orchestra.width * 0.02
midgroundTranslate = foregroundTranslate * 0.6
backgroundTranslate = midgroundTranslate * 0.6

orchestra.cursorScale = d3.scaleLinear()
  .domain([0, fox.width])
  .range([-1, 1])
  .clamp(true)

orchestra.foregroundRotateScale = d3.scaleLinear()
  .domain([-1, 1])
  .range([(foregroundRotate * -1), foregroundRotate])
  .clamp(true)

orchestra.foregroundTranslateScale = d3.scaleLinear()
  .domain([-1, 1])
  .range([(foregroundTranslate * -1), foregroundTranslate])
  .clamp(true)

orchestra.midgroundRotateScale = d3.scaleLinear()
  .domain([-1, 1])
  .range([(midgroundRotate * -1), midgroundRotate])
  .clamp(true)

orchestra.midgroundTranslateScale = d3.scaleLinear()
  .domain([-1, 1])
  .range([(midgroundTranslate * -1), midgroundTranslate])
  .clamp(true)

orchestra.backgroundRotateScale = d3.scaleLinear()
  .domain([-1, 1])
  .range([(backgroundRotate * -1), backgroundRotate])
  .clamp(true)

orchestra.backgroundTranslateScale = d3.scaleLinear()
  .domain([-1, 1])
  .range([(backgroundTranslate * -1), backgroundTranslate])
  .clamp(true)

function foregroundTransformString(xCoordinate, yCoordinate) {
  let scaledX = orchestra.cursorScale(xCoordinate)
  let scaledY = orchestra.cursorScale(yCoordinate)
  let rotateXString = `rotateY(${orchestra.foregroundRotateScale(scaledX)}deg)`
  let rotateYString = `rotateX(${orchestra.foregroundRotateScale(scaledY) * -1}deg)`
  let rotateZString = `rotateZ(0)`
  let rotateString = `${rotateXString} ${rotateYString} ${rotateZString}`
  let translateXString = `translateX(${orchestra.foregroundTranslateScale(scaledX)}px)`
  let translateYString = `translateY(${orchestra.foregroundTranslateScale(scaledY)}px)`
  return `perspective(${orchestra.width * 3}px) ${rotateString} ${translateXString} ${translateYString}`
}

function midgroundTransformString(xCoordinate, yCoordinate) {
  let scaledX = orchestra.cursorScale(xCoordinate)
  let scaledY = orchestra.cursorScale(yCoordinate)
  let rotateXString = `rotateY(${orchestra.midgroundRotateScale(scaledX)}deg)`
  let rotateYString = `rotateX(${orchestra.midgroundRotateScale(scaledY) * -1}deg)`
  let rotateZString = `rotateZ(0)`
  let rotateString = `${rotateXString} ${rotateYString} ${rotateZString}`
  let translateXString = `translateX(${orchestra.midgroundTranslateScale(scaledX)}px)`
  let translateYString = `translateY(${orchestra.midgroundTranslateScale(scaledY)}px)`
  return `perspective(${orchestra.width * 3}px) ${rotateString} ${translateXString} ${translateYString}`
}

function backgroundTransformString(xCoordinate, yCoordinate) {
  let scaledX = orchestra.cursorScale(xCoordinate)
  let scaledY = orchestra.cursorScale(yCoordinate)
  let rotateXString = `rotateY(${orchestra.backgroundRotateScale(scaledX)}deg)`
  let rotateYString = `rotateX(${orchestra.backgroundRotateScale(scaledY) * -1}deg)`
  let rotateZString = `rotateZ(0)`
  let rotateString = `${rotateXString} ${rotateYString} ${rotateZString}`
  let translateXString = `translateX(${orchestra.backgroundTranslateScale(scaledX)}px)`
  let translateYString = `translateY(${orchestra.backgroundTranslateScale(scaledY)}px)`
  return `perspective(${orchestra.width * 3}px) ${rotateString} ${translateXString} ${translateYString}`
}

orchestra.canvas.on('mousemove', function () {
  let xCoordinate = d3.mouse(this)[0]
  let yCoordinate = d3.mouse(this)[1]
  animateOrchestra(xCoordinate, yCoordinate)
})

function animateOrchestra(x, y) {
  orchestra.foregroundLines
    .style('transform', foregroundTransformString(x, y))
    .style('transform-origin', '50% 50% 0')
    .style('transition', 'none')
  orchestra.midgroundLines
    .style('transform', midgroundTransformString(x, y))
    .style('transform-origin', '50% 50% 0')
    .style('transition', 'none')
  orchestra.backgroundLines
    .style('transform', backgroundTransformString(x, y))
    .style('transform-origin', '50% 50% 0')
    .style('transition', 'none')
}

orchestra.canvas.on('mouseup', () => {
  redrawOrchestra()
})

orchestra.canvas.on('mouseleave', function () {
  orchestra.foregroundLines
    .style('transform', `translate(0, 0)`)
    .style('transition', 'all 250ms ease-in-out')
  orchestra.midgroundLines
    .style('transform', `translate(0, 0)`)
    .style('transition', 'all 250ms ease-in-out')
  orchestra.backgroundLines
    .style('transform', `translate(0, 0)`)
    .style('transition', 'all 250ms ease-in-out')
})


// Listeners
d3.selectAll('.orchestra-input').on('input', () => {
  // Get values from input fields
  let colors = []
  _.forEach(_.range(1, 3), (index) => {
    let color = {
      h: parseFloat(d3.select(`#orchestra${index}-h`).property('value')),
      s: parseFloat(d3.select(`#orchestra${index}-s`).property('value')) / 100,
      l: parseFloat(d3.select(`#orchestra${index}-l`).property('value')) / 100,
    }
    colors.push(color)
  })

  orchestra.palette = colors
  redrawOrchestra()
})
