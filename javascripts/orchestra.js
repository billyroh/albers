// Basic variables
var orchestra = {
  width: d3.select('#frontal').node().getBoundingClientRect().width,
}

// d3 setup
orchestra.canvas = d3.select('#orchestra')
                  .style('background-color', 'black')
                  .append('svg')
                  .attr('width', orchestra.width)
                  .attr('height', orchestra.width)
                  .style('fill', 'black')

orchestra.columnCount = 22
orchestra.padding = _.round(orchestra.width * 0.15)
let pixelValue = _.round((orchestra.width - orchestra.padding * 2) / orchestra.columnCount)

function generateLine(startX, startY) {
  let random = _.random(0, 3)

  // Line 0: Down and to the left
  if (random === 0) {
    return {
      line: `M ${startX} ${startY} L ${startX - pixelValue} ${startY + pixelValue} `,
      type: 'down-left'
    }
  // Line 1: Down and to the right
  } else if (random === 1) {
    return {
      line: `M ${startX} ${startY} L ${startX + pixelValue} ${startY + pixelValue} `,
      type: 'down-right'
    }
  // Line 2: Horizontal, left
  } else if (random === 2) {
    return {
      line: `M ${startX} ${startY} L ${startX - pixelValue} ${startY} `,
      type: 'horizontal'
    }
  // Line 3: None
} else if (random === 3) {
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
  for (let x = 0; x < orchestra.columnCount; x ++) {
    for (let y = 0; y < orchestra.columnCount; y++) {
      let startX = orchestra.padding + (pixelValue * x)
      let startY = orchestra.padding + (pixelValue * y)

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

// Draw
function redrawOrchestra() {
  getLineDataset()

  orchestra.canvas.selectAll('path.background-line').remove()
  orchestra.canvas.selectAll('path.midground-line').remove()
  orchestra.canvas.selectAll('path.foreground-line').remove()

  let dataSuperset = _.shuffle([downLeftLineDataset, downRightLineDataset, horizontalDataset])

  orchestra.backgroundLines =
    orchestra.canvas.selectAll('path.background-line')
      .data([1])
      .enter()
      .append('path')

  orchestra.backgroundLines.attr('d', dataSuperset[0])
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('class', 'background-line')

  orchestra.midgroundLines =
    orchestra.canvas.selectAll('path.midground-line')
      .data([1])
      .enter()
      .append('path')

  orchestra.midgroundLines.attr('d', dataSuperset[1])
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('class', 'midground-line')

  orchestra.foregroundLines =
    orchestra.canvas.selectAll('path.foreground-line')
      .data([1])
      .enter()
      .append('path')

  orchestra.foregroundLines.attr('d', dataSuperset[2])
    .attr('fill', 'none')
    .attr('stroke', 'white')
    .attr('class', 'foreground-line')
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

orchestra.midgroundScaleScale = d3.scaleLinear()
  .domain([0, 0.7])
  .range([1, 1])
  .clamp(true)

orchestra.backgroundScaleScale = d3.scaleLinear()
  .domain([0, 0.7])
  .range([1, 1])
  .clamp(true)

orchestra.midgroundOpacityScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, 0.15])
  .clamp(true)

orchestra.backgroundOpacityScale = d3.scaleLinear()
  .domain([0, 1])
  .range([0, 0.3])
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
  // return `${rotateString} ${translateXString} ${translateYString}`
  return `perspective(${orchestra.width * 3}px) ${rotateString} ${translateXString} ${translateYString}`
}

function midgroundTransformString(xCoordinate, yCoordinate) {
  let scaledX = orchestra.cursorScale(xCoordinate)
  let scaledY = orchestra.cursorScale(yCoordinate)
  let rotateXString = `rotateY(${orchestra.midgroundRotateScale(scaledX)}deg)`
  let rotateYString = `rotateX(${orchestra.midgroundRotateScale(scaledY) * -1}deg)`
  let rotateZString = `rotateZ(0)`
  let rotateString = `${rotateXString} ${rotateYString} ${rotateZString}`
  let scaleString = `scale(${orchestra.midgroundScaleScale(Math.abs(scaledX) + Math.abs(scaledY))})`
  let translateXString = `translateX(${orchestra.midgroundTranslateScale(scaledX)}px)`
  let translateYString = `translateY(${orchestra.midgroundTranslateScale(scaledY)}px)`
  // return `${rotateString} ${scaleString} ${translateXString} ${translateYString}`
  return `perspective(${orchestra.width * 3}px) ${rotateString} ${translateXString} ${translateYString}`
}

function backgroundTransformString(xCoordinate, yCoordinate) {
  let scaledX = orchestra.cursorScale(xCoordinate)
  let scaledY = orchestra.cursorScale(yCoordinate)
  let rotateXString = `rotateY(${orchestra.backgroundRotateScale(scaledX)}deg)`
  let rotateYString = `rotateX(${orchestra.backgroundRotateScale(scaledY) * -1}deg)`
  let rotateZString = `rotateZ(0)`
  let rotateString = `${rotateXString} ${rotateYString} ${rotateZString}`
  let scaleString = `scale(${orchestra.backgroundScaleScale(Math.abs(scaledX) + Math.abs(scaledY))})`
  let translateXString = `translateX(${orchestra.backgroundTranslateScale(scaledX)}px)`
  let translateYString = `translateY(${orchestra.backgroundTranslateScale(scaledY)}px)`
  // return `${rotateString} ${scaleString} ${translateXString} ${translateYString}`
  return `perspective(${orchestra.width * 3}px) ${rotateString} ${scaleString} ${translateXString} ${translateYString}`
}

function midgroundOpacity(xCoordinate, yCoordinate) {
  let scaledX = orchestra.cursorScale(xCoordinate)
  let scaledY = orchestra.cursorScale(yCoordinate)
  return 1 - orchestra.midgroundOpacityScale(Math.abs(scaledX) + Math.abs(scaledY))
}

function backgroundOpacity(xCoordinate, yCoordinate) {
  let scaledX = orchestra.cursorScale(xCoordinate)
  let scaledY = orchestra.cursorScale(yCoordinate)
  return 1 - orchestra.backgroundOpacityScale(Math.abs(scaledX) + Math.abs(scaledY))
}

orchestra.canvas.on('mousemove', function () {
  let xCoordinate = d3.mouse(this)[0]
  let yCoordinate = d3.mouse(this)[1]

  orchestra.foregroundLines
    .style('transform', foregroundTransformString(xCoordinate, yCoordinate))
    .style('transform-origin', '50% 50% 0')
  orchestra.midgroundLines
    .style('transform', midgroundTransformString(xCoordinate, yCoordinate))
    .style('transform-origin', '50% 50% 0')
  orchestra.backgroundLines
    .style('transform', backgroundTransformString(xCoordinate, yCoordinate))
    .style('opacity', backgroundOpacity(xCoordinate, yCoordinate))
    .style('transform-origin', '50% 50% 0')
})
