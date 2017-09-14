import React from 'react';
import Select from 'react-select';
import './multiple.scss';
import Field from '../field';

class MultipleSelect  extends Field {
    constructor(props) {
        super(props, 'multiple');
        let options = [];
        let propsOptions=this.props.currentField.options.multiple;
        let i = 0;
        for (let option in propsOptions) {
        options.push({
                value: i++,
                label: propsOptions[option],
            })
        }

        let valuesArr, valuesArrIndex;
        if (this.props.value) {
            valuesArr = this.props.value.split(',');
            valuesArrIndex= [];
            for (let i = 0; i < valuesArr.length; i++) {
                for (let j = 0; j < propsOptions.length; j++) {
                    if (valuesArr[i] ===  propsOptions[j]) {
                        valuesArrIndex.push(j-1);
                    }
                }
            }
        }

        this.state = {
            options: options,
            valueSelected:valuesArrIndex || '',
            label:[]
        }
    }

    componentWillReceiveProps(nextProps) {
        let options = [];
        let propsOptions=this.props.currentField.options.multiple;
        let i = 0;
        for (let option in propsOptions) {
        options.push({
                value: i++, 
                label: propsOptions[option],
            })
        }
        this.setState({ 
            options: options
        });
    }

    renderActiveField() {
        return (
            <div className='multiple-select-container'>
                <Select options={this.state.options}
                    multi={true}
                    value={this.state.valueSelected}
                    onChange = {(event) => {
                        let labelArr=[];
                        for ( let i in event) {
                            labelArr[i]=event[i].label;
                        }
                        console.log(event)
                        this.setState({valueSelected: event, label: labelArr})}}
                    onBlur={(event) => this.props.onBlurComponent(this.props.id, this.state.label)}
                    autoFocus={true}
                />
            </div>

        )
    }
}

export default MultipleSelect;