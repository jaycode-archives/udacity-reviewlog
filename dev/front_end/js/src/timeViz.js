var app = app || {};

(function() {
  "use strict";
  /**
   * Visualize value vs time related information
   * @namespace app.timeViz
   */
  app.timeViz = {};

  /**
   * Draw the visualization given data and css selector.
   * @param {Array} data Data from server that include all candidates and all lifetimes.
   * @param {string} chartSelector CSS selector where plot is drawn at.
   * @param {object} params Setting parameters used when drawing histogram content.
   * @param {function} params.timeFunc
   * @param {function} params.valFunc
   * @param {function} params.valGroupFunc
   * @param {number} params.width Width of chart.
   * @param {number} params.height Height of chart.
   * @param {number} params.paddingTop Padding top of chart.
   * @param {number} params.paddingBottom Padding bottom of chart.
   * @param {number} params.paddingLeft Padding left of chart.
   */
  app.timeViz.draw = function(rawdata, chartSelector, params) {
    if (!params.paddingBottom) {
      params.paddingBottom = 70;
    }
    if (!params.paddingTop) {
      params.paddingTop = 20;
    }
    if (!params.paddingLeft) {
      params.paddingLeft = 40;
    }
    if (!params.valFunc) {
      params.valFunc = function (d) {return d.values;};
    }
    // Prepare svg
    var svg = d3.select(chartSelector)
      .append('svg')
        .attr('width', params.width)
        .attr('height', params.height)
      .append('g')
        // .attr('transform', "translate("+params.widthOffset+",0)")
        .attr('class','chart');

    var data = d3.nest()
      .key(params.timeFunc)
      .rollup(params.valGroupFunc)
      .entries(rawdata);
    
    var times = [];
    data.forEach(function(d) {
      times.push(d.key);
    });

    // Find range of y-axis (x-axis does not need it).
    var valExtent = d3.extent(data, params.valFunc);
    valExtent[0] = 0;

    // Create x-axis scale.
    var timeScale = d3.scale.ordinal()
      .rangeRoundBands([params.paddingLeft, params.width - params.paddingLeft])
      .domain(times)

    // Create y-axis scale.
    var valScale = d3.scale.linear()
      .range([params.height-params.paddingBottom, params.paddingTop])
      .domain(valExtent);

    // Create the actual x-axis.
    var timeAxis = d3.svg.axis()
      .scale(timeScale)
      .orient("bottom");

    svg
      .append('g')
        .attr('class', 'x axis')
        .attr('transform', "translate(0," + (params.height-params.paddingBottom) + ")")
      .call(timeAxis)
      .selectAll('text')
        .attr("y", 0)
        .attr("x", -9)
        .attr("dy", ".35em")
        .style('text-anchor', 'end')
        .attr('transform', 'rotate(270)');

    // Create the actual y-axis.
    var valAxis = d3.svg.axis()
      .scale(valScale)
      .orient('left');

    svg
      .append('g')
        .attr('class', 'y axis')
        .attr('transform', "translate(" + params.paddingLeft + ", 0)")
      .call(valAxis);

    // Add plot title
    svg
      .append('text')
        .attr('class', 'plot_title')
        .attr('text-anchor', 'middle')
        .attr('transform', 'translate('+(params.width/2)+','+ 20 +')')
        .text(params.title);

    var line = d3.svg.line()
      // .x(function(d) {return timeScale(d.key) + 18;})
      .x(function(d) {return timeScale(d.key);})
      .y(function(d) {return valScale(d.values);})
      .interpolate('linear');

    var drawnLine = svg.selectAll(chartSelector + ' .drawnLine')
      .data(data)
      .enter().append('g')
      .attr('class', 'drawnLine');

    drawnLine.append('path')
      .attr('class', 'line')
      .attr('d', line(data))
      .style('stroke', function (d) {
        return 'blue';
      })
      .style('fill', 'none');


    // Hack: Make ordinal scale axis starts at 0px.
    // -----------------------------

    // Calculate distance between two ticks.
    var t1text = $($(chartSelector + ' .x .tick')[0]).attr('transform');
    var t1x = parseFloat(t1text.match(/translate\((.*),0\)/)[1]);
    var t2text = $($(chartSelector + ' .x .tick')[1]).attr('transform');
    var t2x = parseFloat(t2text.match(/translate\((.*),0\)/)[1]);
    var dist = t2x - t1x;

    // Use the distance to reduce tick left positions.
    $.each($(chartSelector + ' .x .tick'), function(idx, el) {
      var text = $(el).attr('transform');
      var x = parseFloat(text.match(/translate\((.*),0\)/)[1]);
      x -= dist / 2 + 1;
      $(el).attr('transform', 'translate('+ x +',0)');
    });
    // -----------------------------
  }
})();