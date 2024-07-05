import * as d3 from 'https://cdn.jsdelivr.net/npm/d3@7/+esm'

const movieDataSetEndpoint =
  'https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json'

const movieDataSet = await d3.json(movieDataSetEndpoint)

const tooltipContainer = d3.select('.tooltip-container')

const tooltip = tooltipContainer.append('div')
  .attr('id', 'tooltip')
  .classed('tooltip', true)

tooltipContainer.append('div')
  .classed('tooltip-pointer', true)

const WIDTH = 1000
const HEIGHT = 600

const treemapSVG = d3.select('.svg-container')
  .append('svg')
  .attr('width', WIDTH)
  .attr('height', HEIGHT)
  .classed('treemap', true)

const root = d3.hierarchy(movieDataSet)
  .sum(d => d.value)
  .sort((a, b) => b.height - a.height || b.value - a.value)

const treemap = d3.treemap()
  .size([WIDTH, HEIGHT])
  .padding(1)

treemap(root)

const categoryGroups = treemapSVG.selectAll('g')
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

const LEGEND_HEIGHT = 200
const LEGEND_PADDING = 50
const LEGEND_RECT_SIZE = 15

const legendInnerWidth =  WIDTH - 2 * LEGEND_PADDING
const legendInnerHeight =  LEGEND_HEIGHT - 2 * LEGEND_PADDING
const elementsPerRow = 4

const legendSVG = d3.select('.svg-container')
  .append('svg')
  .attr('width', WIDTH)
  .attr('height', LEGEND_HEIGHT)
  .attr('id', 'legend')
  .classed('legend', true)

const legendElements = legendSVG.selectAll('g')
  .data(categories)
  .join('g')
  .attr('transform', (_, i) => `translate(${i % elementsPerRow * legendInnerWidth / elementsPerRow + LEGEND_PADDING}, ${Math.floor(i / elementsPerRow) * legendInnerHeight + LEGEND_PADDING})`)

legendElements.append('rect')
  .attr('width', LEGEND_RECT_SIZE)
  .attr('height', LEGEND_RECT_SIZE)
  .attr('fill', d => color(d))
  .classed('legend-item', true)

legendElements.append('text')
  .classed('legend-text', true)
  .text(d => d[0].toUpperCase() + d.slice(1))
