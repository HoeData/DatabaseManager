import React, { Component, useEffect, useState } from 'react';
import { Modal, Tree } from 'antd'
import { useStoreActions, useStoreState } from 'easy-peasy';

//选择标签转入的节点时弹出
const { DirectoryTree } = Tree
function TreeNodeModal(props) {

    const { visible, setVisible, selectedRows } = props;

    const nodeList = useStoreState((state) => state.deviceTree.nodeList);
    const getNodeList = useStoreActions((actions) => actions.deviceTree.getNodeList);
    const addTag = useStoreActions((actions) => actions.deviceTree.addTag);

    const [state, setState] = useState({
        nodeId: undefined
    })
    const treeSelect = (e) => {
        if (!e)
            return;
        if (e.length < 1)
            return;
        state.nodeId = e[0];
        setState({ ...state })
    }
    const onOkClick = () => {
        let names = [];
        if (selectedRows)
            selectedRows.forEach(element => {
                names.push(element.FullName)
            });
        addTag({ Names: names, NodeId: state.nodeId })
        setVisible(false)
    }
    const onCancelClick = () => {
        setVisible(false)
    }
    useEffect(() => {
        if (nodeList) {
            setState({ ...state })
        }
        else {
           // getNodeList();
        }
    }, [nodeList])
    return <Modal visible={visible} onOk={onOkClick}
    okText="确定"
    cancelText="取消"
        mask={true} maskClosable={false}  
        onCancel={onCancelClick}>
            <div style={{overflow:'auto',height:'500px'}}>
        <DirectoryTree multiple style={{ width: '500px' }}
            defaultExpandAll
            treeData={nodeList}
            onSelect={treeSelect}
        >
        </DirectoryTree>  
        </div>
    </Modal> 
}

export default TreeNodeModal;
