"use strict";

const colors = ["#004c6d", "#3d708f", "#6996b3","#94bed9", "#c1e7ff"];

const countiesURL = "https://cdn.freecodecamp.org/testable-projects-fcc/data/choropleth_map/counties.json";
const educationURL = "Poverty2023.json";

let educationData, countiesData;
let tooltip = d3.select('#tooltip');

Promise.all([
    fetch(educationURL).then(res => res.json()),
    fetch(countiesURL).then(res => res.json())
])
    .then(([education, counties]) => {
        educationData = education;
        countiesData = topojson.feature(counties, counties.objects.counties).features;

        console.log("Education Data: ", educationData);
        console.log("Counties Data: ", countiesData);
        
        drawMap(); 
    })
    .catch(error => console.error("Error fetching data:", error));

const canvas = d3.select('#canvas');

const drawMap = () => {
    canvas.selectAll('path')
        .data(countiesData)
        .enter()
        .append('path')
        .attr('d', d3.geoPath())
        .attr("class", "county")
        .attr("fill", (countyDataItem) => {
            let id = countyDataItem.id;
            let county = educationData.find((item) => item.FIPS_Code === id && item.Attribute === "PCTPOV517_2023");
        
            if (!county) {
                return "#ccc"; // Default color if no data is found
            }
        
            let percentage = county.Value;
            
            if (percentage > 75) {
                return colors[0];
            } else if (percentage > 50) {
                return colors[1];
            } else if (percentage > 25) {
                return colors[2];
            } else {
                return colors[3];
            }
        })
        .attr('data-fips', (countyDataItem) => countyDataItem.id)
        .attr('data-education', (countyDataItem) => {
            let id = countyDataItem.id;
            let county = educationData.find(item => item.FIPS_Code === id && item.Attribute === "PCTPOV517_2023");
            return county ? county.Value : "No Data";
        })
        .on('mouseover', (event, d) => {
            let id = d.id;
            let county = educationData.find(item => item.FIPS_Code === id && item.Attribute === "PCTPOV517_2023");

            if (!county) {
                tooltip.style('visibility', 'hidden');
                return;
            }

            let percentage = county.Value;
            tooltip.style('visibility', 'visible')
                .html(`${county.Area_Name}, ${county.Stabr}: ${percentage}%`)
                .attr('data-education', percentage)
                .style('left', event.pageX + 10 + 'px')
                .style('top', event.pageY - 20 + 'px');
        })
        .on('mouseout', () => {
            tooltip.style('visibility', 'hidden');
        });
};
