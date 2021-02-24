const getDataset = () => {
    fetch(
        'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'
    )
        .then(response => response.json())
        .then(data => drawGraph(data.data));
};

getDataset();

const convertToDate = (str) => {
  const date = str.split('-')
  return new Date(date[0], date[1], date[2])
}

const drawGraph = dataset => {
    const w = 700;
    const h = 500;
    const p = 50;

    const svg = d3
        .select('#chart')
        .append('svg')
        .attr('id', 'svg-area')
        .attr('width', w)
        .attr('height', h);

    const xScale = d3
        .scaleTime()
        .domain([
          convertToDate(dataset[0][0]),
          convertToDate(dataset[dataset.length - 1][0])
        ])
        .range([p, w - p])

    const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, d => d[1])])
        .range([h - p, p]);

    const yAxis = d3.axisLeft(yScale);
    const xAxis = d3.axisBottom(xScale);

    svg.append('g')
        .attr('transform', `translate(${p}, 0)`)
        .attr('id', 'y-axis')
        .call(yAxis);

    svg.append('g')
        .attr('transform', `translate(0, ${h - p})`)
        .attr('id', 'x-axis')
        .call(xAxis);

    svg.selectAll('rect')
        .data(dataset)
        .enter()
        .append('rect')
        .attr('x', d => xScale(convertToDate(d[0])))
        .attr('y', d => yScale(d[1]))
        .attr('width', (w - p - p) / dataset.length)
        .attr('height', d => h - p - yScale(d[1]))
        .attr('class', 'bar')
        .attr('data-date', d => d[0])
        .attr('data-gdp', d => d[1])
        .on('mouseover', d => {
            svg.append('text')
                .text(d[0] + ' - ' + d[1])
                .attr('id', 'tooltip')
                .attr('x', xScale(convertToDate(d[0])) + 5)
                .attr('y', h - p - 25)
                .attr('data-date', d[0]);
        })
        .on('mouseout', () => {
            d3.selectAll('#tooltip').remove()
        });
};
