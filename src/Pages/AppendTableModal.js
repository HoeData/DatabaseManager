import React, { Component, useState } from 'react';
import { Modal, Input, Alert } from 'antd'
import { useStoreActions, useStoreState } from 'easy-peasy';
import {IsChar,IsNumber} from '../Common/StringDeal'

//添加表面板
function AppendTableModal(props) {

    const { visible, setVisible } = props;
    const appendTable = useStoreActions((actions) => actions.database.appendTable);
    const tableList = useStoreState((state) => state.database.tableList);

    const [state, setState] = useState({
        tableName: "",
        tableDesc: "",
        alertVisible: false,
        alertMessage: false,
    });

    const tableNameChange = (e) => {
        setState({ ...state, tableName: e.target.value })
    }
    const tableDescChange = (e) => {
        setState({ ...state, tableDesc: e.target.value })
    }
    const alertClose = () => {
        setState({ ...state, alertMessage:"",   alertVisible: false })
    }
    const onCancel = () => {
        setState({ ...state, tableDesc: "", tableName: "", alertVisible: false })
        setVisible(false);
    }

    const checkTableName=()=>{
        console.log(state)
        let tagName=state.tableName;
        if (!tagName) {
            state.alertVisible = true;
            state.alertMessage = "请填写表名！"
            setState({ ...state })
            return;
        }

        if (!IsChar(tagName[0])) {
            state.alertVisible = true;
            state.alertMessage = "表名的首字符必须是字母！"
            setState({ ...state })
            return false;
        }

        //表名必须由字符，数字和下划线组成
        for (let i = 0; i < tagName.length; i++) {
            console.log(tagName[i])
            if (IsChar(tagName[i]))
                continue;
            if (IsNumber(tagName[i]))
                continue;
            if (tagName[i] == '_')
                continue;
            state.alertVisible = true;
            state.alertMessage = "表名必须由字符，数字和下划线组成！"
            setState({ ...state })
            return false;
        }
        return true;
    }


    const onOk = () => {
        if (!state.tableName) {
            setState({ ...state, tableDesc: "", tableName: "", alertVisible: true, alertMessage: "表名不能为空!" });
            return;
        }
        if(state.tableName.length>63)
        {
            setState({ ...state,   alertVisible: true, alertMessage: "表名不能超过63个字符!" });
            return;
        }  
        if(state.tableDesc.length>255)
        {
            setState({ ...state,   alertVisible: true, alertMessage: "表描述不能超过255个字符!" });
            return;
        }
   
        let find=false;
        tableList.forEach(element => {
            if(element.title.toLowerCase()==state.tableName.toLowerCase())
            {
                find=true;
            }
        });
        if(find)
        {
            setState({ ...state,   alertVisible: true, alertMessage: "已有此表!" });
            return;
        }
         
        let r=checkTableName();
        if(!r)
        return;
        appendTable({ tableName: state.tableName, tableDesc: state.tableDesc })
        setState({ ...state, tableDesc: "", tableName: "", alertVisible: false })
        setVisible(false);
    }
    return <Modal
        title="添加表"
        visible={visible}
        onCancel={onCancel}
        okText="确定"
        cancelText="取消"
        mask={true} maskClosable={false}
        onOk={onOk}
    >
        <span style={{ margin: '10px' }}>表名:</span>
        <Input placeholder="请输入表名" style={{ width: "400px" }} onChange={tableNameChange}
            value={state.tableName}>
        </Input>
        <div style={{ margin: '10px' }}></div>
        <span style={{ margin: '10px' }}>描述:</span>
        <Input placeholder="请输入描述" style={{ width: "400px" }} onChange={tableDescChange}
            value={state.tableDesc}
        ></Input>
         <div style={{ margin: '10px' }}></div>
        <span style={{ margin: '10px' }}>注：表名小于等于63个字符，由字母、数字和下划线组成，且首字符是字母。</span>
        {state.alertVisible ? (
            <Alert message={state.alertMessage} type="warning" closable onClose={alertClose} />
        ) : null}
    </Modal>
}

export default AppendTableModal;