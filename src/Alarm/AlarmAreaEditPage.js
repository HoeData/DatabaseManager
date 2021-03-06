
import React, { Component, useEffect, useState } from 'react';

import { Button, Tree, Row, Col, Modal, Space, Table, Tooltip, Select } from 'antd';
import {
    PlusOutlined, DeleteOutlined, ReloadOutlined,
    CopyOutlined, RetweetOutlined, FolderOpenOutlined, FolderOutlined
} from '@ant-design/icons';
import { useStoreActions, useStoreState } from 'easy-peasy';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import copy from 'copy-to-clipboard';
 import AlarmAreaModal from './AlarmAreaModal'
import UseInterval from '../Common/UseInterval'

const { DirectoryTree } = Tree;
const { confirm } = Modal;
const { Option } = Select;

function AlarmAreaEditPage() {

    const alarmAreaList = useStoreState((state) => state.alarm.alarmAreaList);
    const getAlarmAreaList = useStoreActions((actions) => actions.alarm.getAlarmAreaList);
    const setAlarmAreaList = useStoreActions((actions) => actions.alarm.setAlarmAreaList);
    const deleteAlarmArea = useStoreActions((actions) => actions.alarm.deleteAlarmArea);
  

    const successMessage = useStoreState((state) => state.message.successMessage);
    const setSuccessMessage = useStoreActions((actions) => actions.message.setSuccessMessage);
 

    const [state, setState] = useState({
        treeData: [],
        nodeId: -1,
        expandedKeys: []
    })

    const [tableState, setTableState] = useState({
        selectedRowKeys: [],
        selectedRows: [],
    })

    const [modalState, setModalState] = useState({
        appendNodeModalVisable: false,
        mode: 'new'
    })
    const [menuState, setMenuState] = useState({
        menuMouseX: null,
        menuMouseY: null,
        menuTitle: null,
        menuKey: -1,
        menuParentId:-1
    })
    useEffect(() => {
    
        if (alarmAreaList) {       
            setState({ ...state })
        }
        else {
            getAlarmAreaList()
        }        
    }, [alarmAreaList])
    const [selectionType, setSelectionType] = useState('checkbox');
    const rowSelection = {
        selectedRowKeys: tableState.selectedRowKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            console.log(selectedRows)
            setTableState({ ...tableState, selectedRowKeys: selectedRowKeys, selectedRows: selectedRows })
        },
        getCheckboxProps: record => ({
            disabled: record.name === 'Disabled User', // Column configuration not to be checked
            name: record.name,
        }),
    };
    
 
    const hideMenu = () => {
        setMenuState({ ...menuState, menuMouseX: null, menuMouseY: null });
    }

    //????????????
    const handleMenuClose = () => {
        hideMenu();
    };
    //???????????????????????????
    const setAppendNodeModalVisible = (v, mode) => {
        setModalState({ ...modalState, appendNodeModalVisable: v, mode: mode })
    }
    //?????????
    const addNodeClick = () => {
        setAppendNodeModalVisible(true, 'new');
        setMenuState({ ...menuState, menuMouseX: null, menuMouseY: null });
    }
    //????????????
    const changeNodeClick = () => {
        setAppendNodeModalVisible(true, 'edit');
        setMenuState({ ...menuState, menuMouseX: null, menuMouseY: null });
    }
    const addNode = () => {
        setMenuState({ ...menuState, menuKey: -1 })
        setAppendNodeModalVisible(true, 'new');
    }
    //?????????????????????
    const freshNodeClick = () => {
        getAlarmAreaList({});
        hideMenu();
    }
    //????????????
    const copyNodeNameClick = () => {
        hideMenu();
        copy(menuState.menuTitle)
        setSuccessMessage("????????????????????????!")
    }

    //?????????
    const deleteNodeClick = () => {
        hideMenu();
        confirm({
            content: "??????????????????" + menuState.menuTitle + "????",
            okText:'??????',
            cancelText:'??????',
            onOk() {
                deleteAlarmArea({ id: menuState.menuKey+"" })
            },
            onCancel() {

            },
        });
    }
    //?????????????????????
    const nodeTreeNodeRightClick = (e) => {

        setMenuState({
            ...menuState,
            menuParentId:e.node.parent_id,
            menuKey: e.node.key,
            menuTitle: e.node.title,
            menuMouseY: e.event.pageY,
            menuMouseX: e.event.pageX
        })
    }
    

 

    const expandAll = (nodes) => {
        nodes.forEach(element => {
            if (element.children.length > 0)
                state.expandedKeys.push(element.key);
            expandAll(element.children)
        });
    }
    const expandAllClick = () => {
        if (!state.expandedKeys)
            return;
        if (state.expandedKeys.length > 0) {
            state.expandedKeys = []
            setState({ ...state })
        }
        else {
            state.expandedKeys = []
            expandAll(alarmAreaList);
            setState({ ...state })
        }
    }
    const onExpand = expandedKeys => {
        console.log(expandedKeys)
        state.expandedKeys = expandedKeys;
        setState({ ...state })
    };

    const freshAreaList = () => {
        getAlarmAreaList();
    }

    return <div >
        <div style={{ margin: '5px' }}></div>
        <Row>
            <div style={{ width: '600px', height: '700px' }}>
                <Space>
                    <Tooltip title="???????????????" placement='bottom' color={'gray'}>
                        <Button type='primary' icon={<PlusOutlined />} onClick={addNode}></Button>
                    </Tooltip>
                    <Tooltip title="????????????" placement='bottom' color={'gray'}>
                        <Button type='primary' icon={<FolderOpenOutlined />} onClick={expandAllClick}></Button>
                    </Tooltip>
                    <Tooltip title="??????" placement='bottom' color={'gray'}>
                        <Button type='primary' icon={<ReloadOutlined />} onClick={freshAreaList}></Button>
                    </Tooltip>
                </Space>
                <div style={{ width: '600px', height: '650px', border: '1px solid gray', margin: '5px 0px' }}>
                    <DirectoryTree multiple style={{ width: '500px' }}
                        defaultExpandAll={true}
                        treeData={alarmAreaList}
                        onRightClick={nodeTreeNodeRightClick}
                        autoExpandParent
                        onExpand={onExpand}
                        expandedKeys={state.expandedKeys}
                    >
                    </DirectoryTree>
                </div>
            </div>
            <div style={{ width: '10px' }}></div>
            
        </Row>
        <AlarmAreaModal visible={modalState.appendNodeModalVisable}
            setVisible={setAppendNodeModalVisible}
            id={menuState.menuKey}
            parentId={menuState.menuParentId}
            mode={modalState.mode}
            oldName={menuState.menuTitle}
        ></AlarmAreaModal>
        <Menu
            keepMounted
            open={menuState.menuMouseY !== null}
            onClose={handleMenuClose}
            anchorReference="anchorPosition"
            anchorPosition={
                menuState.menuMouseY !== null && menuState.menuMouseX !== null
                    ? { top: menuState.menuMouseY, left: menuState.menuMouseX }
                    : undefined
            }
        >
            <MenuItem onClick={addNodeClick} >
                <Space>
                    <PlusOutlined />
                    <span>????????????</span>
                </Space>
            </MenuItem>
            <MenuItem onClick={changeNodeClick} >
                <Space>
                    <RetweetOutlined />
                    <span>????????????</span>
                </Space>
            </MenuItem>
            <MenuItem onClick={deleteNodeClick} >
                <Space>
                    <DeleteOutlined />
                    <span>????????????</span>
                </Space>
            </MenuItem>
            <MenuItem onClick={freshNodeClick} >
                <Space>
                    <ReloadOutlined />
                    <span>????????????</span>
                </Space>
            </MenuItem>
            <MenuItem onClick={copyNodeNameClick} >
                <Space>
                    <CopyOutlined />
                    <span>????????????</span>
                </Space>
            </MenuItem>
        </Menu>
    </div>
}

export default AlarmAreaEditPage;