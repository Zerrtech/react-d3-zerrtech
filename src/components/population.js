import * as React from 'react';
import { connect } from 'react-redux';
import {
    selectCountry,
    backCountry
} from '../modules/population';
import {withFauxDOM} from 'react-faux-dom'
import Chart from './chart'
import Bars from './bars'
import XAxis from './xaxis'
import YAxis from './yaxis'


class Population extends React.Component {
    
    onClickBar(d) {
        const {
            mode,
            selectCountry,
            backCountry
        } = this.props;
        // if in country mode, go to country
        if (mode === 'country') {
            selectCountry(d.country);
        } else { // if in city mode, go back to country
            backCountry();
        }
    }
    
    render() {
        const {
            data,
        } = this.props;
        
        // set margins
        var margins = {
            top: 20,
            right: 40,
            bottom: 65,
            left: 65
        };
        
        // calculate visualization width and height
        const width = 900 - margins.left - margins.right;
        const height = 425 - margins.top - margins.bottom;
        
        // transition durations
        var duration = 500;
        
        // domains
        const xDomain = (d) => d.key;
        const yDomain = (d) => d.population;
        
        return (
            <div>
                <Chart
                data={data}
                width={width}
                height={height}
                margins={margins}
                >
                    <Bars
                        data={data}
                        width={width}
                        height={height}
                        margins={margins}
                        duration={duration}
                        xDomain={xDomain}
                        yDomain={yDomain}
                        xKey="key"
                        yKey="population"
                        onClick={(d) => this.onClickBar(d)}
                    />
                    <XAxis
                        data={data}
                        width={width}
                        height={height}
                        margins={margins}
                        duration={duration}
                        xDomain={xDomain}
                    />
                    <YAxis
                        data={data}
                        width={width}
                        height={height}
                        margins={margins}   
                        duration={duration}
                        yDomain={yDomain}
                        title="Population"       
                    />
                </Chart>
            </div>
        )
        
    }
}

const mapDispatchToProps = (dispatch) => ({
    selectCountry: (payload) => dispatch(selectCountry(payload)),
    backCountry: () => dispatch(backCountry())
});

const mapStateToProps = (state) => {
    return {
        data: state.population.data,
        mode: state.population.mode,
        country: state.population.country
    };
};

export default withFauxDOM(connect(mapStateToProps, mapDispatchToProps)(Population));
