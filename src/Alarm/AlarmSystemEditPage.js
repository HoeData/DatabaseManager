import React, { Component, useEffect, useState } from 'react';
import { Button, Tooltip, Table, Modal } from 'antd'
import {
    PlusOutlined, DeleteOutlined, EditOutlined
} from '@ant-design/icons';
import NameModal from '../Common/NameModal'
import { useStoreActions, useStoreState } from 'easy-peasy';

const { confirm } = Modal;

//报警系统编辑页面
function AlarmSystemEditPage() {

    const addAlarmSystem = useStoreActions((actions) => actions.alarm.addAlarmSystem);
    const deleteAlarmSystem = useStoreActions((actions) => actions.alarm.deleteAlarmSystem);
    const updateAlarmSystem = useStoreActions((actions) => actions.alarm.updateAlarmSystem);
    const alarmSystemList = useStoreState((state) => state.alarm.alarmSystemList);
    const getAlarmSystemList = useStoreActions((actions) => actions.alarm.getAlarmSystemList);

    const [modalState, setModalState] = useState({
        visible: false,
    })

    useEffect(() => {
        if (alarmSystemList)
            setModalState({ ...modalState })
        else {
            getAlarmSystemList({})
        }
    }, [alarmSystemList])

    const addClick = () => {
        setModalState({ ...modalState, visible: true,mode:'new', })
    }
    const editClick = (record) => {
        setModalState({ ...modalState, visible: true,mode:'edit',id:record.id,oldName:record.system_name })
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
            dataIndex: 'system_name',
            width: 100,
            ellipsis: true,
        },
        {
            title: "操作",
            dataIndex: 'id',
            editable: false,
            width: 50,
            render: (text, record) => {
                if (text != 0)
                    return <div>
                             <DeleteOutlined style={{marginRight:'20px'}} onClick={() => deleteClick(record)} />
                             <EditOutlined onClick={() => editClick(record)} />
                        </div>
                else
                    return <div></div>
            }
        }
    ]

    const deleteClick = (record) => {
        confirm({
            content: "确认删除类型" + record.system_name + "吗?",
            okText:'确定',
            cancelText:'取消',
            onOk() {
                deleteAlarmSystem({id:record.id+""})
            },
            onCancel() {

            },
        });
    }

    const addOper=(v)=>{
        addAlarmSystem({system_name:v});
    }

    const editOper=(v)=>{
        updateAlarmSystem({system_name:v,id:modalState.id});
    }


    return <div>
        <Tooltip title="添加报警系统" placement='bottom' color={'gray'}>
            <Button type='primary' icon={<PlusOutlined />} onClick={addClick}></Button>
        </Tooltip>
        <div style={{ margin: '5px' }}></div>
        <NameModal visible={modalState.visible} onOk={onModalOk} onCancel={onModalCancel}
            addOper={addOper} editOper={editOper} mode={modalState.mode} oldName={modalState.oldName}
        ></NameModal>
        <Table
            columns={columns}
            dataSource={alarmSystemList}
            scroll={{x:1000,y:700}}
            pagination={{ pageSize: 100 }}
            size='small'
        >
        </Table>
    </div>
}

export default AlarmSystemEditPage;