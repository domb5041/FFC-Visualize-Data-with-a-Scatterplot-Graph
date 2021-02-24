const getDataset = () => {
    fetch(
        'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
    )
        .then(response => response.json())
        .then(data => drawGraph(data));
};

getDataset();

const drawGraph = dataset => {
    console.log(dataset);
    const w = 700;
    const h = 500;
    const p = 50;

    const yearObject = d => new Date(d.Year, 0, 1);
    const timeObject = d => new Date(1970, 0, 1, 0, 0, d.Seconds);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3
        .select('#chart')
        .append('svg')
        .attr('id', 'svg-area')
        .attr('width', w)
        .attr('height', h);

    const xScale = d3
        .scaleTime()
        .domain(d3.extent(dataset, d => yearObject(d)))
        .range([p, w - p]);

    const yScale = d3
        .scaleTime()
        .domain(d3.extent(dataset, d => timeObject(d)))
        .range([p, h - p]);

    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
    const xAxis = d3.axisBottom(xScale);

    svg.append('g')
        .attr('transform', `translate(${p}, 0)`)
        .attr('id', 'y-axis')
        .call(yAxis);

    svg.append('g')
        .attr('transform', `translate(0, ${h - p})`)
        .attr('id', 'x-axis')
        .call(xAxis);

    svg.selectAll('circle')
        .data(dataset)
        .enter()
        .append('circle')
        .attr('cx', d => xScale(yearObject(d)))
        .attr('cy', d => yScale(timeObject(d)))
        .attr('r', 5)
        .attr('class', 'dot')
        .attr('data-xvalue', d => yearObject(d))
        .attr('data-yvalue', d => timeObject(d))
        .style('fill', d => color(d.Doping.length > 0))
        .on('mouseover', d => {
            svg.append('text')
                .text(d.Name)
                .attr('id', 'tooltip')
                .attr('x', xScale(yearObject(d)) + 10)
                .attr('y', yScale(timeObject(d)) + 5)
                .attr('data-year', yearObject(d));
        })
        .on('mouseout', () => {
            d3.selectAll('#tooltip').remove();
        });

    svg.append('g')
        .attr('id', 'legend')
        .selectAll('#legend')
        .data(color.domain())
        .enter()
        .append('text')
        .attr('x', w - 20)
        .attr('y', (d, i) => i * 25 + 25)
        .style('text-anchor', 'end')
        .style('fill', color)
        .text(d =>
            d ? 'Riders with doping allegations' : 'No doping allegations'
        );
};
