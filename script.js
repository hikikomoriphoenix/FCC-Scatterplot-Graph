fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
  .then(response => response.json())
  .then(dataset => showGraph(dataset))

function showGraph(dataset) {
  const w = 800;
  const h = 400;
  const padding = 50;
  const parseYear = d3.timeParse("%Y");
  const parseTime = d3.timeParse("%M:%S");

  const xScale = d3.scaleTime()
    .domain([d3.min(dataset, d => parseYear(d.Year)),
      d3.max(dataset, d => parseYear(d.Year))
    ])
    .range([padding, w - padding]);

  const yScale = d3.scaleTime()
    .domain([d3.min(dataset, d => parseTime(d.Time)),
      d3.max(dataset, d => parseTime(d.Time))
    ])
    .range([padding, h - padding]);

  const svg = d3.select("#root")
    .append("svg")
    .attr("width", w)
    .attr("height", h);

  svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(parseYear(d.Year)))
    .attr("cy", d => yScale(parseTime(d.Time)))
    .attr("r", 5)
    .attr("data-xvalue", d => parseYear(d.Year))
    .attr("data-yvalue", d => parseTime(d.Time))

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%Y"));
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.timeFormat("%M:%S"));

  svg.append("g")
    .attr("id", "x-axis")
    .attr("transform", `translate(${0}, ${h - padding})`)
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("transform", `translate(${padding}, ${0})`)
    .call(yAxis);

  const legends = [
    ["green", "No doping allegations"],
    ["purple", "Have doping allegations"]
  ];

  const legendGroup = svg.append("g")
    .attr("id", "legend");

  legendGroup.append("rect")
    .attr("width", 210)
    .attr("height", 85)
    .attr("x", w - padding - 210)
    .attr("y", padding)
    .attr("fill", "transparent")
    .attr("stroke", "#000")
    .attr("stroke-width", 2)

  legendGroup.selectAll(".legend-color")
    .data(legends)
    .enter()
    .append("rect")
    .attr("class", "legend-color")
    .attr("width", 20)
    .attr("height", 20)
    .attr("x", w - padding - 200)
    .attr("y", (d,i) => padding + 20 + 25*i)
    .attr("fill", d => d[0]);

  legendGroup.selectAll("text")
    .data(legends)
    .enter()
    .append("text")
    .attr("x", w - padding - 170)
    .attr("y", (d, i) => padding + 35 + 25*i)
    .text(d => d[1]);
}
