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
  let random = _.random(0, 4)

  // Line 0: Down and to the left
  if (random === 0) {
    return `M ${startX} ${startY} L ${startX - pixelValue} ${startY + pixelValue} `
  // Line 1: Down and to the right
  } else if (random === 1) {
    return `M ${startX} ${startY} L ${startX + pixelValue} ${startY + pixelValue} `
  // Line 2: Horizontal, left
  } else if (random === 2) {
    return `M ${startX} ${startY} L ${startX - pixelValue} ${startY} `
  // Line 3: Horizontal, right
  } else if (random === 3) {
    return `M ${startX} ${startY} L ${startX + pixelValue} ${startY} `
  // Line 4: None
  } else if (random === 4) {
    return ``
  }
}

let foregroundLineDataset = ''
let backgroundLineDataset = ''

for (let x = 0; x < orchestra.columnCount; x ++) {
  for (let y = 0; y < orchestra.columnCount; y++) {
    let startX = orchestra.padding + (pixelValue * x)
    let startY = orchestra.padding + (pixelValue * y)

    let random = _.random(0, 1)
    if (random === 0) {
      let line = generateLine(startX, startY)
      foregroundLineDataset += line
    } else if (random === 1) {
      let line = generateLine(startX, startY)
      backgroundLineDataset += line
    }
  }
}

// Draw
orchestra.foregroundLines = orchestra.canvas.selectAll('path.foreground-line')
                  .data([1])
                  .enter()
                  .append('path')

orchestra.foregroundLines.attr('d', foregroundLineDataset)
  .attr('fill', 'none')
  .attr('stroke', 'white')
  .attr('class', 'foreground-line')

orchestra.backgroundLines = orchestra.canvas.selectAll('path.background-line')
                  .data([1])
                  .enter()
                  .append('path')

orchestra.backgroundLines.attr('d', backgroundLineDataset)
  .attr('fill', 'none')
  .attr('stroke', 'white')
  .attr('class', 'background-line')

// Interaction
orchestra.cursorScale = d3.scaleLinear()
  .domain([0, fox.width])
  .range([-1, 1])
  .clamp(true)

orchestra.rotateXScale = d3.scaleLinear()
  .domain([-1, 1])
  .range([-30, 30])
  .clamp(true)

orchestra.canvas.on('mousemove', function () {
  let xCoordinate = d3.mouse(this)[0]
  let yCoordinate = d3.mouse(this)[1]
  let scaledX = orchestra.cursorScale(xCoordinate)
  let scaledY = orchestra.cursorScale(yCoordinate)

  orchestra.foregroundLines
    .style('transform', `rotateY(${orchestra.rotateXScale(scaledX)}deg)`)
  orchestra.backgroundLines
    .style('transform', `rotateY(-${orchestra.rotateXScale(scaledX)}deg)`)
})
