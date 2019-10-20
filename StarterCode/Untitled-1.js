// Code 
var svgWidth = 960;
var svgHeight = 600;

var margin = {
    top: 20,
    right: 40,
    bottom: 150,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins. 
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width",svgWidth)
    .attr("height",svgHeight);