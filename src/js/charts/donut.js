import * as d3 from "d3";
import { legendColor } from "d3-svg-legend";

export default class donutChart {
    constructor(data, canvas, width, height, margin, radius) {
        this.data = data;
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.graphWidth = this.width - this.margin.left - this.margin.right;
        this.graphHeight = this.height - this.margin.top - this.margin.bottom;
        this.center = {
            x: this.graphWidth / 2 + this.margin.left,
            y: this.graphHeight / 2 + this.margin.top
        }
        this.radius = radius;
    }

    graphSetup() {
        this.graph = this.canvas.append("g")
            .attr("transform", `translate(${this.center.x}, ${this.center.y})`);
    }

    graphPie() {
        this.pie = d3.pie()
            .sort(null)
            .value(d => d.Count);
    }

    graphArcPath() {
        this.arcPath = d3.arc()
            .outerRadius(this.radius)
            .innerRadius(this.radius / 2);
    }

    graphScales() {
        this.color = d3.scaleOrdinal(d3["schemeSet3"]);
    }

    graphLegend() {
        this.legendGroup = this.canvas.append("g")
            .attr("transform", `translate(${this.graphWidth * 0.9}, 0)`);
        
        this.legend = legendColor()
            .shape("circle")
            .shapePadding(5)
            .scale(this.color)
            .labelAlign("start");
    
    }

    update() {
        this.color.domain(this.data.map(d => d.Indicators));
        this.legendGroup.call(this.legend);
        this.legendGroup.selectAll("text").attr("fill", "white");

        this.paths = this.graph.selectAll("path")
            .data(this.pie(this.data));

        this.paths.enter()
            .append("path")
            .attr("d", this.arcPath)
            .attr("stroke", "#fff")
            .attr("stroke-width", 3)
            .attr("fill", d => this.color(d.data.Indicators));
    }

    grapher() {
        this.graphSetup();
        this.graphPie();
        this.graphArcPath();
        this.graphScales();
        this.graphLegend();
        this.update();
    }
}

/*
export default class StepChart {
    constructor(data, canvas, width, height, margin) {
        this.data = data;
        this.canvas = canvas;
        this.width = width;
        this.height = height;
        this.margin = margin;
        this.graphWidth = this.width - this.margin.left - this.margin.right;
        this.graphHeight = this.height - this.margin.top - this.margin.bottom;
    }

    graphSetup() {
        this.graph = this.canvas.append("g")
            .attr("tranform", () => `translate(${this.margin.left}, ${this.margin.top})`);
    }

    graphScales() {
        const dateExtent = d3.extent(this.data, d => d.date)
            .map(e => new Date(e));
        console.log(dateExtent, this.data);
        const countMax = d3.max(this.data, d => d.count);

        this.x = d3.scaleTime()
            .domain(dateExtent)
            .range([this.margin.left, this.graphWidth + this.margin.left])
            .nice()

        this.y = d3.scaleLinear()
            .domain([0, countMax])
            .range([this.graphHeight + this.margin.top, this.margin.top])
            .nice()
    }

    graphAxes() {
        const xAxisGroup = this.graph.append("g")
            .attr("transform", `translate(0, ${this.margin.top + this.graphHeight})`);

        const yAxisGroup = this.graph.append("g")
            .attr("transform", `translate(${this.margin.left}, 0)`);

        const xAxis = d3.axisBottom(this.x);
        const yAxis = d3.axisLeft(this.y);

        xAxisGroup.call(xAxis)
            .attr("class", "ticks");  // classes need to be added
        yAxisGroup.call(yAxis)
            .attr("class", "ticks");
    }

    graphLine() {
        const timeLine = d3.line()
            .x(d => this.x(new Date(d.date)))
            .y(d => this.y(d.count))
            .curve(d3.curveStepAfter)

        this.timePath = this.graph.append("path")
            .datum(this.data)
            .attr("d", timeLine)
            .attr("stroke", "white")
            .attr("stroke-width", 2)
            .attr("fill", "none")

        const l = this.timePath.node().getTotalLength();

        this.timePath.attr("stroke-dasharray", `${l}, ${l}`)
            .attr("stroke-dashoffset", l);

        this.timePath.transition()
            .duration(5000)
            .attr("stroke-dashoffset", 0);

        setTimeout(() => {
            this.graphCircles()
        }, 5000);
    }

    graphCircles() {
        let circles = this.graph.selectAll("circle")
            .data(this.data)
            .enter()
            .append("circle")
            .attr("r", 0)
            .attr("cx", d => this.x(new Date(d.date)))
            .attr("cy", d => this.y(d.count))
            .attr("class", "cursor-pointer")

        circles.transition()
            .duration(1500)
            .attr("r", 4)
            .attr("fill", "white")

        circles.on("mouseover", this.handleMouseOver.bind(this))
            .on("mouseout", this.handleMouseOut)
    }

    handleMouseOver(d, i, n) {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ]

        d3.select(n[i])
            .attr("r", 7)
            .attr("stroke", "gray")
            .attr("stroke-width", 2);

        this.graph.append("text")
            .attr("id", `t-${d.date}-${d.count}-${i}`)
            .attr("x", () => this.x(new Date(d.date)) - 30)
            .attr("y", () => this.y(d.count) - 15)
            .text(() => `${months[(new Date(d.date)).getMonth()]}: ${d.count}`)
            .attr("font-size", "14")
            .attr("fill", "gray");
    }

    handleMouseOut(d, i, n) {
        d3.select(this)
            .attr("r", 4)
            .attr("stroke", "white")
            .attr("stroke-width", 0);

        d3.select(`#t-${d.date}-${d.count}-${i}`)
            .remove();
    }

    graphAxesLabel() {
        this.graph.append("text")
            .text("Time")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${this.width / 1.9}, ${this.margin.bottom * 1.5 + this.graphHeight})`)
            .attr("font-size", "14")
            .attr("fill", "white")
        this.graph.append("text")
            .text("Complaint Count")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${this.margin.left / 3}, ${this.height / 1.9})rotate(-90)`)
            .attr("font-size", "14")
            .attr("fill", "white")
    }

    graphInfo() {
        this.graph.append("text")
            .text("Number of Rat Complaints Peaked in 2017 and Appeared to Have a Seasonal Pattern")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${this.width / 2}, ${this.margin.top / 3})`)
            .attr("font-size", "20")
            .attr("fill", "white")
        this.graph.append("text")
            .text("Monthly rat complaint counts from 2014 to 2018 in Chicago")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${this.width / 2}, ${this.margin.top / 1.5})`)
            .attr("font-size", "16")
            .attr("fill", "white")
        this.graph.append("text")
            .html(() => "Source: <a class='chart-source' href='https://data.cityofchicago.org/Service-Requests/311-Service-Requests-Rodent-Baiting-No-Duplicates/uqhs-j723'>Chicago Data Portal</a>")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${this.width / 1.19}, ${this.height - this.margin.bottom / 5})`)
            .attr("font-size", "14")
            .attr("fill", "white")
    }

    grapher() {
        this.graphSetup();
        this.graphScales();
        this.graphAxes();
        this.graphAxesLabel();
        this.graphInfo();
        this.graphLine();
    }
}
*/