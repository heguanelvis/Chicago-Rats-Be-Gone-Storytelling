import "bootstrap-css-only";
import "../css/style.css";
import * as d3 from "d3";
import ratfavi from "../img/ratfavi.png";
import StepChart from "./charts/step";

/* Images */
let favicon = document.getElementById('favicon');
favicon.href = ratfavi;

/* Data & Plotting */
const files = ["data/chicago_5_year_complaints_by_date.json"];

Promise.all(files.map(path => d3.json(path)))
    .then(res => {
        const complaintsFiveYear = res[0];
        console.log(complaintsFiveYear);

        const stepMargin = { left: 75, right: 75, top: 75, bottom: 75 }
        const stepWidth = 1000;
        const stepHeight = 700;

        let stepCanvas = d3.select("#chart2")
            .append("svg")
            .attr("width", stepWidth)
            .attr("height", stepHeight)

        const stepChart = new StepChart(complaintsFiveYear, stepCanvas, stepWidth, stepHeight, stepMargin);
        stepChart.graphSetup();
        stepChart.graphScales();
        stepChart.graphAxes();
        stepChart.graphAxesLabel();
        stepChart.graphLine();
        stepChart.graphInfo();
        responsivefy(stepChart.canvas)
  
        // stepChart.scatterPlot();

    })
    .catch(err => {
        alert("Something went wrong...");
        console.log(err);
    });

/* Responsive Design */
function responsivefy(svg) {
    const container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    svg.attr("viewBox", `0 0 ${width} ${height}`)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    d3.select(window).on(`resize.${container.attr("id")}`, resize);

    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth - 30);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}