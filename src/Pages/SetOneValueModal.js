import React, { Component, useState } from 'react';

import { Modal, Select, Input, InputNumber, Row, Col, Space } from 'antd'
import { getQualityFromInt, Quality } from './Quality'
import { DataType } from './DataType';
import { useStoreActions, useStoreState } from 'easy-peasy';
import moment from 'moment'

const { Option } = Select

//置数面板
function SetOneValueModal(props) {

    const { visible, record, closeModal } = props;

    const putSnapshots = useStoreActions((actions) => actions.database.putSnapshots);

    const [state, setState] = useState({
        quality: 0,
        setValue: undefined
    })
    const valueChange = (value) => {
        setState({ ...state, setValue: value })
    }
    const svalueChange = (e) => {
        setState({ ...state, setValue: e.target.value })
    }
    const qualityChange = (value) => {
        setState({ ...state, quality: value })
    }
    //获取值输入控件
    const getValueControl = () => {
        if (!record)
            return <div></div>
        if (record.Type == 0) {
            return <Select style={{ width: inputWidth }} vlaue={state.setValue} onChange={valueChange}>
                <Option value={0}>false</Option>
                <Option value={1}>true</Option>
            </Select>
        }
        else if (record.Type == 13) {
            return <Input style={{ width: inputWidth }} value={state.setValue} onChange={svalueChange}></Input>
        }
        else {

            return <InputNumber style={{ width: inputWidth }} value={state.setValue}
                onChange={valueChange}>
            </InputNumber>
        }
    }

    const reset = () => {
        setState({
            quality: 0,
            setValue: undefined
        })
    }

    const onModalCancelClick = () => {
        reset();
        closeModal()
    }
    const onModalOkClick = () => {
        closeModal()
        reset();
        putSnapshots({
            datas: [{
                Type: record.Type,
                TagFullName: record.FullName,
                Value: state.setValue,
                Time: moment().format('yyyy-MM-DD HH:mm:ss.SSS'),
                Qualitie: state.quality,
            }]
        })
    }
    const getQualityTypes = () => {
        return Quality.map((element, index) => {
            return <Option value={element.value} key={element.value}>{element.title}</Option>
        });
    }
    const spanMargin = '10px'
    const divMargin = '10px'
    const inputWidth = '350px'
    return <Modal title='置数' onOk={onModalOkClick}
    okText="确定"
    cancelText="取消"
        mask={true} maskClosable={false}
        onCancel={onModalCancelClick} visible={visible} >
        <Row style={{ margin: '5px' }}>
            <Col style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
                span={4}>标签:</Col>
            <Col span={20}><Input style={{ width: inputWidth }} value={record ? record.FullName : ""} disabled></Input></Col>
        </Row>
        <Row style={{ margin: '5px' }}>
            <Col style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}
                span={4}>描述:</Col>
            <Col span={20}><Input style={{ width: inputWidth }} value={record ? record.TagDesc : ""} disabled></Input></Col>
        </Row>
        <Row style={{ margin: '5px' }}>
            <Col span={4} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>当前值:</Col>
            <Col span={20}> <Input style={{ width: inputWidth }} value={record ? record.Value : ""} disabled></Input></Col>
        </Row>
        <Row style={{ margin: '5px' }}>
            <Col span={4} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>设定值:</Col>
            <Col span={20}>{getValueControl()}</Col>
        </Row>
        <Row style={{ margin: '5px' }}>
            <Col span={4} style={{ display: 'flex', justifyContent: 'left', alignItems: 'center' }}>质量码:</Col>
            <Col span={20}> <Select style={{ width: inputWidth }} value={state.quality} onChange={qualityChange}>
                {getQualityTypes()}
            </Select></Col>
        </Row>
    </Modal>
}

export default SetOneValueModal;