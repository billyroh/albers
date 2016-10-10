// HOMAGE TO THE SQUARE

// Basic variables
let maxWidth = 200;
let minWidth = 80;

// Palette
let innerColor = {h: 55, s: .92, l: .65}
let outerColor = {h: 79, s: .58, l: .48}

let homageDataset = []

function generatePalette(iterationCount) {
  let hIncrement = (innerColor.h - outerColor.h) / (iterationCount - 1);
  let sIncrement = (innerColor.s - outerColor.s) / (iterationCount - 1);
  let lIncrement = (innerColor.l - outerColor.l) / (iterationCount - 1);

  for (i of Array(iterationCount).keys()) {
    let color = {
      h: (outerColor.h + (hIncrement * i)),
      s: (outerColor.s + (sIncrement * i)),
      l: (outerColor.l + (lIncrement * i))
    };
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
  squares.attr('x', (d, i) => getX(i))
         .attr('y', (d, i) => getY(i))
}

function getX(index) {
  return (maxWidth - getWidth(index)) / 2
}

function getY(index) {
  let increment = maxWidth * 0.05;
  return maxWidth - getWidth(index) - (increment * index)
}

// Interaction
// TODO make the squares's xy coordinates gravitate toward the cursor
// TODO (bonus point) make the square rotate/twist toward the cursor too
homageCanvas.on('mousemove', function () {
  // 1. get cursor coordinates
  // 2. figure out if it's
  let cursorThreshold = maxWidth * 0.1
  let xCoordinate = d3.mouse(this)[0]

  let cursorScale = d3.scaleLinear()
    .domain([cursorThreshold, maxWidth - cursorThreshold])
    .range([maxWidth * -0.1, maxWidth * 0.1])
    .clamp(true)

  // getX(i) + (someIncrement * someCoefficient)
  // someCoefficient is percentage of how far the cursor is from the center
  squares.attr('x', (d, i) => {
    return getX(i) + cursorScale(xCoordinate)
  })
})

homageCanvas.on('mouseout', function () {
  squares.attr('x', (d, i) => {
    setCoordinates()
  })
})
