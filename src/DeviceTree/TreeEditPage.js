
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
import NodeModal from './NodeModal';
import Search from 'antd/lib/input/Search';


import pinyinUtil from '../PinYin/pinyinUtil'
import UseInterval from '../Common/UseInterval'

const { DirectoryTree } = Tree;
const { confirm } = Modal;
const { Option } = Select;

function TreeEditPage() {

    const nodeList = useStoreState((state) => state.deviceTree.nodeList);
    const getNodeList = useStoreActions((actions) => actions.deviceTree.getNodeList);
    const deleteNode = useStoreActions((actions) => actions.deviceTree.deleteNode);
    const tagList = useStoreState((state) => state.deviceTree.tagList);

    const searchTag = useStoreActions((actions) => actions.deviceTree.searchTag);
    const deleteTag = useStoreActions((actions) => actions.deviceTree.deleteTag);
    const setTagList = useStoreActions((actions) => actions.deviceTree.setTagList);

    const successMessage = useStoreState((state) => state.deviceTree.successMessage);
    const setSuccessMessage = useStoreActions((actions) => actions.deviceTree.setSuccessMessage);

    const createNodeTable = useStoreActions((actions) => actions.deviceTree.createNodeTable)
    const startNodeCanculate = useStoreActions((actions) => actions.deviceTree.startNodeCanculate);
    const stopNodeCanculate = useStoreActions((actions) => actions.deviceTree.stopNodeCanculate);

    const canculateInfo = useStoreState((state) => state.deviceTree.canculateInfo);
    const getCanculateInfo = useStoreActions((actions) => actions.deviceTree.getCanculateInfo);
    const dataTypeList = useStoreState((state) => state.deviceTree.dataTypeList);
    const getDataTypeList = useStoreActions((actions) => actions.deviceTree.getDataTypeList);
    const changeDataType = useStoreActions((actions) => actions.deviceTree.changeDataType);

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
    })
    useEffect(() => {
        if (nodeList) {
            state.treeData = [];
            nodeList.forEach(element => {
                state.treeData.push(element)
            });
            setState({ ...state })
        }
        else {
            //getNodeList()
        }
        return ()=>{
            setTagList([])
        }
    }, [nodeList])
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
    useEffect(() => {
        if (!dataTypeList)
            getDataTypeList();
        setState({ ...state })
    }, [tagList, canculateInfo, dataTypeList])

    UseInterval(() => {
        getCanculateInfo();
    }, [3000])

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
       // getNodeList();
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
                deleteNode({ id: menuState.menuKey })
            },
            onCancel() {

            },
        });
    }
    //?????????????????????
    const nodeTreeNodeRightClick = (e) => {

        setMenuState({
            ...menuState,
            menuKey: e.node.key,
            menuTitle: e.node.title,
            menuMouseY: e.event.pageY,
            menuMouseX: e.event.pageX
        })
    }
    const dataTypeChange = (value,record) => {
         changeDataType({Id:record.id,DataTypeId:value});
         searchTag({ nodeId: state.nodeId })
    }
    const columns = [
        {
            title: '??????',
            dataIndex: 'id',
            width: 50,
            ellipsis: true,
        },
        {
            title: '??????',
            dataIndex: 'name',
            width: 100,
            ellipsis: true,
        },
        {
            title: '??????',
            dataIndex: 'desc',
            width: 100,
            ellipsis: true,
        },
        {
            title: '??????',
            dataIndex: 'dataTypeId',
            width: 100,
            ellipsis: true,
            render: (text, record) => {
                return <Select value={text} style={{ width: '100px' }}
                    onChange={(value) => dataTypeChange(value, record)}>
                    {
                        dataTypeList.map((element, index) => {
                            return <Option value={element.id} key={index}>{element.name}</Option>
                        })
                    }
                </Select>
            }
        },
        {
            title: "??????",
            dataIndex: 'id',
            editable: false,
            width: 50,
            render: (text, record) => {
                return <DeleteOutlined onClick={() => deleteTagClick(record)} />
            }
        }
    ]
    //????????????
    const deleteTagClick = (recored) => {
        confirm({
            content: "??????????????????????",
            okText:'??????',
            cancelText:'??????',
            onOk() {
                let idArray = [];
                idArray.push(recored.id);
                deleteTag({ Ids: idArray });
            },
            onCancel() {

            },
        });
    }
    const deleteTagsClick = (recored) => {
        confirm({
            content: "??????????????????????",
            okText:'??????',
            cancelText:'??????',
            onOk() {
                let idArray = [];
                tableState.selectedRows.forEach(element => {
                    idArray.push(element.id);
                });
                console.log(tableState.selectedRows)
                deleteTag({ Ids: idArray });
            },
            onCancel() {

            },
        });
    }

    const selectNodeClick = (e) => {
        if (!e)
            return;
        if (e.length < 1)
            return;
        state.nodeId = e[0];
        setState({ ...state })
        searchTag({ nodeId: state.nodeId })
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
            expandAll(state.treeData);
            setState({ ...state })
        }
    }
    const onExpand = expandedKeys => {
      //  console.log(expandedKeys)
       // state.expandedKeys = expandedKeys;
      //  setState({ ...state })
    };

    const freshNodeList = () => {
       // getNodeList();
    }

    return <div >
        <div style={{ margin: '5px' }}></div>
        <Row>
            <div style={{ width: '600px', height: '700px' }}>
                <Space>
                    <Tooltip title="???????????????" placement='bottom' color={'gray'}>
                        <Button type='primary' icon={<PlusOutlined />} onClick={addNode}></Button>
                    </Tooltip>
                    {/*<Tooltip title="????????????" placement='bottom' color={'gray'}>
                        <Button type='primary' icon={<FolderOpenOutlined />} onClick={expandAllClick}></Button>
                    </Tooltip>*/}
                    <Tooltip title="??????" placement='bottom' color={'gray'}>
                        <Button type='primary' icon={<ReloadOutlined />} onClick={freshNodeList}></Button>
                    </Tooltip>
                </Space>
                <div style={{ width: '600px', height: '650px', border: '1px solid gray', margin: '5px 0px',overflow:'auto' }}>
                    <DirectoryTree multiple style={{ width: '500px' }}
                       // defaultExpandAll={true}
                        treeData={state.treeData}
                        onRightClick={nodeTreeNodeRightClick}
                        onSelect={selectNodeClick}
                       // autoExpandParent
                       // onExpand={onExpand}
                       // expandedKeys={state.expandedKeys}
                    >
                    </DirectoryTree>
                </div>
            </div>
            <div style={{ width: '10px' }}></div>
            <div style={{ width: '600px', height: '700px' }}>
                <Tooltip title="????????????" placement='bottom' color={'gray'}>
                    <Button type='primary' icon={<DeleteOutlined />} onClick={deleteTagsClick}></Button>
                </Tooltip>
                <div style={{ width: '600px', height: '650px', border: '1px solid gray', margin: '5px 0px' }}>
                    <Table columns={columns}
                        dataSource={tagList}
                        pagination={{ pageSize: 100 }}
                        size='small'
                        scroll={{ x: 500, y: 550 }}
                        rowSelection={{
                            type: selectionType,
                            ...rowSelection,
                        }}>
                    </Table>
                </div>
            </div>
            <div>
                <div style={{ margin: '5px' }}><Button type='primary' onClick={() => { createNodeTable({}) }}>?????????????????????</Button></div>
                <div style={{ margin: '5px' }}> <Button type='primary' onClick={() => { startNodeCanculate({}) }}>????????????</Button></div>
                <div style={{ margin: '5px' }}> <Button type='primary' onClick={() => { stopNodeCanculate({}) }}>????????????</Button></div>
                <div style={{ margin: '5px' }}>{canculateInfo}</div>
            </div>
        </Row>
        <NodeModal visible={modalState.appendNodeModalVisable}
            setVisible={setAppendNodeModalVisible}
            parent={menuState.menuKey}
            mode={modalState.mode}
            oldName={menuState.menuTitle}
        ></NodeModal>
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

export default TreeEditPage;