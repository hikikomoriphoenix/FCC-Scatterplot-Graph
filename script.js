fetch("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json")
  .then(response => response.json())
  .then(dataset => showGraph(dataset))

function showGraph(dataset) {
  const w = 800;
  const h = 600;
  const padding = 50;
  const parseYear = d3.timeParse("%Y");
  const parseTime = d3.timeParse("%M:%S");

  const legends = [
    ["green", "No doping allegations"],
    ["MediumPurple", "Have doping allegations"]
  ];

  const lessOneYear = yearDate => {
    return yearDate.setYear(yearDate.getYear() - 1);
  }

  const moreSeconds = time => {
    return time.setSeconds(time.getSeconds() + 10);
  }

  const xScale = d3.scaleTime()
    .domain([lessOneYear(d3.min(dataset, d => parseYear(d.Year))),
      d3.max(dataset, d => parseYear(d.Year))
    ])
    .range([padding, w - padding]);

  const yScale = d3.scaleTime()
    .domain([d3.min(dataset, d => parseTime(d.Time)),
      moreSeconds(d3.max(dataset, d => parseTime(d.Time)))
    ])
    .range([padding, h - padding]);

  const svg = d3.select("#root")
    .append("svg")
    .attr("id", "scatterplot")
    .attr("width", w)
    .attr("height", h);

  const tooltip = d3.select("#root")
    .append("div")
    .attr("id", "tooltip");

  svg.selectAll("circle")
    .data(dataset)
    .enter()
    .append("circle")
    .attr("class", "dot")
    .attr("cx", d => xScale(parseYear(d.Year)))
    .attr("cy", d => yScale(parseTime(d.Time)))
    .attr("r", 8)
    .attr("data-xvalue", d => parseYear(d.Year))
    .attr("data-yvalue", d => parseTime(d.Time))
    .attr("fill", d => {
      if (d.Doping != "" && d.Doping != null) {
        return legends[1][0];
      } else {
        return legends[0][0];
      }
    })
    .on("mouseover", d => {
      let desc = "";
      for (let property in d) {
        if (property == "Doping" && (d[property] == "" || d[property] == null)) {
          desc += "Doping: None<br>"
        } else if (property != "URL") {
          desc += `${property}: ${d[property]}<br>`;
        }
      }
      desc = desc.slice(0, -4);

      const svgRect = document.getElementById("scatterplot").getBoundingClientRect();
      const x = svgRect.x + xScale(parseYear(d.Year)) + 10;
      const y = svgRect.y + yScale(parseTime(d.Time));

      tooltip.style("opacity", 1)
        .attr("data-year", parseYear(d.Year))
        .style("left", x + "px")
        .style("top", y + "px")
        .html(desc);

      if (d.Doping != "" && d.Doping != null) {
        tooltip.style("background", legends[1][0]);
      } else {
        tooltip.style("background", legends[0][0]);
      }
    })
    .on("mouseout", d => {
      tooltip.style("opacity", 0);
    })

  const xAxis = d3.axisBottom(xScale)
    .tickFormat(d3.timeFormat("%Y"));
  const yAxis = d3.axisLeft(yScale)
    .tickFormat(d3.timeFormat("%M:%S"));

  svg.append("g")
    .attr("id", "x-axis")
    .attr("class", "axis")
    .attr("transform", `translate(${0}, ${h - padding})`)
    .call(xAxis);

  svg.append("g")
    .attr("id", "y-axis")
    .attr("class", "axis")
    .attr("transform", `translate(${padding}, ${0})`)
    .call(yAxis);

  const legendGroup = svg.append("g")
    .attr("id", "legend");

  legendGroup.append("rect")
    .attr("width", 210)
    .attr("height", 85)
    .attr("x", w - padding - 210)
    .attr("y", padding)
    .attr("fill", "transparent")
    .attr("stroke", "white")
    .attr("stroke-width", 1)

  legendGroup.selectAll(".legend-color")
    .data(legends)
    .enter()
    .append("rect")
    .attr("class", "legend-color")
    .attr("width", 20)
    .attr("height", 20)
    .attr("x", w - padding - 200)
    .attr("y", (d, i) => padding + 20 + 25 * i)
    .attr("fill", d => d[0]);

  legendGroup.selectAll("text")
    .data(legends)
    .enter()
    .append("text")
    .attr("fill", "white")
    .attr("x", w - padding - 170)
    .attr("y", (d, i) => padding + 35 + 25 * i)
    .text(d => d[1]);
}
