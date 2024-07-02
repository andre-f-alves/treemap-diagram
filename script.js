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

const root = d3.hierarchy(movieDataSet)
  .sum(d => d.value)
  .sort((a, b) => b.height - a.height || b.value - a.value)

const treemap = d3.treemap()
  .size([width, height])
  .padding(1)
  .tile(d3.treemapBinary)

treemap(root)

const categories = svg.selectAll('g')
  .data(root.children)
  .join('g')
  .attr('class', d => d.data.name.toLowerCase())
  .classed('category', true)

const tileContainers = categories.selectAll('g')
  .data(d => root.leaves().filter(leaf => leaf.data.category === d.data.name))
  .join('g')
  .attr('transform', d => `translate(${d.x0}, ${d.y0})`)
  .classed('tile-container', true)

tileContainers.append('rect')
  .attr('width', d => d.x1 - d.x0)
  .attr('height', d => d.y1 - d.y0)
  .attr('fill', 'gray')
  .classed('tile', true)

tileContainers.append('text')
  .classed('tile-label', true)
  .text(d => d.data.name.trim())
