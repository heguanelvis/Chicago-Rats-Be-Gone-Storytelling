import "bootstrap-css-only";
import "../css/style.css";

import ratfavi from "../img/ratfavi.png";
import slideBg1 from "../img/slideBg1.jpg";

import ScrollMagic from "scrollmagic";
import "imports-loader?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap";

import * as d3 from "d3";
import MapChart from "./charts/usMap";
import StepChart from "./charts/step";
import DonutChart from "./charts/donut";

/* Images */
let favicon = document.getElementById("favicon");
favicon.href = ratfavi;

let intro = document.querySelector(".intro");
intro.style.backgroundImage = `url(${slideBg1})`;

/* Data */
const files = ["data/chicago_5_year_complaints_by_date.json", "data/chicago_premise_indicators.json", "data/us_states.json", "data/us_rats_by_state.json"];

/* Plot */
Promise.all(files.map(path => d3.json(path)))
    .then(res => {
        /* Data Naming */
        const complaintsFiveYear = res[0];
        const premiseIndicators = res[1];
        const usStates = res[2];
        const usRats = res[3];

        /* US Map*/
        const mapMargin = { left: 75, right: 75, top: 75, bottom: 75 }
        const mapWidth = 1000;
        const mapHeight = 700;
        const mapScale = 1000;
        let mapCanvas = d3.select("#chart1")
            .append("svg")
            .attr("width", mapWidth)
            .attr("height", mapHeight)
        const mapChart = new MapChart(usStates, usRats, mapCanvas, mapWidth, mapHeight, mapMargin, mapScale);
        responsivefy(mapChart.canvas);

        /* Step Chart */
        const stepMargin = { left: 75, right: 75, top: 75, bottom: 75 }
        const stepWidth = 1000;
        const stepHeight = 700;
        let stepCanvas = d3.select("#chart2")
            .append("svg")
            .attr("width", stepWidth)
            .attr("height", stepHeight)
        const stepChart = new StepChart(complaintsFiveYear, stepCanvas, stepWidth, stepHeight, stepMargin);
        responsivefy(stepChart.canvas);

        /* Donut Chart */
        const donutMargin = { left: 75, right: 75, top: 75, bottom: 75 }
        const donutWidth = 1000;
        const donutHeight = 700;
        const donutRadius = 290;
        let donutCanvas = d3.select("#chart3")
            .append("svg")
            .attr("width", donutWidth)
            .attr("height", donutHeight)
        const donutChart = new DonutChart(premiseIndicators, donutCanvas, donutWidth, donutHeight, donutMargin, donutRadius);
        responsivefy(donutChart.canvas);

        /* Slider Control */
        let sliderController = new ScrollMagic.Controller();
        let wipeAnimation = new TimelineMax()
            .fromTo(".story-section.us-map", 0.3, { x: "-100%" }, { x: "0%", ease: Linear.easeNone })
            .call(() => {
                if (mapChart.graphed === false) {
                    mapChart.grapher();
                    TweenMax.fromTo(`${".us-map"} svg`, 0.5, { scale: 0.1 }, { scale: 1, ease: Linear.easeNone });
                };
            })
            .to("#pinContainer", 1, { z: 0 })
            .fromTo(".story-section.us-map", 0.3, { y: "0%" }, { y: "-100%", ease: Linear.easeNone })
            .to("#pinContainer", 1, { z: -100 })
            .fromTo(".story-section.step", 0.3, { x: "100%" }, { x: "0%", ease: Linear.easeNone })
            .call(() => {
                if (stepChart.graphed === false) {
                    stepChart.grapher();
                    TweenMax.fromTo(`${".step"} svg`, 0.5, { scale: 0.1 }, { scale: 1, ease: Linear.easeNone });
                };
            })
            .to("#pinContainer", 1, { z: 0 })
            .fromTo(".story-section.step", 0.3, { y: "0" }, { y: "-100%", ease: Linear.easeNone })
            .to("#pinContainer", 1, { z: -100 })
            .fromTo(".story-section.donut", 0.3, { y: "-100%" }, { y: "0%", ease: Linear.easeNone })
            .call(() => {
                if (donutChart.graphed === false) {
                    donutChart.grapher();
                    TweenMax.fromTo(`${".donut"} svg`, 0.5, { scale: 0.1 }, { scale: 1, ease: Linear.easeNone }); 
                };     
            });
        new ScrollMagic.Scene({
            triggerElement: "#pinContainer",
            triggerHook: "onLeave",
            duration: "700%"
        }).setPin("#pinContainer")
            .setTween(wipeAnimation)
            .addTo(sliderController);
    })
    .catch(err => {
        alert("Something went wrong...");
        console.log(err);
    });

/* Responsive Control */
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
        let targetWidth = parseInt(container.style("width"));
        if (targetWidth <= 1000) {
            svg.attr("width", targetWidth - 30);
            svg.attr("height", Math.round(targetWidth / aspect));
        };
    };
};

/* Start Animation */
{
    TweenMax.fromTo(".intro", 8, { scale: 2.3 }, { scale: 1, ease: Power2.easeOut });
};