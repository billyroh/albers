// SECOND MOVEMENT II
// ANNI ALBERS

// Basic variables
let movement = {
  maxWidth: 500,
  primaryColor: {h: 39, s: .16, l: .32},
  accentColor: {h: 45, s: .89, l: .54},
  backgroundColor: {h: 40, s: .43, l: .97},
  triangleData: [],
}

movement.triangleHeight = movement.maxWidth / 4 / 8

for (let i = 0; i < movement.triangleHeight; i++) {
  movement.triangleData.push({})
}

// d3 setup
movement.canvas = d3.select('#movement')
                  .append('svg')
                  .attr('width', movement.maxWidth)
                  .attr('height', movement.maxWidth)
                  .attr('fill', movement.backgroundColor)

movement.triangles = movement.canvas.selectAll('polygon')
                  .data(movement.triangleData)
                  .enter()
                  .append('polygon')

// Drawing the content
movement.triangles.attr('points', (d, i) => getPoints(i))
  .attr('fill', movement.primaryColor)

function getPoints(index) {
  let point1 = `${(index * movement.triangleHeight)}, ${movement.triangleHeight}`
  let point2 = `${(index * movement.triangleHeight + movement.triangleHeight)}, ${movement.triangleHeight}`
  let point3 = `${(index * movement.triangleHeight)}, ${movement.triangleHeight * 2}`
  return `${point1}, ${point2}, ${point3}`
}
