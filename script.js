import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'

const movieDataSetEndpoint =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'

const movieDataSet = await d3.json(movieDataSetEndpoint)

const tooltipContainer = d3.select('.tooltip-container')

const tooltipPointer = tooltipContainer.append('div')
  .classed('tooltip-pointer', true)

const tooltip = tooltipContainer.append('div')
  .attr('id', 'tooltip')
  .classed('tooltip', true)


const width = 1000
const height = 600

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

treemap(root)

const categoryGroups = svg.selectAll('g')
  .data(root.children)
  .join('g')
  .attr('class', d => d.data.name.toLowerCase())
  .classed('category', true)

const categories = categoryGroups.nodes().map(node => node.classList[0])
const colorScheme = d3.schemeCategory10.slice(0, categories.length)

const color = d3.scaleOrdinal(categoryGroups, colorScheme)

const tileContainers = categoryGroups.selectAll('g')
  .data(d => root.leaves().filter(leaf => leaf.data.category === d.data.name))
  .join('g')
  .attr('transform', d => `translate(${d.x0}, ${d.y0})`)
  .classed('tile-container', true)

const tiles = tileContainers.append('rect')
  .attr('width', d => d.x1 - d.x0)
  .attr('height', d => d.y1 - d.y0)
  .attr('data-name', d => d.data.name)
  .attr('data-category', d => d.data.category)
  .attr('data-value', d => d.data.value)
  .attr('fill', d => color(d.data.category))
  .classed('tile', true)

tileContainers.append('text')
  .classed('tile-label', true)

tiles.on('mouseover', (event, d) => {
  const x = event.target.getBoundingClientRect().x + scrollX
  const y = event.target.getBoundingClientRect().y + scrollY

  tooltipContainer.classed('active', true)
    .style('left', x + 'px')
    .style('top', y + 'px')

  tooltip.attr('data-value', d.data.value)
    .html(`
      <span><strong>Movie:</strong> ${d.data.name.trim()}</span>
      <span><strong>Category:</strong> ${d.data.category}</span>
      <span><strong>Value:</strong> ${d.data.value}</span>
    `)
})

tiles.on('mouseout', () => tooltipContainer.classed('active', false))
