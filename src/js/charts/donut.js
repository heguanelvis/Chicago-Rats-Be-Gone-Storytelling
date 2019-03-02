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
            x: this.graphWidth / 2 + 2.3 * this.margin.left,
            y: this.graphHeight / 2 + 1.7 * this.margin.top
        }
        this.radius = radius;
    };

    graphSetup() {
        this.graph = this.canvas.append("g")
            .attr("transform", `translate(${this.center.x}, ${this.center.y})`);
    };

    graphPie() {
        this.pie = d3.pie()
            .sort(null)
            .value(d => d.Count);
    };

    graphArcPath() {
        this.arcPath = d3.arc()
            .outerRadius(this.radius)
            .innerRadius(this.radius / 2);
    };

    graphScales() {
        this.color = d3.scaleOrdinal(d3["schemeSet3"]);
    };

    graphLegend() {
        this.legendGroup = this.canvas.append("g")
            .attr("transform", `translate(${2 * this.margin.left}, ${0.1 * this.height})`);
        
        this.legend = legendColor()
            .shape("circle")
            .shapePadding(5)
            .scale(this.color);
    };

    handleMouseOver(d, i, n) {
        d3.select(n[i])
            .transition("changeSliceFill").duration(300)
            .attr("fill", "#fff");

        const centroid = this.arcPath.centroid(d);

        this.graph.append("foreignObject")
            .attr("width", 190)
            .attr("height", 100)
            .attr("id", `t-${d.Indicators}-${d.Count}-${i}`)
            .attr("x", centroid[0])
            .attr("y", centroid[1] - 180)
            .html(() => {
                let content = `<div class="donut-tip"><div class="donut-indicators">${d.data.Indicators}</div>`;
                content += `<div class="donut-count">${d.data.Count}</div>`;
                content += `<div class="delete">Click slice to remove</div></div>`;
                return content;
            });
    };

    handleMouseOut(d, i, n) {
        d3.select(n[i])
            .transition("changeSliceFill").duration(300)
            .attr("fill", this.color(d.data.Indicators));

        d3.select(`#t-${d.Indicators}-${d.Count}-${i}`)
            .remove();
    };

    handleClick(d, i, n) {
        this.data = this.data.filter(e => e.Indicators !== d.data.Indicators)
        if (this.data.length >= 2) {
            this.update();
        } else {
            alert("You must have at least two indicators to compare.");
        };
    };

    arcTweenEnter(d, arcPath) {
        let i = d3.interpolate(d.endAngle, d.startAngle);

        return function (t) {
            d.startAngle = i(t);
            return arcPath(d);
        };
    };

    arcTweenExit(d, arcPath) {
        let i = d3.interpolate(d.startAngle, d.endAngle);
        return function (t) {
            d.startAngle = i(t);
            return arcPath(d);
        };
    };

    arcTweenUpdate(d, arcPath) {
        let i = d3.interpolate(this._current, d);
        this._current = i(1);
        return function (t) {
            return arcPath(i(t));
        };
    };

    graphInfo() {
        this.graph.append("text")
            .text("Most Rat Complaints Are Filled at Baited Premises with Garbage and Rats")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${this.width * 0.03}, ${this.height/ -1.85})`)
            .attr("font-size", "20")
            .attr("fill", "white");

        this.graph.append("text")
            .text("Premises with garbage seem to be more related with rat complaints in Chicago")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${this.width * 0.03}, ${this.height / -2})`)
            .attr("font-size", "16")
            .attr("fill", "white");

        this.graph.append("text")
            .html(() => "Source: <a class='chart-source' href='https://data.cityofchicago.org/Service-Requests/311-Service-Requests-Rodent-Baiting-No-Duplicates/uqhs-j723'>Chicago Data Portal</a>")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${this.width * 0.27}, ${(this.height + this.margin.top) * 0.38})`)
            .attr("font-size", "14")
            .attr("fill", "white");
    }
    
    update() {
        this.color.domain(this.data.map(d => d.Indicators));
        this.legendGroup.call(this.legend);
        this.legendGroup.selectAll("text").attr("fill", "white");

        const paths = this.graph.selectAll("path")
            .data(this.pie(this.data));

        paths.exit()
            .attr("fill", d => this.color(d.data.Indicators))
            .transition().duration(750)
            .attrTween("d", d => {console.log(d); this.arcTweenExit(d, this.arcPath)})
            .remove();

        paths.attr("d", this.arcPath)
            .attr("fill", d => this.color(d.data.Indicators))
            .transition().duration(750)
            .attrTween("d", d => this.arcTweenUpdate(d, this.arcPath));

        paths.enter()
            .append("path")
            .attr("d", this.arcPath)
            .attr("stroke", "#fff")
            .attr("stroke-width", 3)
            .attr("fill", d => this.color(d.data.Indicators))
            .each((d, i, n) => n[i]._current = d)
            .transition().duration(750)
            .attrTween("d", d => this.arcTweenEnter(d, this.arcPath));

        this.graph.selectAll("path")
            .on("mouseover", this.handleMouseOver.bind(this))
            .on("mouseout", this.handleMouseOut.bind(this))
            .on("click", this.handleClick.bind(this));
    };

    grapher() {
        this.graphSetup();
        this.graphPie();
        this.graphArcPath();
        this.graphScales();
        this.graphLegend();
        this.graphInfo();
        this.update();
    };
};
