import * as d3 from "d3";

export default class MapChart {
    constructor(data_state, data_rats, canvas, width, height, margin) {
        this.data_states = data_state;
        this.data_rats = data_rats;
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.graphWidth = this.width - this.margin.left - this.margin.right;
        this.graphHeight = this.height - this.margin.top - this.margin.bottom;
    };

    graphSetup() {
        this.graph = this.canvas.append("g")
            .attr("tranform", `translate(${this.margin.left}, ${this.margin.top})`);
    };



    grapher() {
        this.graphSetup();

    };
};