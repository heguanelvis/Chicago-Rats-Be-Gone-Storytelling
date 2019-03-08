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
    };

    graphMap() {
        this.graph.selectAll("path")
            .data(this.dataStates.features)
            .enter()
            .append("path")
            .attr("d", this.geoGenerator)
            .style("stroke", "white")
            .style("stroke-width", 2)
            .attr("fill", "rgba(0, 0, 0, 0)");
    };

    graphCircles() {
        let circles = this.graph.selectAll("circle")
            .data(this.dataRats)
            .enter()
            .append("circle")
            .attr("cx", d => this.projection([d.longitude, d.latitude])[0])
            .attr("cy", d => this.projection([d.longitude, d.latitude])[1]);
            
        circles.transition()
            .duration(1500)
            .attr("r", d => Math.sqrt(d.rats_capita) * 0.7)
            .attr("fill", d => d.city === "Chicago" ? "rgb(247, 171, 27)" : "rgb(252, 238, 33)")
            .attr("stroke", "white")
            .attr("stroke-width", 1)
            .attr("class", "cursor-pointer")
            .style("opacity", "0.8");
    
        circles.on("mouseover", this.handleMouseOver.bind(this))
            .on("mouseout", this.handleMouseOut);
    };

    handleMouseOver(d, i, n) {
        console.log(d.longitude);
        d3.select(n[i])
            .attr("r", d => Math.sqrt(d.rats_capita) * 0.8)
            .attr("fill", "rgb(229, 75, 39)");

        this.graph.append("foreignObject")
            .attr("width", 210)
            .attr("height", 50)
            .attr("id", `t-${d.pop}-${d.rats_capita}-${i}`)
            .attr("x", this.projection([d.longitude, d.latitude])[0])
            .attr("y", this.projection([d.longitude, d.latitude])[1] - 70)
            .html(() => {
                return `<div class="tip-style">${d.city}: ${d.rats_capita}</div>`;
            });
    };

    handleMouseOut(d, i, n) {
        d3.select(this)
            .attr("r", Math.sqrt(d.rats_capita) * 0.7)
            .attr("fill", d => d.city === "Chicago" ? "rgb(247, 171, 27)" : "rgb(252, 238, 33)")
            .style("opacity", "0.8");

        d3.select(`#t-${d.pop}-${d.rats_capita}-${i}`)
            .remove();
    };
    
    graphInfo() {
        this.graph.append("text")
            .html("<a class='em-title'>Chicago</a> Has the Most Rat Complaints per 100,000 Population All Year Round")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${this.width / 2}, ${this.margin.top / 3})`)
            .attr("font-size", "20")
            .attr("fill", "white");

        this.graph.append("text")
            .text("Rat complaints per 100,000 population by highly affected US cities in 2018")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${this.width / 2}, ${this.margin.top / 1.5})`)
            .attr("font-size", "16")
            .attr("fill", "white");

        this.graph.append("text")
            .html(() => "Source: <a class='chart-source' href='http://us-city.census.okfn.org/dataset/service-requests'>City Data Portals</a>")
            .attr("text-anchor", "middle")
            .attr("transform", `translate(${this.width / 1.3}, ${this.height - this.margin.bottom / 4})`)
            .attr("font-size", "14")
            .attr("fill", "white");
    };

    grapher() {
        this.graphSetup();
        this.graphProjection();
        this.graphMap();
        this.graphCircles();
        this.graphInfo();
    };
};