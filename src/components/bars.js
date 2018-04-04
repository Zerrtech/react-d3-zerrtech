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

    getXScale(width, domain, data) {
        let xScale = d3.scaleBand().rangeRound([0, width]).padding(0.3);
        xScale.domain(data.map(domain));
        return xScale;
    }
    
    getYScale(height, yDomain, data) {
        let yScale = d3.scaleLinear().clamp(true).range([height, 0]);
        yScale.domain([0, d3.max(data, yDomain)]);
        return yScale;
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
        let xScale = this.getXScale(width, xDomain, data);
        let yScale = this.getYScale(height, yDomain, data);

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
        let xScale = this.getXScale(width, xDomain, data);
        let yScale = this.getYScale(height, yDomain, data);
        
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
    
    // render() {

    //     d3.select(g)
    //         .attr('class', 'bar-group')
    //         .data(data, xDomain)
    //         .append('rect')
    //             .attr('class', 'bar')
    //             .attr('x', (d) => xScale(d.country))
    //             .attr('y', (d) => yScale(d.population))
    //             .attr('width', xScale.bandwidth())
    //             .attr('height', (d) => (height - yScale(d.population)))

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
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return this.indexToColor(Math.abs(hash));
    }

    /**
     * Convert index to a color
     * @param {integer} n
     * @returns {string} color hext string 
     */
    indexToColor(n) {
        var colors = [
            "#3366cc",
            "#dc3912",
            "#ff9900",
            "#109618",
            "#990099",
            "#0099c6",
            "#dd4477",
            "#66aa00",
            "#b82e2e",
            "#316395",
            "#994499",
            "#22aa99",
            "#aaaa11",
            "#6633cc",
            "#e67300", 
            "#8b0707",
            "#651067",
            "#329262",
            "#5574a6",
            "#3b3eac"
        ];
        return colors[n % colors.length];
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
