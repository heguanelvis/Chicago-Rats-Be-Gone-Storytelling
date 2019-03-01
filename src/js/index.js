import "bootstrap-css-only";
import "../css/style.css";

import ratfavi from "../img/ratfavi.png";

import ScrollMagic from 'scrollmagic';
import 'imports-loader?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
import { TimelineMax } from "gsap";

import * as d3 from "d3";
import MapChart from "./charts/usMap";
import StepChart from "./charts/step";
import DonutChart from "./charts/donut";

/* Images */
let favicon = document.getElementById('favicon');
favicon.href = ratfavi;

/* Data */
const files = ["data/chicago_5_year_complaints_by_date.json", "data/chicago_premise_indicators.json", "data/us-states.json", "data/usRats_by_state.json"];

/* Plot */
Promise.all(files.map(path => d3.json(path)))
    .then(res => {
        /* Data Naming */
        const complaintsFiveYear = res[0];
        const premiseIndicators = res[1];
        const usStates = res[2];
        const usRats = res[3];
        console.log(usRats);

        /* US Map*/
        const mapMargin = { left: 75, right: 75, top: 75, bottom: 75 }
        const mapWidth = 1000;
        const mapHeight = 700;
        let mapCanvas = d3.select("#chart1")
            .append("svg")
            .attr("width", mapWidth)
            .attr("height", mapHeight);
        const mapChart = new MapChart(usStates, usRats, mapCanvas, mapWidth, mapHeight, mapMargin);

        /* Step Chart */
        const stepMargin = { left: 75, right: 75, top: 75, bottom: 75 }
        const stepWidth = 1000;
        const stepHeight = 700;
        let stepCanvas = d3.select("#chart2")
            .append("svg")
            .attr("width", stepWidth)
            .attr("height", stepHeight);
        const stepChart = new StepChart(complaintsFiveYear, stepCanvas, stepWidth, stepHeight, stepMargin);
        animateChart(".step", stepChart);
        responsivefy(stepChart.canvas);

        /* Donut Chart */
        const donutMargin = { left: 75, right: 75, top: 75, bottom: 75 }
        const donutWidth = 1000;
        const donutHeight = 700;
        const donutRadius = 300;
        let donutCanvas = d3.select("#chart3")
            .append("svg")
            .attr("width", donutWidth)
            .attr("height", donutHeight);
        const donutChart = new DonutChart(premiseIndicators, donutCanvas, donutWidth, donutHeight, donutMargin, donutRadius);
        animateChart(".donut", donutChart);
        responsivefy(donutChart.canvas);
    })
    .catch(err => {
        alert("Something went wrong...");
        console.log(err);
    });

/* Animate Chart Control */
function animateChart(selector, chart) {
    document.querySelector(selector).addEventListener("mouseover", () => chart.grapher(), { once: true })
}

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
        svg.attr("width", targetWidth - 30);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}

/* Slider Control */
{
    let sliderController = new ScrollMagic.Controller();
    let wipeAnimation = new TimelineMax()
        .to("#pinContainer", 1, { z: -100 })
        .fromTo(".story-section.us-map", 1, { x: "-100%" }, { x: "0%", ease: Linear.easeNone })
        .to("#pinContainer", 1, { z: 0 })
        .fromTo(".story-section.us-map", 1, { y: "0%" }, { y: "-100%", ease: Linear.easeNone })
        .to("#pinContainer", 1, { z: -100 })
        .fromTo(".story-section.step", 1, { x: "100%" }, { x: "0%", ease: Linear.easeNone })
        .to("#pinContainer", 1, { z: 0 })
        .fromTo(".story-section.step", 1, { y: "0" }, { y: "-100%", ease: Linear.easeNone })
        .to("#pinContainer", 1, { z: -100 })
        .fromTo(".story-section.donut", 1, { y: "-100%" }, { y: "0%", ease: Linear.easeNone })
        .to("#pinContainer", 1, { z: 0 })

    new ScrollMagic.Scene({
        triggerElement: "#pinContainer",
        triggerHook: "onLeave",
        duration: "1650%"
    }).setPin("#pinContainer")
        .setTween(wipeAnimation)
        .addTo(sliderController);

    window.addEventListener("resize", () => {
        if (!isMobileDevice()) location.reload();
    })

    function isMobileDevice() {
        return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
    };
}