const WIDTH = 1200;
const HEIGHT = 800;
const N = 6;
const svg = d3
  .select("#graph")
  .append("svg")
  .attr("viewBox", `${-WIDTH / 2} ${-HEIGHT / 2} ${WIDTH} ${HEIGHT}`)
  .append("g");

const colour = d3.schemeCategory10;
console.log(colour);
const nodes = d3.range(N).map(function(i) {
  return {
    x: i * 40,
    y: 0,
    r: 10,
    colour: colour[i % 4]
  };
});

const drag = d3
  .drag()
  .on("drag", function(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  })
  .on("end", function(d) {
    d.fx = null;
    d.fy = null;
  });

const simulation = d3
  .forceSimulation(nodes)
  .force(
    "charge",
    d3
      .forceManyBody()
      .strength(8)
      .distanceMax(70)
  )
  .alphaDecay(0);

svg
  .selectAll("circle")
  .data(nodes)
  .enter()
  .append("circle")
  .attr("cx", d => d.x)
  .attr("cy", d => d.y)
  .attr("r", d => d.r)
  .attr("fill", d => d.colour)
  .call(drag);

simulation.on("tick", function() {
  collide();
  svg
    .selectAll("circle")
    .attr("cx", function(d) {
      return d.x;
    })
    .attr("cy", function(d) {
      return d.y;
    });
});

let m = 0;
function collide() {
  m++;
  // if (m < 6) {
  for (let i = 0; i < N; i++) {
    for (let j = 0; j < i; j++) {
      detectCollision(i, j);
    }
  }
  // }
}

function detectCollision(i, j) {
  const node_a = nodes[i];
  const node_b = nodes[j];

  const dx = node_a.x - node_b.x;
  const dy = node_a.y - node_b.y;
  const dr = Math.pow(dx * dx + dy * dy, 0.5);
  const overlap = node_a.r + node_b.r - dr;
  // console.log(dx, dy, dr, overlap);
  if (overlap > 0) {
    const shiftX = ((dx / dr) * overlap) / 2;
    const shiftY = ((dy / dr) * overlap) / 2;
    node_a.x += shiftX * Math.sign(dx);
    node_b.x -= shiftX * Math.sign(dx);
    node_a.y += shiftY * Math.sign(dy);
    node_b.y -= shiftY * Math.sign(dy);
  }
}
