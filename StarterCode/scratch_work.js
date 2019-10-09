// Create axes labels
        chartGroup.append("text")
            .attr("transform","rotate(-90)")
            .attr("y", 0 - margin.left + 40)
            .attr("x", 0 - (height/2) - 30)
            .attr("dy","1em")
            .attr("class","axisText_Health")
            .text("Lacks Healthcare (%)");

        chartGroup.append("text")
            .attr("transform","rotate(-90)")
            .attr("y", 0 - margin.left + 20)
            .attr("x", 0 - (height/2))
            .attr("dy","1em")
            .attr("class","axisText_Smokes")
            .text("Smokes (%)");

        chartGroup.append("text")
            .attr("transform","rotate(-90)")
            .attr("y", 0 - margin.left )
            .attr("x", 0 - (height/2) + 5)
            .attr("dy","1em")
            .attr("class","axisText_Obese")
            .text("Obese (%)");

        chartGroup.append("text")
            .attr("transform",`translate(${width/2},${height + margin.top})`)
            .attr("class","axisText_Poverty")
            .attr("y", 0 - margin.left + 120)
            .text("In Poverty (%)");

        chartGroup.append("text")
            .attr("transform",`translate(${width/2},${height + margin.top})`)
            .attr("class","axisText_Age")
            .attr("y", 0 - margin.left + 140)
            .text("Age (Median)");

        chartGroup.append("text")
            .attr("transform",`translate(${width/2},${height + margin.top})`)
            .attr("class","axisText_Age")
            .attr("y", 0 - margin.left + 160)
            .attr("x", 0 - (height/2) + 165)
            .text("Household Income (Median)");