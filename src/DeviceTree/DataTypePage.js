import React, { Component, useEffect, useState } from 'react';
import { Button, Tooltip,Table,Modal } from 'antd'
import {
    PlusOutlined, DeleteOutlined, ReloadOutlined,
    CopyOutlined, RetweetOutlined, FolderOpenOutlined, FolderOutlined
} from '@ant-design/icons';
import NameDescModal from '../Common/NameDescModal'
import { useStoreActions, useStoreState } from 'easy-peasy';

const { confirm } = Modal;

//数据类型的编辑页面
function DataTypePage() {

    const addDataType = useStoreActions((actions) => actions.deviceTree.addDataType);
    const deleteDataType = useStoreActions((actions) => actions.deviceTree.deleteDataType);
    const dataTypeList = useStoreState((state) => state.deviceTree.dataTypeList);
    const getDataTypeList = useStoreActions((actions) => actions.deviceTree.getDataTypeList);

    const [modalState, setModalState] = useState({
        visible: false,
    })

    useEffect(()=>{
        if(dataTypeList)
        setModalState({...modalState})
        else 
        {
            getDataTypeList({})
        }
    },[dataTypeList])

    const addDataTypeClick=()=>{
        setModalState({ ...modalState, visible: true })
    }

    const onModalOk = () => {
        setModalState({ ...modalState, visible: false })
    }
    const onModalCancel = () => {
        setModalState({ ...modalState, visible: false })
    }
    const columns = [
        {
            title: '编号',
            dataIndex: 'id',
            width: 50,
            ellipsis: true,
        },
        {
            title: '名称',
            dataIndex: 'name',
            width: 100,
            ellipsis: true,
        },
        {
            title: '描述',
            dataIndex: 'desc',
            width: 100,
            ellipsis: true,
        },
        {
            title: "操作",
            dataIndex: 'id',
            editable: false,
            width: 50,
            render: (text, record) => {
                if(text!=0)
                return <DeleteOutlined onClick={()=>deleteDataTypeClick(record)} />
                else 
                return <div></div>
            }
        }
    ]

    const deleteDataTypeClick=(record)=>{
        confirm({
            content: "确认删除类型" + record.name + "吗?",
            okText:'确定',
            cancelText:'取消',
            onOk() {
                deleteDataType({Ids:[record.id]})
            },
            onCancel(){

            },
        });
    }
    return <div>
        <Tooltip title="添加数据类型" placement='bottom' color={'gray'}>
            <Button type='primary' icon={<PlusOutlined />} onClick={addDataTypeClick}></Button>
        </Tooltip>
        <div style={{margin:'5px'}}></div>
        <NameDescModal visible={modalState.visible} onOk={onModalOk} onCancel={onModalCancel}
            oper={addDataType}
        ></NameDescModal>
        <Table 
          columns={columns}
          dataSource={dataTypeList}
          pagination={{ pageSize: 100 }}
          size='small'
        >

        </Table>
    </div>
}

export default DataTypePage;