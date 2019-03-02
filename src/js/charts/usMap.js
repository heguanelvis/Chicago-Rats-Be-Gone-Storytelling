import * as d3 from "d3";

export default class MapChart {
    constructor(dataStates, dataRats, canvas, width, height, margin, scale) {
        this.dataStates = dataStates;
        this.dataRats = dataRats;
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.scale = scale;
        this.graphWidth = this.width - this.margin.left - this.margin.right;
        this.graphHeight = this.height - this.margin.top - this.margin.bottom;
    };

    graphSetup() {
        this.graph = this.canvas.append("g")
            .attr("tranform", `translate(${this.margin.left}, ${this.margin.top})`);
    };

    graphProjection() {
        this.projection = d3.geoAlbersUsa()
            .translate([ this.width / 2, this.height / 2])
            .scale([this.scale]);
    
        this.geoGenerator = d3.geoPath(this.projection);
    }

    graphMap() {
        this.graph.selectAll("path")
            .data(this.dataStates.features)
            .enter()
            .append("path")
            .attr("d", this.geoGenerator)
            .style("stroke", "#fff")
            .style("stroke-width", 2)
            .attr("fill", "rgba(0, 0, 0, 0)");
    };

    graphCircles() {
        this.graph.selectAll("circle")
            .data(this.dataRats)
            .enter()
            .append("circle")
            .attr("cx", d => this.projection([d.longitude, d.latitude])[0])
            .attr("cy", d => this.projection([d.longitude, d.latitude])[1])
            .attr("r", d => Math.sqrt(d.rats_capita) * 0.7)
            .attr("fill", "red")
            .attr("stroke", "#fff")
            .attr("stroke-width", 1)
            .style("opacity", "0.8");
    }

    grapher() {
        this.graphSetup();
        this.graphProjection();
        this.graphMap();
        this.graphCircles();
    };
};