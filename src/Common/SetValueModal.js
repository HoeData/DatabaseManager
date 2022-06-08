import React, { Component, useEffect, useState, useRef } from 'react';
import { Modal, InputNumber, Alert, Row, Col } from 'antd'

//置数面板
function SetValueModal(props) {

    const { visible, oper, oncancel } = props;

    const [state, setState] = useState({
        value: "",
        title: "置数",
        alertVisible: false,
        alertMessage: false,
        namePlaceholder: "",
        qulity:0
    });

    const valueChange = (value) => {
        setState({ ...state, value: value })
    } 
    const qulityChange = (value) => {
        setState({ ...state, qulity: value })
    }
    const valueStep = (value) => {
        setState({ ...state, value: value })
    }
    const alertClose = () => {
        setState({ ...state, alertMessage: "", name: "", alertVisible: false })
    }

    const onOkClick = () => {
        oper(state.value,state.qulity)
        setState({ ...state, value: "",qulity:0})
    }

    const onCancel = () => {
        oncancel()
    }

    useEffect(() => {

        state.placeholder = "输入数值";
        state.title = "置数"
        setState({ ...state })
    }, [visible])

    return <Modal
        title={state.title}
        visible={visible}
        okText='确定'
        cancelText='取消'
        onCancel={onCancel}
        mask={true} maskClosable={false}
        onOk={onOkClick}
    >
        <Row>
            <Col span={4}>
                <span style={{ margin: '10px',lineHeight:'30px' }}>值:</span></Col>
            <Col span={20}>
                <InputNumber style={{ width: "400px" }} min={-9999999} max={9999999} onChange={valueChange}
                    onStep={valueStep}
                    value={state.value}>
                </InputNumber>
            </Col>
        </Row>
 
        <Row style={{marginTop:'10px'}}>
            <Col span={4}>
                <span style={{ margin: '10px',lineHeight:'30px' }}>质量码:</span>
            </Col>
            <Col span={20}>
                <InputNumber style={{ width: "400px" }} min={-9999999} max={9999999} onChange={qulityChange}
                    
                    value={state.qulity}>
                </InputNumber>
            </Col>
        </Row>
        <div style={{ margin: '10px' }}>注：仅支持模拟量和数字量赋值，数字量输入0表示false,1表示true</div>

        {state.alertVisible ? (
            <Alert message={state.alertMessage} type="warning" closable onClose={alertClose} />
        ) : null}
    </Modal>
}

export default SetValueModal;