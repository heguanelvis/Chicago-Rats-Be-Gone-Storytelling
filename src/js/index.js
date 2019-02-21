import "bootstrap-css-only";
import "../css/style.css";
import * as d3 from "d3";
import ratsExample from "../img/ratsExample.jpg";

const square = d3.selectAll("rect");
square.style("fill", "orange");

let ratsExampleImg = document.getElementById('ratsExample');
ratsExampleImg.src = ratsExample;