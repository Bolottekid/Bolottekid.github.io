function draw_court(court_g,width,height,margin){
    var Basket = court_g.append('circle');
    var Backboard = court_g.append('rect');
    var Outterbox = court_g.append('rect');
    var Innerbox = court_g.append('rect');
    var CornerThreeLeft = court_g.append('rect');
    var CornerThreeRight = court_g.append('rect');
    var OuterLine = court_g.append('rect');
    var RestrictedArea = court_g.append('path')
    var TopFreeThrow = court_g.append('path')
    var BottomFreeThrow = court_g.append('path')
    var ThreeLine = court_g.append('path')
    var CenterOuter = court_g.append('path')
    var CenterInner = court_g.append('path')

    const court_xScale = d3.scaleLinear().domain([0,15]).range([margin.Left, width - margin.Right]);
    const court_yScale = d3.scaleLinear().domain([0,14]).range([height - margin.Bottom, margin.Top]);
    court_g.attr("width", width)
           .attr("height", height)

    Basket.attr('cx', court_xScale(7.5))
           .attr('cy', court_yScale(1.575))
           .attr('r', court_xScale(0.225)-court_xScale(0))
           .style('fill', 'None')
           .style('stroke', 'black');

    Backboard.attr('x', court_xScale(7.5-0.9))
           .attr('y', court_yScale(1.2))
           .attr('width', court_xScale(1.8)-court_xScale(0))
           .attr('height', 1)
           .style('fill', 'none')
           .style('stroke', 'black');

    Outterbox
           .attr('x', court_xScale(7.5-2.45))
           .attr('y', court_yScale(5.8))
           .attr('width', court_xScale(4.9)-court_xScale(0))
           .attr('height', court_yScale(0)-court_yScale(5.8))
           .style('fill', 'none')
           .style('stroke', 'black');


    Innerbox
           .attr('x', court_xScale(7.5-1.8))
           .attr('y', court_yScale(5.8))
           .attr('width', court_xScale(3.6)-court_xScale(0))
           .attr('height', court_yScale(0)-court_yScale(5.8))
           .style('fill', 'none')
           .style('stroke', 'black');

    var T3L = Math.acos((7.5-0.9)/6.75);
    const Y3 = (6.75*Math.sin(T3L))+1.575;
    T3R = Math.PI/2 - T3L;
    T3L = T3L - Math.PI/2;

    CornerThreeLeft
           .attr('x', court_xScale(0.9))
           .attr('y', court_yScale(Y3)+4)
           .attr('width', 0.4)
           .attr('height', court_yScale(0)-court_yScale(Y3)-4)
           .style('fill', 'none')
           .style('stroke', 'black');

    CornerThreeRight
           .attr('x', court_xScale(14.1))
           .attr('y', court_yScale(Y3)+4)
           .attr('width', 0.4)
           .attr('height', court_yScale(0)-court_yScale(Y3)-4)
           .style('fill', 'none')
           .style('stroke', 'black');

    OuterLine
           .attr('x', court_xScale(0))
           .attr('y', court_yScale(14))
           .attr('width', court_xScale(15)-court_xScale(0))
           .attr('height', court_yScale(0)-court_yScale(14))
           .style('fill', 'none')
           .style('stroke', 'black');

    appendArcPath(RestrictedArea, court_xScale(1.25)-court_xScale(0), (-90)*(Math.PI/180), (90)*(Math.PI/180))
        .attr('fill', 'none')
        .attr("stroke", "black")
        .attr("transform", "translate(" + court_xScale(7.5) + ", " +court_yScale(1.575) +")");


    appendArcPath(TopFreeThrow, court_xScale(1.8)-court_xScale(0), (-90)*(Math.PI/180), (90)*(Math.PI/180))
        .attr('fill', 'none')
        .attr("stroke", "black")
        .attr("transform", "translate(" + court_xScale(7.5) + ", " +court_yScale(5.8) +")");


    appendArcPath(BottomFreeThrow, court_xScale(1.8)-court_xScale(0), (90)*(Math.PI/180), (270)*(Math.PI/180))
        .attr('fill', 'none')
        .attr("stroke", "black")
        .style("stroke-dasharray", ("3, 3"))
        .attr("transform", "translate(" + court_xScale(7.5) + ", " +court_yScale(5.8) +")");


    appendArcPath(ThreeLine, court_xScale(6.75)-court_xScale(0), T3R, T3L)
        .attr('fill', 'none')
        .attr("stroke", "black")
        .attr('class', 'shot-chart-court-3pt-line')
        .attr("transform", "translate(" + court_xScale(7.5) + ", " +court_yScale(1.575) +")");


    appendArcPath(CenterOuter, court_xScale(1.3)-court_xScale(0), (90)*(Math.PI/180), (270)*(Math.PI/180))
        .attr('fill', 'none')
        .attr("stroke", "black")
        .attr("transform", "translate(" + court_xScale(7.5) + ", " +court_yScale(14) +")");

    appendArcPath(CenterInner, court_xScale(0.325)-court_xScale(0), (90)*(Math.PI/180), (270)*(Math.PI/180))
        .attr('fill', 'none')
        .attr("stroke", "black")
        .attr("transform", "translate(" + court_xScale(7.5) + ", " +court_yScale(14) +")");
}


function appendArcPath(base, radius, startAngle, endAngle) {
      var points = 30;

      var angle = d3.scaleLinear()
          .domain([0, points - 1])
          .range([startAngle, endAngle]);

      var line = d3.lineRadial()
          .radius(radius)
          .angle(function(d, i) { return angle(i); });

      return base.datum(d3.range(points))
          .attr("d", line);
}
