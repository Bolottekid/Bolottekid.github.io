function nestrollup(shot) {
  const zone3 = ['4.1','4.2','4.3','4.4','4.5']
  //https://www.jowanza.com/blog/nba-shot-charts-with-nodejs-and-d3js
  var coll = d3.rollup(shot,
    v => ({
      make: d3.sum(v, function(d){
        if (zone3.includes(d.ZONE)) {
          return 3*d.MAKE
        };
        return 2*d.MAKE
      }),
      attempts: v.length
    }),
    d => ({
      X: d.X,
      Y: d.Y
    })
  )
  //console.log(coll);

  var finalData = [];

  coll.forEach((a,i) => {
    finalData.push({"X": +i.X, "Y": +i.Y, "MAKE": a.make, "ATTEMPT": a.attempts})
  });
  //console.log(finalData);
  return finalData;
};

function DrawHexbin(finalData,hexbin,svg,finalDataALL,stat,stat1,totnum) {
  const bins = hexbin(finalData);
  const binsALL = hexbin(finalDataALL);
  // average of Z per bin
  bins.forEach((item, i) => {
    item.Zavg = d3.sum(item, d=>d.MAKE)/d3.sum(item, d=>d.ATTEMPT)
    item.Size = d3.sum(item, d=>d.ATTEMPT)
  });
  //console.log(bins);
  // average of Z per bin
  binsALL.forEach((item, i) => {
    item.Zavg = d3.sum(item, d=>d.MAKE)/d3.sum(item, d=>d.ATTEMPT)
    item.Size = d3.sum(item, d=>d.ATTEMPT)
  });

  // Create the color scale.
  var COLORLIST = []
  if (stat == "TeamVS") {
    COLORLIST = ["#163832","#235347","white","#C90101","#B70100"]
  } else {
    COLORLIST = ["#B70100","#C90101","white","#235347","#163832"]
  };
  const color = d3.scaleLinear(COLORLIST)
    .domain([0,0.5,d3.mean(binsALL, d => d.Zavg),1.5,3]);
  //const color = d3.scaleDiverging([0,0.5,d3.mean(binsALL, d => d.Zavg),1.5,3], d3.interpolateRdBu)

  // Create the radius scale.
  var a;
  if (stat == "Player") {
    a = 7.5;
  } else {
    a = 1.1;
  };
  if (stat1 == "All") {
    a = 1
  };

  const minHexsize = 1;
  var maxHexsize = d3.max(binsALL, d => d.Size/totnum)*a;
  var maxHexsize1 = d3.max(bins, d => d.Size);
  var r = d3.scaleLinear()
      .domain([minHexsize, maxHexsize, maxHexsize1])
      .range([hexbin.radius()/2.5, hexbin.radius(), hexbin.radius()*1.1]);
  if (maxHexsize > maxHexsize1) {
    r = d3.scaleLinear()
        .domain([minHexsize, maxHexsize])
        .range([hexbin.radius()/2.5, hexbin.radius()]);
  };

  // Append the scaled hexagons.
  svg.append("g")
      .attr("fill", "#ddd")
      .attr("stroke", "none")
    .selectAll("path")
    .data(bins)
    .enter().append("path")
      .attr("transform", d => `translate(${d.x},${d.y})`)
      .attr("d", d => hexbin.hexagon(r(d.Size)))
      //.attr("d", hexbin.hexagon())
      .attr("fill", bin => color(bin.Zavg));

  // Legend
  // Legend box right for color scale
  const Xcolor = 565;
  const Wcolor = 180;
  svg.append("rect")
      .attr("x",Xcolor-Wcolor/2)
      .attr("y",55)
      .style("fill","white")
      .style("opacity","0.3")
      .attr('width', Wcolor)
      .attr('height', 70)
      .style("stroke","black");
  // Hexbin for color scale
  svg.append("g")
      .attr("fill", "#ddd")
      .attr("stroke", "none")
    .selectAll("path")
    .data(color.range())
    .enter().append("path")
      .attr("transform", (d,i) => "translate("+((Xcolor-5*hexbin.radius()/2)+(1 + i*2) *hexbin.radius()/2)+",110)")
      .attr("d", hexbin.hexagon(hexbin.radius()/2))
      //.attr("d", hexbin.hexagon())
      .attr("fill", (d,i) => d);
  // Label for color scale
  svg.append("text")
    .attr("x", Xcolor) // Set the x position
    .attr("y", 70) // Set the y position (y coordinate typically defines the bottom-left corner)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", "black")
    .style("font-weight", "bold")
    .text("Point per shot efficiency");
  svg.append("text")
    .attr("x", Xcolor) // Set the x position
    .attr("y", 90) // Set the y position (y coordinate typically defines the bottom-left corner)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", color(d3.mean(binsALL, d => d.Zavg)))
    .style("font-weight", "bold")
    .text("League average: "+d3.mean(binsALL, d => d.Zavg).toFixed(1));
  svg.append("text")
    .attr("x", (Xcolor-5*hexbin.radius()/2)-15) // Set the x position
    .attr("y", 115) // Set the y position (y coordinate typically defines the bottom-left corner)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", color(0))
    .style("font-weight", "bold")
    .text("0.0");
  svg.append("text")
    .attr("x", (Xcolor+5*hexbin.radius()/2)+15) // Set the x position
    .attr("y", 115) // Set the y position (y coordinate typically defines the bottom-left corner)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", color(3))
    .style("font-weight", "bold")
    .text("3.0");

  // Legend box left for size scale
  const Xsize = 150;
  const Wsize = 230;
  svg.append("rect")
      .attr("x",Xsize-Wsize/2)
      .attr("y",55)
      .style("fill","white")
      .style("opacity","0.3")
      .attr('width', Wsize)
      .attr('height', 90)
      .style("stroke","black");
  // Hexbin for size scale
  var radius = 0;
  svg.append("g")
      .attr("fill", "#ddd")
      .attr("stroke", "none")
    .selectAll("path")
    .data(color.range())
    .enter().append("path")
      .attr("transform", function (d,i) {
        radius += 2*r((i+1)/5*(maxHexsize-minHexsize)+minHexsize);
        return "translate("+((Xsize-7.5*hexbin.radius()/2)+radius-r((i+1)/5*(maxHexsize-minHexsize)+minHexsize))+",120)";
      })
      .attr("d", (d,i) => hexbin.hexagon(r((i+1)/5*(maxHexsize-minHexsize)+minHexsize)))
      //.attr("d", hexbin.hexagon())
      .attr("fill", "grey");
  // Label for size scale
  svg.append("text")
    .attr("x", Xsize) // Set the x position
    .attr("y", 70) // Set the y position (y coordinate typically defines the bottom-left corner)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", "black")
    .style("font-weight", "bold")
    .text("Shot per area");
  svg.append("text")
    .attr("x", Xsize) // Set the x position
    .attr("y", 90) // Set the y position (y coordinate typically defines the bottom-left corner)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", "black")
    .style("font-weight", "bold")
    .text("middle size: "+(0.5*(maxHexsize-minHexsize)+minHexsize).toFixed(0));
  svg.append("text")
    .attr("x", (Xsize-7.5*hexbin.radius()/2)-15) // Set the x position
    .attr("y", 125) // Set the y position (y coordinate typically defines the bottom-left corner)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", "black")
    .style("font-weight", "bold")
    .text(minHexsize.toFixed(0));
  svg.append("text")
    .attr("x", (Xsize+7.5*hexbin.radius()/2)+15) // Set the x position
    .attr("y", 125) // Set the y position (y coordinate typically defines the bottom-left corner)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("fill", "black")
    .style("font-weight", "bold")
    .text(maxHexsize.toFixed(0));

};
