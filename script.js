import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'

const movieDataSetEndpoint =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'

const movieDataSet = await d3.json(movieDataSetEndpoint)

const tooltip = d3.select('main')
  .insert('div', '.svg-container')
  .attr('id', 'tooltip')
  .classed('tooltip', true)

const width = 1000
const height = 700
const padding = 50

const svg = d3.select('.svg-container')
  .append('svg')
  .attr('width', width)
  .attr('height', height)
