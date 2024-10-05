document.addEventListener('DOMContentLoaded', function() {
  const script = document.createElement('script');
  script.src = 'https://d3js.org/d3.v7.min.js';
  script.onload = createSkillsWheel;
  document.head.appendChild(script);

  const link = document.createElement('link');
  link.href = 'https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&family=Roboto+Mono&display=swap';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
});

function createSkillsWheel() {
  const width = 600;
  const height = 600;
  const radius = Math.min(width, height) / 2 - 15;

  const svg = d3.select("#skills-wheel")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", `translate(${width / 2},${height / 2})`);

  // Enhanced glow effect
  const defs = svg.append("defs");
  const filter = defs.append("filter")
    .attr("id", "glow");
  filter.append("feGaussianBlur")
    .attr("stdDeviation", "2.5")
    .attr("result", "coloredBlur");
  const feMerge = filter.append("feMerge");
  feMerge.append("feMergeNode")
    .attr("in", "coloredBlur");
  feMerge.append("feMergeNode")
    .attr("in", "SourceGraphic");

  // Data structure remains the same
  const data = {
    name: "Skills",
    children: [
      {
        name: "Frontend Development",
        children: [
          {name: "HTML"},
          {name: "CSS"},
          {name: "JavaScript"},
        ]
      },
      {
        name: "Programming Languages",
        children: [
          {name: "Python"},
          {name: "R"},
          {name: "Java"},
          {name: "C++"},
          {name: "MATLAB"},
          {name: "SQL"}
        ]
      },
      {name: "Writing",
        children: [{name: "Content Writing"}]
      },
      {name: "Data Science",
        children: [{name: "Data Visualization"},
                    {name: "Data Analytics"}]
      },
      {
        name: "Artificial Intelligence",
        children: [
          {name: "Machine Learning"},
          {name: "Natural Language Processing"},
          {name: "Computer Vision"},
          {name: "Image Processing"},
          {name: "Signal Processing"},
          {name: "Generative AI Models"},
          {name: "Satellite Image Processing"}
        ]
      },
      {
        name: "Non-Technical Skills",
        children: [
          {name: "Communication"},
          {name: "Research"},
          {name: "Time Management"},
          {name: "Attention To Detail"},
          {name: "Presentations"},
        ]
      },
    ]
  };

  // Updated color scheme for enhanced visual appeal
  const colorScheme = [
    "#00FFFF", "#FF1493", "#FFD700",
    "#32CD32", "#FF4500", "#9370DB",
    "#20B2AA", "#FF69B4", "#00FA9A"
  ];
  const color = d3.scaleOrdinal(colorScheme);

  const partition = d3.partition()
    .size([2 * Math.PI, radius]);

  const root = d3.hierarchy(data)
    .sum(d => d.children ? 0 : 1);

  partition(root);

  const arc = d3.arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .innerRadius(d => d.y0)
    .outerRadius(d => d.y1)
    .padAngle(0.003)
    .padRadius(radius / 2);

  const paths = svg.selectAll('path')
    .data(root.descendants())
    .enter().append('path')
    .attr("display", d => d.depth ? null : "none")
    .attr("d", arc)
    .style('stroke', '#000')
    .style("fill", d => color((d.children ? d : d.parent).data.name))
    .style("opacity", 0.85)
    .on("mouseover", handleMouseOver)
    .on("mouseout", handleMouseOut);

  const texts = svg.selectAll('text')
    .data(root.descendants().filter(d => d.depth && (d.y0 + d.y1) / 2 * (d.x1 - d.x0) > 10))
    .enter().append('text')
    .attr("transform", function(d) {
      const x = (d.x0 + d.x1) / 2 * 180 / Math.PI;
      const y = (d.y0 + d.y1) / 2;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    })
    .attr("dy", ".35em")
    .attr("text-anchor", "middle")
    .attr("fill", "#000")
    .style("font-family", "'Roboto Mono', monospace")
    .style("font-size", "10px")
    .style("pointer-events", "none")
    .style("text-shadow", "0px 0px 3px rgba(255,255,255,0.8)")
    .text(d => d.data.name);

  function handleMouseOver(event, d) {
    const selectedPath = d3.select(this);
    
    paths.transition()
      .duration(200)
      .style("opacity", 0.3);
    
    selectedPath.transition()
      .duration(200)
      .style("opacity", 1)
      .style("filter", "url(#glow)")
      .attr("transform", calculatePopOutTransform(d));
    
    showArtifact(d);
  }

  function handleMouseOut() {
    paths.transition()
      .duration(200)
      .style("opacity", 0.85)
      .style("filter", "none")
      .attr("transform", "");
    
    hideArtifact();
  }

  function calculatePopOutTransform(d) {
    const angle = (d.x0 + d.x1) / 2;
    const popDistance = 10;
    return `translate(${Math.sin(angle) * popDistance}, ${-Math.cos(angle) * popDistance})`;
  }

  function showArtifact(d) {
    const artifactGroup = svg.append("g")
      .attr("class", "artifact")
      .attr("transform", `translate(0, ${-radius - 40})`);

    artifactGroup.append("rect")
      .attr("x", -100)
      .attr("y", -30)
      .attr("width", 200)
      .attr("height", 60)
      .attr("rx", 10)
      .attr("ry", 10)
      .attr("fill", color((d.children ? d : d.parent).data.name))
      .attr("filter", "url(#glow)")
      .style("opacity", 0.9);

    artifactGroup.append("text")
      .attr("y", -5)
      .text(d.data.name)
      .attr("text-anchor", "middle")
      .attr("font-size", "16px")
      .attr("fill", "#000")
      .style("font-family", "'Poppins', sans-serif")
      .style("font-weight", "bold")
      .style("text-shadow", "0px 0px 3px rgba(255,255,255,0.8)");

    if (!d.children) {
      artifactGroup.append("text")
        .attr("y", 20)
        .text(`Category: ${d.parent.data.name}`)
        .attr("text-anchor", "middle")
        .attr("font-size", "14px")
        .attr("fill", "#000")
        .style("font-family", "'Poppins', sans-serif")
        .style("text-shadow", "0px 0px 3px rgba(255,255,255,0.8)");
    }
  }

  function hideArtifact() {
    svg.select(".artifact").remove();
  }
}