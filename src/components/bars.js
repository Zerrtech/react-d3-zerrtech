import * as React from 'react';
import * as d3 from 'd3'
import {withFauxDOM} from 'react-faux-dom'
import CommonProps from './commonProps';

class Bars extends React.Component {
    
    static defaultProps = {
        xDomain: (d) => d,
        yDomain: (d) => d,
        xKey: '',
        yKey: '',
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
    
    onClick(d) {
        this.props.onClick(d);
    }
    
    renderD3() {
        const {
            height,
            width,
            data,
            duration,
            xDomain,
            yDomain,
            xKey,
            yKey,
            connectFauxDOM,
            animateFauxDOM,
        } = this.props;
        
        let g = connectFauxDOM('g', 'chart');
        
        var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.3);
        var yScale = d3.scaleLinear().clamp(true).range([height, 0]);
        
        xScale.domain(data.map(xDomain));
        yScale.domain([0, d3.max(data, yDomain)]);   
        
        let update = d3.select(g)
            .selectAll('g.bar-group')
            .data(data, xDomain);
        
        // exit
        update
            .exit()
            .remove();      
        
        update
            .enter()
            // create group
            .append('g')
                .attr('class', 'bar-group')
                // move group to correct x location
                .attr('transform', function(d) {
                    return ['translate(' + xScale(d[xKey]) + ',' + height + ')'];
                })
                .append('rect')
                    .attr('class', 'bar')
                    .attr('fill', (d) => this.stringToColor(d[xKey]))
                    .attr('width', xScale.bandwidth())
                    .attr('height', 0)
                    .attr('y', 0)
                    .on('click', (d) => this.onClick(d))
                    .transition()
                    .duration(duration)
                    .attr('height', (d) => (height - yScale(d[yKey])))
                    .attr('y', (d) => (yScale(d[yKey]) - height))


        animateFauxDOM(duration);  
    }
    
    updateD3() {
        const {
            height,
            width,
            data,
            duration,
            xDomain,
            yDomain,
            xKey,
            yKey,
            connectFauxDOM,
            animateFauxDOM,
        } = this.props;
        
        let g = connectFauxDOM('g', 'chart');
        
        var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.3);
        var yScale = d3.scaleLinear().clamp(true).range([height, 0]);
        
        
        xScale.domain(data.map(xDomain));
        yScale.domain([0, d3.max(data, yDomain)]);
        
        // select update 
        let update = d3.select(g)
            .selectAll('g.bar-group')
            .data(data, xDomain)
            ;
        
        // exit
        update
            .exit()
            .remove();
        
        // enter
        update
            .enter()
            // create group
            .append('g')
                .attr('class', 'bar-group')
                // move group to correct x location
                .attr('transform', function(d) {
                    return ['translate(' + xScale(d[xKey]) + ',' + height + ')'];
                })
                .append('rect')
                    .attr('class', 'bar')
                    .attr('fill', (d) => this.stringToColor(d[xKey]))
                    .attr('width', xScale.bandwidth())
                    .attr('height', 0)
                    .attr('y', 0)
                    .on('click', (d) => this.onClick(d))
                    .transition()
                    .duration(duration)
                    .attr('height', (d) => (height - yScale(d[yKey])))
                    .attr('y', (d) => (yScale(d[yKey]) - height))

        // update
        update
            .transition()
            .duration(duration)
            .attr('transform', function(d) {
                return ['translate(' + xScale(d[xKey]) + ',' + height + ')'];
            })
            .select('.bar')
                .attr('width', xScale.bandwidth())
                .attr('height', (d) =>  (height - yScale(d[yKey])))
                .attr('y', (d) => (yScale(d[yKey]) - height))
            ;                    

        animateFauxDOM(duration);
        
    }
    
    // oldrender() {
    //     const {
    //         data,
    //         children,
    //         width,
    //         height,
    //         connectFauxDOM,
    //         animateFauxDOM,
    //     } = this.props;
        
    //     let g = ReactFauxDOM.createElement('g');
        
    //     var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.3);
    //     var yScale = d3.scaleLinear().clamp(true).range([height, 0]);
        
    //     xScale.domain(data.map(function(d) { return d.key; }));
    //     yScale.domain([0, d3.max(data, function(d) { return d.population; })]);
    //     // var t = d3.transition().duration(500);
        
    //     return (
    //         <g>
    //         {
    //             data.map((bar, i) => {
    //                 return (
    //                     <rect
    //                     key={i}
    //                     className={`bar`}
    //                     x={xScale(bar.country)}
    //                     y={yScale(bar.population)}
    //                     width={xScale.bandwidth()}
    //                     height={height - yScale(bar.population)}
    //                     />
    //                 )
    //             })
    //         }
    //         </g>
    //     )
        
    // }
    
    /**
    * Convert string to hex color
    * @param {string} str string to convert
    * @returns {string} color hex string
    */
    stringToColor(str) {
        var hash = 0;
        for (var i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        var color = '#';
        for (i = 0; i < 3; i++) {
            var value = (hash >> (i * 8)) & 0xFF;
            color += ('00' + value.toString(16)).substr(-2);
        }
        return color;
    }
    
    
    render() {
        if (this.props.chart) {
            return this.props.chart
        } else {
            return null;
        }     
    }
}

export default withFauxDOM(Bars);
