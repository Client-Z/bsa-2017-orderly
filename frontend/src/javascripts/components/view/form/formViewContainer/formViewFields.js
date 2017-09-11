import React, {Component} from 'react';
import {Button} from 'semantic-ui-react';
import {Icon} from 'semantic-ui-react';
import { Recordtem } from '../../recordDialog/recordDialog'

export default class FormViewFields extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        console.log(this.props)
        return (
            <div className='form-inputs-list-wrapper'>
                <div className='form-inputs-list'>
                    {this.props.fields.map((field, ind) => {
                        if(this.props.included.includes(field._id)) {
                            return (
                                <div key={ind} className='form-inputs-list-item'>
                                    <div className='form-inputs-name'>
                                        <span>{field.name}</span>
                                        <Icon name="delete" className="form-inputs-delete"
                                              onClick={() => this.props.excludeField(field._id)}/>
                                    </div>
                                    <Recordtem
                                        id={this.props.record.record_data[ind]._id}
                                        data={this.props.record.record_data[ind].data}
                                        type={this.props.fields[ind].type}
                                        currentField={this.props.fields[ind]}
                                        records={this.props.records}
                                        recordData={this.props.recordData}
                                        tableId={this.props.tableId}
                                        uploadAttachment={this.props.uploadAttachment}
                                        deleteFile={this.props.deleteFile}
                                    />
                                </div>
                            );
                        }
                    })}
                </div>
                <div className='submit-btn'>
                    <Button type='submit'>Sumbit form</Button>
                </div>
            </div>
        );
    }
}

/*
<div className='form-inputs-list-item'>
    <div className='form-inputs-name'>Long-text</div>
    <input className='input-form' type='text'/>
</div>
<div className='form-inputs-list-item'>
    <div className='form-inputs-name'>Number</div>
<input className='input-form' type='text'/>
</div>
<div className='form-inputs-list-item'>
    <div className='form-inputs-name'>Url</div>
    <input className='input-form' type='text'/>
</div>
<div className='form-inputs-list-item'>
    <div className='form-inputs-name'>Date</div>
<input className='input-form' type='text'/>
</div>
*/