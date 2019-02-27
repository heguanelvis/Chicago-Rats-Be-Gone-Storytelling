import "bootstrap-css-only";
import "../css/style.css";

import ratfavi from "../img/ratfavi.png";

import ScrollMagic from 'scrollmagic';
import 'imports-loader?define=>false!scrollmagic/scrollmagic/uncompressed/plugins/animation.gsap';
import { TimelineMax } from "gsap";

import * as d3 from "d3";
import StepChart from "./charts/step";

/* Images */
let favicon = document.getElementById('favicon');
favicon.href = ratfavi;

/* Data */
const files = ["data/chicago_5_year_complaints_by_date.json"];

/* Plot */
Promise.all(files.map(path => d3.json(path)))
    .then(res => {
        /* Data Naming */
        const complaintsFiveYear = res[0];

        /* US Map*/

        /* Step Chart */
        const stepMargin = { left: 75, right: 75, top: 75, bottom: 75 }
        const stepWidth = 1000;
        const stepHeight = 700;
        let stepCanvas = d3.select("#chart2")
            .append("svg")
            .attr("width", stepWidth)
            .attr("height", stepHeight)
        const stepChart = new StepChart(complaintsFiveYear, stepCanvas, stepWidth, stepHeight, stepMargin);
        stepChart.grapher();
        responsivefy(stepChart.canvas);

        /* Donut Chart */
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
        svg.attr("width", targetWidth - 30);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}

/* Slider Control */
let sliderController = new ScrollMagic.Controller();
let wipeAnimation = new TimelineMax()
    .fromTo(".story-section.us-map", 1, { x: "-100%" }, { x: "0%", ease: Linear.easeNone })
    .fromTo(".story-section.us-map", 1, { y: "0%" }, { y: "-100%", ease: Linear.easeNone })
    .fromTo(".story-section.step", 1, { x: "100%" }, { x: "0%", ease: Linear.easeNone })
    .fromTo(".story-section.step", 1, { y: "0" }, { y: "-100%", ease: Linear.easeNone })
    .fromTo(".story-section.donut", 1, { y: "-100%" }, { y: "0%", ease: Linear.easeNone })
new ScrollMagic.Scene({
    triggerElement: "#pinContainer",
    triggerHook: "onLeave",
    duration: "300%"
}).setPin("#pinContainer")
    .setTween(wipeAnimation)
    .addTo(sliderController);

window.addEventListener("resize", () => {
    if (!isMobileDevice()) location.reload();
})

function isMobileDevice() {
    return (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);
};