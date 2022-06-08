import React, { Component, useEffect, useState,useRef } from 'react';
import { Modal, Input, Alert } from 'antd'
import { useStoreActions, useStoreState } from 'easy-peasy';
import { IsChar, IsNumber } from '../Common/StringDeal'
import userEvent from '@testing-library/user-event';

//添加节点弹出面板
function NodeModal(props) {

    const { visible, setVisible, parent,mode,oldName } = props;
    const addNode = useStoreActions((actions) => actions.deviceTree.addNode);
    const updateNode = useStoreActions((actions) => actions.deviceTree.updateNode);

    const [state, setState] = useState({
        name: "",
        title: "",
        alertVisible: false,
        alertMessage: false,
        placeholder:""
    });

    const nameChange = (e) => {
        setState({ ...state, name: e.target.value })
    }

    const alertClose = () => {
        setState({ ...state, alertMessage: "", alertVisible: false })
    }
    const onCancel = () => {
        setState({ ...state, name: "", alertVisible: false })
        setVisible(false);
    }


    const onOk = () => {
        if (!state.name) {
            setState({ ...state, name: "", alertVisible: true, alertMessage: "节点名不能为空" });
            return;
        }
        if(mode=='edit')
        updateNode({ name: state.name, id: parent })
        else 
        addNode({ name: state.name, parent: parent })

        setState({ ...state, name: "", alertVisible: false })
        setVisible(false);
    }

    useEffect(() => {
        if (mode == 'edit') {
            state.placeholder=oldName;
            state.title = "修改名称"
        }
        else {
            state.title = "添加节点"
            state.placeholder="请输入名称";
        }
        setState({...state})
    },[mode,visible])

    return <Modal
        title={state.title}
        visible={visible}
        okText="确定"
        cancelText="取消"
        onCancel={onCancel}
        mask={true} maskClosable={false}
        onOk={onOk}
    >
        <span style={{ margin: '10px' }}>名称:</span>
        <Input placeholder={state.placeholder} style={{ width: "400px" }} onChange={nameChange}
            value={state.name}>
        </Input>
        <div style={{ margin: '10px' }}></div>
        {state.alertVisible ? (
            <Alert message={state.alertMessage} type="warning" closable onClose={alertClose} />
        ) : null}
    </Modal>
}

export default NodeModal;