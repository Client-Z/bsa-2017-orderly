import React, {Component} from 'react';
import {Button, Icon} from 'semantic-ui-react';
import {fieldIcons} from "../../configuration/fieldTypes";
import './gridContent.scss';
import TextLine from './fields/textLine/textLine';
import LongText from './fields/longText/longText';
import CurrencyField from './fields/currency/currency';
import Number from './fields/number/number';
import AutoNumber from './fields/autoNumber/autoNumber';
import Url from './fields/url/url';
import DateField from './fields/date/date';
import SingleSelect from './fields/singleSelect/singleSelect';
import Email from './fields/email/email';
import Percent from './fields/percent/percent';
import Phone from './fields/phone/phone';
import Attachment from './fields/attachment/attachment';
import MultipleSelect from './fields/multiple/multiple';
import Checkbox from './fields/checkbox/checkbox';
import FieldMenu from './fieldMenu/fieldMenu';
import RecordDialog from '../recordDialog/recordDialog';

const RowNum = ({tableId, recordId, index, deleteRecord}) => {
    return (
        <div className="rows__row" onContextMenu={(e) => deleteRecord(e, tableId, recordId)}>
            <span>{index + 1}</span>
        </div>
    )
};

const Field = ({id, tableId, type, name, index, records, recordData, showFieldMenu,
                   changeFieldType, changeFieldName, changeFieldOptions, deleteField, currentField, searchMatchedRecordItemIdList,
                   searchFoundIndex, uploadAttachment, deleteFile}) => {
    return (
        <div className="field__items">
            <div className="content__field">
                <Icon name={fieldIcons[type]} className="field__icon"/>
                <span>{name}</span>
                <FieldMenu
                    onClick={showFieldMenu}
                    id={id}
                    tableId={tableId}
                    name={name}
                    type={type}
                    changeFieldType={changeFieldType}
                    changeFieldName={changeFieldName}
                    changeFieldOptions={changeFieldOptions}
                    deleteField={deleteField}
                    index={index}
                    currentField={currentField}
                />
            </div>
            <div className="field__items">
                {records &&
                records.map((record, idx) => {
                    return <RecordItem key={record.record_data[index]._id}
                                   id={record.record_data[index]._id}
                                   uploadAttachment={uploadAttachment}
                                   recordIdx={idx}
                                   currentRecord={record.record_data[index]}
                                   type={type}
                                   data={record.record_data[index].data}
                                   recordData={recordData}
                                   currentField={currentField}
                                   searchMatchedRecordItemIdList={searchMatchedRecordItemIdList}
                                   searchFoundIndex={searchFoundIndex}
                                   deleteFile={deleteFile}
                                   tableId={tableId}
                                   />
                })}
            </div>
        </div>
    );
};

const RecordItem = ({id, type, data, recordData, recordIdx, currentField, searchMatchedRecordItemIdList, searchFoundIndex, uploadAttachment, tableId,
	                    deleteFile, currentRecord}) => {
    const fieldPayload = {
        id: id,
        value: data,
        currentRecord: currentRecord,
        tableId: tableId,
        currentField: currentField,
	    uploadAttachment: uploadAttachment,
	    deleteFile: deleteFile,
        selected: recordData.isRecordSelected(id),
        active: recordData.isRecordActive(id),
        onSelect: recordData.selectRecordHandler,
        onActivate: recordData.activateRecordHandler,
        onKeyPress: recordData.keyPressSimpleRecordHandler,
        onBlurField: recordData.blurRecordHandler,
        onBlurComponent: recordData.blurRecordComponentHandler,
        onChangeCheckbox: recordData.changeCheckboxHandler,
        autoFocus: true
    };
    let record = null;
    switch (type) {
        case 'longtext':
            const fieldPayloadLongtext = {...fieldPayload, ...{onKeyPress: recordData.keyPressRecordHandler} };
            record = <LongText {...fieldPayloadLongtext}/>;
            break;
        case 'number':
            record = <Number {...fieldPayload}/>;
            break;
        case 'select':
            record = <SingleSelect {...fieldPayload}/>;
            break;
        case 'currency':
            record = <CurrencyField {...fieldPayload}/>;
            break;
        case 'autonumber':
            record = <AutoNumber {...fieldPayload} recordIdx={recordIdx}/>;
            break;
        case 'url':
            record = <Url {...fieldPayload}/>;
            break;
        case 'date':
            record = <DateField {...fieldPayload}/>;
            break;
        case 'email':
            record = <Email {...fieldPayload}/>;
            break;
        case 'phone':
            record = <Phone {...fieldPayload}/>;
            break;
        case 'percent':
            record = <Percent {...fieldPayload}/>;
            break;
	    case 'attachment':
		    record = <Attachment {...fieldPayload}/>;
		    break;
        case 'multiple':
            record = <MultipleSelect {...fieldPayload}/>;
            break;
        case 'checkbox':
            const fieldPayloadCheckbox = {...fieldPayload, ...{onActivate: () => {}} };
            record = <Checkbox {...fieldPayloadCheckbox}/>;
            break;
	    default:
            record = <TextLine {...fieldPayload}/>;
    }


    let recordClassName = '';
    if (searchMatchedRecordItemIdList && searchMatchedRecordItemIdList.indexOf(id) === searchFoundIndex) {
        recordClassName = 'field__item found foundCursor';
    } else {
        if (searchMatchedRecordItemIdList && searchMatchedRecordItemIdList.indexOf(id) !== -1) {
            recordClassName = 'field__item found';
        } else {
            recordClassName = 'field__item';
        }
    }

    return (
        <div className={recordClassName}>
            {record}
        </div>
    );
};


export default class GridContent extends Component {
    constructor(props) {
        super(props);
        this.props = props;
    }

    handleAddField = () => {
        this.props.addField(this.props.currentTable._id);
    };

    handleAddRecord = () => {
        this.props.addRecord(this.props.currentTable._id);
    };

    handleDeleteRecord = (event, tableId, recordId) => {
        event.preventDefault();
        this.props.deleteRecord(tableId, recordId);
    };

    render() {
        const records = this.props.filteredRecords || this.props.currentTable.records;
        return (
            <div className="wrapper__grid">
                <div className="grid__content">
                    <div className="content__wrapper">
                        <div className="content__rows row-options-field">
                            <div className="rows__selector rows__row">
                                <Icon name="lock"/>
                            </div>
                            {records.map((record, recordIndex) => {
                                return <RowNum key={record._id}
                                               tableId={this.props.currentTable._id}
                                               recordId={record._id}
                                               index={recordIndex}
                                               deleteRecord={this.handleDeleteRecord}/>
                            })}
                        </div>

                        <div className="content__body">
                            <div className="field__items row-options-field">
                                <div className="content__field row-options-field"/>
                                <div className="field__item row-options-field">
                                    {records.map((record, recordIndex) => {
                                        return (
                                            <div className="row-control-container" key={record._id} >
                                                <Button
                                                    className="record-dialog-btn"
                                                    onClick={(event) => this.props.onOpenRecordDialog(recordIndex)}>
                                                    <Icon name='expand'/>
                                                </Button>
                                            </div>
                                        )
                                    })}
                                    {(this.props.recordDialogIndex === 0 || this.props.recordDialogIndex > 0) &&
                                    <RecordDialog
                                        record={this.props.currentTable.records[this.props.recordDialogIndex]}
                                        fields={this.props.currentTable.fields}
                                        recordData={this.props.recordData}
                                        recordIndex={this.props.recordDialogIndex}
                                        onOpenRecordDialog={this.props.onOpenRecordDialog}
                                        onKeyPressComment={this.props.onKeyPressComment}
                                        user={this.props.user}
                                        tableId={this.props.currentTable._id}
                                        uploadAttachment={this.props.uploadAttachment}
                                        deleteFile={this.props.deleteFile}
                                        recordIdx={this.props.recordDialogIndex}
                                    />
                                    }
                                </div>
                            </div>
                        </div>

                        <div className="content__body">
                            {this.props.currentTable.fields.map((field, fieldIndex) => {
                                return <Field
                                    key={field._id}
                                    currentField = {field}
                                    id={field._id}
                                    name={field.name}
                                    type={field.type}
                                    index={fieldIndex}
                                    records={records}
                                    recordData={this.props.recordData}
                                    showFieldMenu={this.props.showFieldMenu}
                                    changeFieldType={this.props.changeFieldType}
                                    changeFieldOptions={this.props.changeFieldOptions}
                                    changeFieldName={this.props.changeFieldName}
                                    deleteField={this.props.deleteField}
                                    deleteRecord={this.props.deleteRecord}
                                    tableId={this.props.currentTable._id}
                                    uploadAttachment={this.props.uploadAttachment}
                                    deleteFile={this.props.deleteFile}
                                    searchMatchedRecordItemIdList={this.props.searchMatchedRecordItemIdList}
                                    searchFoundIndex={this.props.searchFoundIndex}
                                />
                            })}
                        </div>

                        <div className="content__field item__add-field" onClick={this.handleAddField}>
                            <Icon name="plus" className="field__icon"/>
                        </div>
                    </div>
                    <div className="content__field item__add-record" onClick={this.handleAddRecord}>
                        <Icon name="plus" className="field__icon"/>
                    </div>
                </div>
            </div>
        );
    }
}

