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

var chartGroup = svg.append("g")
    .attr("transform",`translate(${margin.left},${margin.right})`);

// Start with initial parameters
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// function used for updating x-scale var upon click on axis label 
function xScale(data, chosenXAxis) {
    // create scales
    var xLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenXAxis]) * 0.8,
            d3.max(data,d => d[chosenXAxis]) * 1.2
        ])
        .range([0,width]);
    return xLinearScale;
};

// function used for updating x-scale var upon click on axis label
function yScale(data,chosenYAxis) {
    // create schales 
    var yLinearScale = d3.scaleLinear()
        .domain([d3.min(data, d => d[chosenYAxis]) * 0.8,
            d3.max(data, d => d[chosenYAxis]) * 1.1
        ])
        .range([height,0]);
    return yLinearScale;
};

// function used for updating xAxis var upon click on axis label
function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);

    xAxis.transition()
        .duration(1000)
        .call(bottomAxis);

    return xAxis;
};


// function used for updating yAxis var upon click on axis label
function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);

    yAxis.transition()
        .duration(1000)
        .call(leftAxis);
    
    return yAxis
};

//function used for updating circles group with a transition to new circles
function renderCircles(circlesGroup,newXScale,newYScale,chosenXAxis,chosenYAxis) {

    circlesGroup.transition()
        .duration(1000)
        .attr("cx",d => newXScale(d[chosenXAxis]))
        .attr("cy",d => newYScale(d[chosenYAxis]));

    return circlesGroup;
};

function updateToolTip(chosenXAxis,chosenYAxis,circlesGroup) {
    if (chosenXAxis === "poverty") {
        var label = "Poverty";
    }
    else if (chosenXAxis === "age") {
        var label = "Age:";
    }
    else if (chosenYAxis === "household") {
        var label = "Household Income:";
    }

    if (chosenYAxis === "healthcare") {
        var labely = "Healthcare";
    }
    else if (chosenYAxis === "smokes") {
        var labely = "Smokes";
    }
    else if (chosenYAxis === "obesity") {
        var labely = "Obesity";
    }

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80,-60])
        .html(function (d) {
            return (`State: ${d.state}<br>${label}: ${d[chosenXAxis]}<br>${labely}: ${d[chosenYAxis]}`);
        })
    
    circlesGroup.call(toolTip);

    circlesGroup.on("mouseover", function(data) {
        toolTip.show(data);
    })
        .on("mouseout", function(data, index) {
            toolTip.hide(data);
        });

    return circlesGroup;
}


// Import Data
d3.csv("data.csv")
    .then(function(data) {
        //Step 1: Parse Data
        data.forEach(function (data) {
            data.poverty = +data.poverty;
            data.age = +data.age;
            data.income = +data.income;
            data.healthcare = +data.healthcare;
            data.smokes = +data.smokes;
            data.obesity = +data.obesity;
        });

        //Step 2: Create scale function
        /*var xLinearScale = d3.scaleLinear()
           // .domain(d3.extent(data, d=> d.poverty))
            .domain([d3.min(data, d => d.poverty),d3.max(data,d => d.poverty)])
            .range([0,width]);*/

        var xLinearScale = xScale(data, chosenXAxis);
        var yLinearScale = yScale(data, chosenYAxis);
        console.log(yLinearScale)

        /*
        var yLinearScale = d3.scaleLinear()
            .domain([0,d3.max(data, d => d.healthcare)+3])
            .range([height,0]);*/


        //Step 3: Create axis functions 
        var bottomAxis = d3.axisBottom(xLinearScale);
        var leftAxis = d3.axisLeft(yLinearScale);

        //Step 4: Append Axes to the chart
        var yAxis = chartGroup.append("g")
            .call(leftAxis);

        var xAxis = chartGroup.append("g")
            .attr("transform",`translate(0,${height})`)
            .call(bottomAxis);
        


        //chartGroup.append("g")
        //    .call(leftAxis);

        //Step 5: Create Circles
        var circlesGroup = chartGroup.selectAll("circle")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xLinearScale(d.poverty))
            .attr("cy", d => yLinearScale(d.healthcare))
            .attr("r","10")
            .attr("fill","LightBlue")
            .attr("opacity",".9")

        // Create group for 3 x-axis labels
        var xlabelsGroup = chartGroup.append("g")
            .attr("transform",`translate(${width / 2}, ${height + 20})`);

        var povertyLabel = xlabelsGroup.append("text")
            .attr("x",0- (height/2) + 225)
            .attr("y",0 - margin.left + 120)
            .attr("value","poverty")
            .classed("active",true)
            .text("In Poverty (%)");

        var ageLabel = xlabelsGroup.append("text")
            .attr("x",0 - (height/2) + 220)
            .attr("y",0 - margin.left + 140)
            .attr("value","age")
            .classed("inactive",true)
            .text("Age (Median)");

        var householdlabel = xlabelsGroup.append("text")
            .attr("x",0 - (height/2) + 220)
            .attr("y",0 - margin.left + 160)
            .attr("value","income")
            .classed("inactive",true)
            .text("Household Income (Median)");

        // Create group for 3 y-axis labels
        var ylabelsGroup = chartGroup.append("g")
            .attr("transform","rotate(-90)")

        var healthcareLabel = ylabelsGroup.append("text")
            .attr("y",0-margin.left + 60)
            .attr("x", 0 - (height/2) -10)
            .attr("value","healthcare")
            .classed("active",true)
            .text("Lacks Healthcare (%)");

        var smokesLabel = ylabelsGroup.append("text")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height/2))
            .attr("value","smokes")
            .classed("inactive",true)
            .text("Smokes (%)");

        var obeseLabel = ylabelsGroup.append("text")
            .attr("y", 0 - margin.left + 20)
            .attr("x", 0 - (height/2))
            .attr("value","obesity")
            .classed("inactive",true)
            .text("Obese (%)")


        // Step 6: Initialize tool tip
        /*var toolTip = d3.tip()
            .attr("class","tooltip")
            .offset([80,-60])
            .html(function(d){
                return (`State: ${d.state}<br>Poverty: ${d.poverty}<br> Healthcare: ${d.healthcare}`);
            }); */

        xlabelsGroup.selectAll("text").on("click",function() {
            var value = d3.select(this).attr("value");
            if (value !== chosenXAxis) {
                chosenXAxis = value;
                xLinearScale = xScale(data,chosenXAxis);
                xAxis = renderXAxes(xLinearScale,xAxis);
                return chosendXAxis,xLinearScale, xAxis;
            }
        })

        ylabelsGroup.selectAll("text").on("click",function() {
            var value1 = d3.select(this).attr("value");
            if (value1 !== chosenYAxis) {
                chosenYAxis = value1;
                yLinearScale = yScale(data,chosenYAxis);
                yAxis = renderYAxes(yLinearScale,yAxis);
                return chosendYAxis,yLinearScale,yAxis;
            }
        })

        //circlesGroup = renderCircles(circlesGroup,xLinearScale,yLinearScale,chosenXAxis,chosenYAxis)
        circlesGroup = updateToolTip(chosenXAxis,chosenYAxis,circlesGroup)


        // Perform the if statement that will change class 

        // Step 7: Create tooltip in the chart
        chartGroup.call(toolTip);

        // Step 8: Create event listeners to display and hide the tooltip
        circlesGroup.on("mouseover", function(data) {
            toolTip.show(data,this);
        })
            // onmouseout event
            .on("mouseout",function(data,index) {
                toolTip.hide(data);
            });

        // insert updateToolTip function here


    })
