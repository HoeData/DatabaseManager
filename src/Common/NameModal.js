import React, { Component, useEffect, useState, useRef } from 'react';
import { Modal, Input, Alert } from 'antd'

//名称修改面板
//namename 发送请求的name字段名
function NameModal(props) {

    const { visible, mode, oldName, onOk, onCancel, addOper, editOper } = props;

    const [state, setState] = useState({
        name: "",
        title: "",
        alertVisible: false,
        alertMessage: false,
        namePlaceholder: "",
    });

    const nameChange = (e) => {
        setState({ ...state, name: e.target.value })
    }

    const alertClose = () => {
        setState({ ...state, alertMessage: "",name:"", alertVisible: false })
    }

    const onOkClick = () => {
        onOk();
        if (mode == 'edit')
            editOper(state.name);
        else
            addOper(state.name)
        setState({ ...state, name: "" })
    }


    useEffect(() => {
        if (mode == 'edit') {
            state.placeholder = oldName;
            state.name = oldName
            state.title = "修改"
        }
        else {
            state.title = "添加"
            state.name="";
            state.namePlaceholder = "请输入名称";
        }
        setState({ ...state })
    }, [mode, visible])

    return <Modal
        title={state.title}
        visible={visible}
        okText="确定"
        cancelText="取消"
        onCancel={onCancel}
        mask={true} maskClosable={false}
        onOk={onOkClick}
    >
        <span style={{ margin: '10px' }}>名称:</span>
        <Input placeholder={state.namePlaceholder} style={{ width: "400px" }} onChange={nameChange}
            value={state.name}>
        </Input>
        <div style={{ margin: '10px' }}></div>

        {state.alertVisible ? (
            <Alert message={state.alertMessage} type="warning" closable onClose={alertClose} />
        ) : null}
    </Modal>
}

export default NameModal;