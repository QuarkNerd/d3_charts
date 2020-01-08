const WIDTH = 1200;
const HEIGHT = 800;
const N = 30;
const links = [];
const svg = d3
  .select("#graph")
  .append("svg")
  .attr("viewBox", `${-WIDTH / 2} ${-HEIGHT / 2} ${WIDTH} ${HEIGHT}`)
  .append("g");

const nodes = d3.range(N).map(function(i) {
  return {
    index: i,
    x: (i % N) * 30,
    y: Math.floor(i / N) * 30
  };
});

for (let y = 0; y < N; ++y) {
  for (let x = 0; x < N; ++x) {
    if (d3.randomUniform(0, 1)() < 0.05) {
      links.push({
        source: x,
        target: y,
        value: d3.randomUniform(1, 12)() * 2 + 15
      });
    }
  }
}

let fix = false;
document.body.onkeypress = function(e) {
  console.log(e.keyCode);
  if (e.keyCode === 32) {
    fix = !fix;
    console.log(fix);
  }
};
const drag = d3
  .drag()
  .on("drag", function(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  })
  .on("end", function(d) {
    if (!fix) {
      d.fx = null;
      d.fy = null;
    }
  });

const simulation = d3
  .forceSimulation(nodes)
  .force(
    "links",
    d3
      .forceLink(links)
      // .iterations(10)
      .distance(function(link) {
        return link.value;
      })
    // .strength(function strength(link) {
    //   // console.log(count);
    //   return 1 / Math.min(count(link.source), count(link.target));
    // })
  ) //.distance(50))
  .force(
    "charge",
    d3
      .forceManyBody()
      .strength(-60)
      .distanceMax(50)
  )
  .force("center", d3.forceCenter(0, 0))
  .alphaDecay(0);

svg
  .selectAll("line")
  .data(links)
  .enter()
  .append("line")
  .attr("x1", d => d.source.x)
  .attr("y1", d => d.source.y)
  .attr("x2", d => d.target.x)
  .attr("y2", d => d.target.y)
  .attr("class", "connect");

svg
  .selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("r", 7)
  .call(drag);

simulation.on("tick", function() {
  svg
    .selectAll("line")
    .attr("x1", d => d.source.x)
    .attr("y1", d => d.source.y)
    .attr("x2", d => d.target.x)
    .attr("y2", d => d.target.y);
  svg
    .selectAll("circle")
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });
  console.log(1);
});

console.log(nodes);
