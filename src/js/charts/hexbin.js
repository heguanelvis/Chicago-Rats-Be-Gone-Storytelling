import * as d3 from "d3";
import { hexbin as d3Hexbin } from "d3-hexbin";

export default class Hexbin {
    constructor(data, canvas, width, height, margin) {
        this.data = data;
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.graphWidth = this.width - this.margin.left - this.margin.right;
        this.graphHeight = this.height - this.margin.top - this.margin.bottom;
        this.graphed = false;
    };

    graphSetup() {
        this.graph = this.canvas.append("g")
            .attr("tranform", `translate(${this.margin.left}, ${this.margin.top})`);
    };

    graphScales() {
        this.x = d3.scaleLinear()
            .domain(d3.extent(this.data, d => d.vacantHousing))
            .range([this.margin.left, this.graphWidth + this.margin.left])
            .nice();

        this.y = d3.scaleLinear()
            .domain(d3.extent(this.data, d => d.complaintCount))
            .range([this.graphHeight + this.margin.top - 25, this.margin.top])
            .nice();
    };

    graphAxes() {
        const xAxisGroup = this.graph.append("g")
            .attr("transform", `translate(0, ${this.margin.top + this.graphHeight})`);

        const yAxisGroup = this.graph.append("g")
            .attr("transform", `translate(${this.margin.left}, 0)`);

        const xAxis = d3.axisBottom(this.x);
        const yAxis = d3.axisLeft(this.y);

        xAxisGroup.call(xAxis)
            .attr("class", "ticks-style");
        yAxisGroup.call(yAxis)
            .attr("class", "ticks-style");
    };

    graphHexbin() {
        this.hexbin = d3Hexbin()
            .x(d => this.x(d.vacantHousing))
            .y(d => this.y(d.complaintCount))
            .radius(20)
            .extent([
                [this.margin.left, this.margin.top],
                [this.margin.left + this.graphWidth, this.margin.top + this.graphHeight]
            ]);

        this.bins = this.hexbin(this.data);

        this.fill = d3.scaleThreshold()
            .domain([1, 2, 3, 4, 5, 6, 8, d3.max(this.bins, d => d.length) / 2])
            .range(["#ffffff", "#fffac6", "#fff486", "#fcee21", "#f9c524", "#f49c25", "#ec7025", "#e95f26", "#e54b27"]);

        this.paths = this.graph.selectAll("path")
            .data(this.bins)
            .join("path")
            .attr("d", this.hexbin.hexagon())
            .attr("transform", `translate(${this.margin.left * 1.5}, ${this.margin.top * 1.5})`)
            .attr("fill", d => this.fill(d.length))
            .attr("class", "cursor-pointer");

        this.paths.transition()
            .duration(1250)
            .attr("transform", d => `translate(${d.x}, ${d.y})`);

        this.paths.on("mouseover", this.handleMouseOver.bind(this))
            .on("mouseout", this.handleMouseOut);
    };

    handleMouseOver(d, i, n) {
        d3.select(n[i])
            .attr("stroke", "rgb(203, 32, 45)")
            .attr("stroke-width", 5)
            .attr("stroke-opacity", 0.8);

        this.graph.append("foreignObject")
        .attr("width", 120)
        .attr("height", 80)
            .attr("id", `t-${parseInt(d.x)}-${parseInt(d.y)}-${i}`)
            .attr("x", d.x + 5)
            .attr("y", d.y - 100)
            .html(() => {
                return `<div class="tip-style">Community Count: ${d.length}</div>`;
            });
    };

    handleMouseOut(d, i, n) {
        d3.select(this)
            .attr("stroke", "none");

        d3.select(`#t-${parseInt(d.x)}-${parseInt(d.y)}-${i}`)
            .remove();
    };

    graphAxesLabel() {
        this.graph.append("text")
            .text("Vacant Property Count")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${this.width / 1.9}, ${this.margin.bottom * 1.55 + this.graphHeight})`)
            .attr("font-size", "14")
            .attr("fill", "white");

        this.graph.append("text")
            .text("Complaint Count")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${this.margin.left / 4}, ${this.height / 1.9})rotate(-90)`)
            .attr("font-size", "14")
            .attr("fill", "white");
    };

    graphInfo() {
        this.graph.append("text")
            .text("Communities with More Vacant Properties Are More Likely to See Rat Complaints")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${this.width / 2.02}, ${this.margin.top / 3})`)
            .attr("font-size", "20")
            .attr("fill", "white");

        this.graph.append("text")
            .text("Relationship between complaint count and vacant property count in Chicago Communities (2014 to 2018)")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${this.width / 2}, ${this.margin.top / 1.5})`)
            .attr("font-size", "16")
            .attr("fill", "white");

        this.graph.append("text")
            .html(() => "Source: <a class='chart-source' href='https://data.cityofchicago.org/Service-Requests/311-Service-Requests-Rodent-Baiting-No-Duplicates/uqhs-j723'>Chicago Data Portal</a>")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${this.width / 1.19}, ${this.height - this.margin.bottom / 5})`)
            .attr("font-size", "14")
            .attr("fill", "white");
    };

    grapher() {
        this.graphSetup();
        this.graphScales();
        this.graphAxes();
        this.graphHexbin();
        this.graphAxesLabel();
        this.graphInfo();
        this.graphed = true;
    };
};