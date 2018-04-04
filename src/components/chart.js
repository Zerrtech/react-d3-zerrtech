import * as React from 'react';
import {withFauxDOM} from 'react-faux-dom';
import CommonProps from './commonProps';

class Chart extends React.Component {
    
    static defaultProps = {
        ...CommonProps
    }
    
    render() {
        const {
            height,
            width,
            margins,
            svgClassName,
            id,
            children
        } = this.props;
        
        var t = `translate(${margins.left}, ${margins.top})`;
        
        // var children = React.Children.map(this.props.children, (el) => {
        //     return React.cloneElement(el, {...this.props})
        // })
        
        return (
            <svg
            height = {height + margins.top + margins.bottom}
            width = {width + margins.left + margins.right}
            className = {svgClassName}
            id = {id}
            ref = "svgContainer"
            >
                <g
                transform = {t}
                >
                {children}
                </g>
            </svg>
        )
        
    }
}

export default withFauxDOM(Chart);
