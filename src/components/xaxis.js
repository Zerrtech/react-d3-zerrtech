import {
    Component
} from 'react';
import * as d3 from 'd3'
import { withFauxDOM } from 'react-faux-dom'
import CommonProps from './commonProps';


class XAxis extends Component {
    
    static defaultProps = {
        xDomain: (d) => d,
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
            width,
            data,
            xDomain,
            connectFauxDOM
        } = this.props;
        
        let g = connectFauxDOM('g', 'chart');
        
        var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.3);    
        xScale.domain(data.map(xDomain));
        
        var axisDom = d3.select(g);
        var xAxis = d3.axisBottom(xScale);    
        
        axisDom
            .attr("class", "axis axis--x")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);
        
    }
    
    updateD3() {
        const {
            width,
            data,
            duration,
            xDomain,
            connectFauxDOM,
            animateFauxDOM,
        } = this.props;
        
        let g = connectFauxDOM('g', 'chart');
        
        var xScale = d3.scaleBand().rangeRound([0, width]).padding(0.3);    
        xScale.domain(data.map(xDomain));
        
        var axisDom = d3.select(g);
        var xAxis = d3.axisBottom(xScale);
        
        axisDom
            .transition()
            .duration(duration)
            .call(xAxis);
        
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

export default withFauxDOM(XAxis);
