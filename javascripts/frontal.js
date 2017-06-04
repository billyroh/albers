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
let penne = angelHair * 3

// Helper functions for getting the x position of each of the elements.
function getPennePosition(index) {
  // index is out of 17
  return index * angelHair * 10
}

function getAngelHairPosition(index) {
  // index is out of 48
  let pennePosition = getPennePosition(_.floor(index / 3))
  let penneElement = pennePosition + penne
  let subIndex = index % 3
  return penneElement + angelHair + (subIndex * angelHair * 2)
}

// Helper functions for creating the data for each of the elements.
function generateDarkPenne(startX) {
  let result = []

  let minWidth = _.round(frontal.width * 0.075)
  let maxWidth = _.round(frontal.width * 0.1)
  let width = _.random(minWidth, maxWidth)

  let minX = startX
  let maxX = startX + _.round(frontal.width * 0.3)
  let xPosition = _.random(minX, maxX)

  let minY = _.random(1, 8)
  let numberOfRows = _.random(6, 8)

  for (let i = minY; i < minY + numberOfRows; i++) {
    let row = {
      x: xPosition,
      y: getPennePosition(i),
      width: width,
    }
    result.push(row)
  }

  return result
}

function generateDarkAngelHair(startX) {
  let result = []

  let minWidth = _.round(frontal.width * 0.5)
  let maxWidth = _.round(frontal.width * 0.8)
  let width = _.random(minWidth, maxWidth)

  let minX = startX
  let maxX = startX + _.round(frontal.width * 0.3)
  let xPosition = _.random(minX, maxX)

  let minY = _.random(1, 8)
  let numberOfRows = _.random(4, 8)

  for (let i = minY; i < minY + numberOfRows; i++) {
    let index = getDarkAngelHairIndex(i)
    let row = {
      x: xPosition,
      y: getAngelHairPosition(index),
      width: width,
    }
    result.push(row)
  }

  return result
}

function getDarkAngelHairIndex(index) {
  return 1 + ((index - 1) * 3)
}

function generateLightAngelHair(startX) {
  let result = []

  let minWidth = _.round(frontal.width * 0.5)
  let maxWidth = _.round(frontal.width * 0.8)
  let width = _.random(minWidth, maxWidth)

  let minX = startX
  let maxX = startX + _.round(frontal.width * 0.3)
  let xPosition = _.random(minX, maxX)

  let minY = _.random(1, 8)
  let numberOfRows = _.random(4, 8)

  for (let i = minY; i < minY + numberOfRows; i++) {
    let index = getLightAngelHairIndex(i)
    let row = {
      x: xPosition,
      y: getAngelHairPosition(index),
      width: width,
    }
    result.push(row)
  }

  return result
}

function getLightAngelHairIndex(index) {
  // if 0
  if (index === 0) {
    return 0
  // if even
  } else if (index % 2 === 0) {
    return 2 + (3 * (index - 1))
  // if odd
  } else if (index % 2 === 1) {
    return 3 + (3 * (index - 1))
  }
}

// Dark penne
let numberOfPenneColumns = _.random(4, 6)
let darkPenneData = []
let previousX = 0

for (let i = 0; i < numberOfPenneColumns; i++) {
  let minX = _.round(frontal.width * 0.05)
  let maxX = _.round(frontal.width * 0.2)
  let startX = previousX + _.random(minX, maxX)
  darkPenneData.push(generateDarkPenne(startX))
  previousX = startX
}

darkPenneData = _.flatten(darkPenneData)

// Dark angel hair
let numberOfDarkAngelHairColumns = _.random(4, 6)
let darkAngelHairData = []
previousX = 0

for (let i = 0; i < numberOfDarkAngelHairColumns; i++) {
  let minX = _.round(frontal.width * 0.05)
  let maxX = _.round(frontal.width * 0.2)
  let startX = previousX + _.random(minX, maxX)
  darkAngelHairData.push(generateDarkAngelHair(startX))
  previousX = startX
}

darkAngelHairData = _.flatten(darkAngelHairData)

// Light angel hair
let numberOfLightAngelHairColumns = _.random(4, 6)
let lightAngelHairData = []
previousX = 0

for (let i = 0; i < numberOfLightAngelHairColumns; i++) {
  let minX = _.round(frontal.width * 0.05)
  let maxX = _.round(frontal.width * 0.2)
  let startX = previousX + _.random(minX, maxX)
  lightAngelHairData.push(generateLightAngelHair(startX))
  previousX = startX
}

lightAngelHairData = _.flatten(lightAngelHairData)

// Draw
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
