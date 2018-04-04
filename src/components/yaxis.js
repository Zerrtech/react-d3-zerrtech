import * as React from 'react';
import * as d3 from 'd3'
import {withFauxDOM} from 'react-faux-dom'
import CommonProps from './commonProps';

class YAxis extends React.Component {
    
    static defaultProps = {
        yDomain: (d) => d,
        ...CommonProps
    }
    
    componentDidMount() {
        this.renderD3();
    }
    
    componentDidUpdate (prevProps, prevState) {
        // do not compare props.chart as it gets updated in updateD3()
        if (this.props.data !== prevProps.data) {
            this.updateD3()
        }
    }
    
    renderD3() {
        const {
            height,
            data,
            title,
            yDomain,
            connectFauxDOM,
        } = this.props;

        let g = connectFauxDOM('g', 'chart');
        
        var yScale = d3.scaleLinear().clamp(true).range([height, 0]);
        yScale.domain([0, d3.max(data, yDomain)]);
        
        var axisDom = d3.select(g);
        var yAxis = d3.axisLeft(yScale).tickFormat(d3.format('.2s'));
        
        axisDom
            .attr("class", "axis axis--y")
            .call(yAxis)
            .append("text")
                .attr("transform", "rotate(-90)")
                .attr("y", -6)
                .attr("dy", "0.71em")
                .attr("text-anchor", "end")
                .text(title);
        
    }
    
    updateD3() {
        const {
            height,
            data,
            duration,
            yDomain,
            connectFauxDOM,
            animateFauxDOM,
        } = this.props;
        
        let g = connectFauxDOM('g', 'chart');
        
        var yScale = d3.scaleLinear().clamp(true).range([height, 0]);
        yScale.domain([0, d3.max(data, yDomain)]);
        
        var axisDom = d3.select(g);
        var yAxis = d3.axisLeft(yScale).tickFormat(d3.format('.2s'));
        
        axisDom
            .transition()
            .duration(duration)
            .call(yAxis)
        
        animateFauxDOM(duration);
        
    }
    
    render() {
        if (this.props.chart) {
            return this.props.chart
        } else {
            return null;
        }    
    }
}

export default withFauxDOM(YAxis);
