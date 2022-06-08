import React, { Component, useEffect, useState, useRef } from 'react';
import { Modal, Input, Alert } from 'antd'

//名称描述修改面板
function NameDescModal(props) {

    const { visible, mode, oldName, onOk, onCancel,oper } = props;

    const [state, setState] = useState({
        name: "",
        desc: "",
        title: "",
        alertVisible: false,
        alertMessage: false,
        namePlaceholder: "",
        descPlaceholder: "",
    });

    const nameChange = (e) => {
        setState({ ...state, name: e.target.value })
    }
    const descChange = (e) => {
        setState({ ...state, desc: e.target.value })
    }
    const alertClose = () => {
        setState({ ...state, alertMessage: "", alertVisible: false })
    }

    const onOkClick=()=>{
        onOk();
        setState({...state,name:"",desc:""})
        oper({Name:state.name,Desc:state.desc})
    }


    useEffect(() => {
        if (mode == 'edit') {
            state.placeholder = oldName;
            state.title = "修改"
        }
        else {
            state.title = "添加"
            state.namePlaceholder = "请输入名称";
            state.descPlaceholder = "请输入描述";
        }
        setState({ ...state })
    }, [mode, visible])

    return <Modal
        title={state.title}
        visible={visible}
        okText="确定"
        cancelText="取消"
        onCancel={onCancel}
        onOk={onOkClick}
        mask={true} maskClosable={false}
    >
        <span style={{ margin: '10px' }}>名称:</span>
        <Input placeholder={state.namePlaceholder} style={{ width: "400px" }} onChange={nameChange}
            value={state.name}>
        </Input>
        <div style={{ margin: '10px' }}></div>

        <span style={{ margin: '10px' }}>描述:</span>
        <Input placeholder={state.descPlaceholder} style={{ width: "400px" }} onChange={descChange}
            value={state.desc}>
        </Input>
        <div style={{ margin: '10px' }}></div>

        {state.alertVisible ? (
            <Alert message={state.alertMessage} type="warning" closable onClose={alertClose} />
        ) : null}
    </Modal>
}

export default NameDescModal;