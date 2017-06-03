// Basic variables
var frontal = {
  width: d3.select('#frontal').node().getBoundingClientRect().width,
  dataset: [],
}

let frontalColor = '#D7781C'

// d3 setup
frontal.canvas = d3.select('#frontal')
                  .style('background-color', frontalColor)
                  .append('svg')
                  .attr('width', frontal.width)
                  .attr('height', frontal.width)
                  .style('fill', frontalColor)

// I'm using this naming scheme because narrow/wide, short/tall gets confusing.
let angelHair = _.round(frontal.width / 200)
let penne = angelHair *  4

function generateDarkPenne() {
  let result = []
  let minWidth = _.round(frontal.width * 0.1)
  let maxWidth = _.round(frontal.width * 0.2)
  let width = _.random(minWidth, maxWidth)
  let numberOfRows = _.random(6, 8)
  let xPosition = _.random(minWidth, maxWidth)
  let yPosition = _.random(minWidth, maxWidth)

  for (let i = 0; i < numberOfRows; i++) {
    let row = {
      x: xPosition,
      y: yPosition + (i * angelHair * 10),
      width: width,
    }
    result.push(row)
  }
  return result
}

function generateDarkAngelHair() {
  let result = []
  let minWidth = _.round(frontal.width * 0.5)
  let maxWidth = _.round(frontal.width * 0.8)
  let width = _.random(minWidth, maxWidth)
  let numberOfRows = _.random(4, 8)
  let xPosition = _.random(minWidth, maxWidth)
  let yPosition = _.random(minWidth, maxWidth)

  for (let i = 0; i < numberOfRows; i++) {
    let row = {
      x: xPosition,
      y: yPosition + (i * angelHair * 13),
      width: width,
    }
    result.push(row)
  }
  return result
}


let darkAngelHairData = generateDarkAngelHair()
let lightAngelHairData = generateDarkAngelHair()
let darkPenneData = generateDarkPenne()

frontal.darkAngelHair = frontal.canvas.selectAll('rect.dark-angel-hair')
                  .data(darkAngelHairData)
                  .enter()
                  .append('rect')

frontal.darkAngelHair.attr('width', d => d.width)
  .attr('height', angelHair)
  .attr('fill', 'black')
  .attr('x', d => d.x)
  .attr('y', d => d.y)
  .attr('class', 'dark-angel-hair')

frontal.lightAngelHair = frontal.canvas.selectAll('rect.light-angel-hair')
                  .data(lightAngelHairData)
                  .enter()
                  .append('rect')

frontal.lightAngelHair.attr('width', d => d.width)
  .attr('height', angelHair)
  .attr('fill', 'white')
  .attr('x', d => d.x)
  .attr('y', d => d.y)
  .attr('class', 'light-angel-hair')

frontal.darkPenne = frontal.canvas.selectAll('rect.dark-penne')
                  .data(darkPenneData)
                  .enter()
                  .append('rect')

frontal.darkPenne.attr('width', d => d.width)
  .attr('height', penne)
  .attr('fill', 'black')
  .attr('x', d => d.x)
  .attr('y', d => d.y)
  .attr('class', 'dark-penne')
