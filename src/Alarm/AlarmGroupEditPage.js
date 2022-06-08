import React, { Component, useEffect, useState } from 'react';
import { Button, Tooltip, Table, Modal } from 'antd'
import {
    PlusOutlined, DeleteOutlined, EditOutlined
} from '@ant-design/icons';
import NameModal from '../Common/NameModal'
import { useStoreActions, useStoreState } from 'easy-peasy';

const { confirm } = Modal;

//报警组编辑页面
function AlarmGroupEditPage() {

    const addAlarmGroup = useStoreActions((actions) => actions.alarm.addAlarmGroup);
    const deleteAlarmGroup = useStoreActions((actions) => actions.alarm.deleteAlarmGroup);
    const updateAlarmGroup = useStoreActions((actions) => actions.alarm.updateAlarmGroup);
    const alarmGroupList = useStoreState((state) => state.alarm.alarmGroupList);
    const getAlarmGroupList = useStoreActions((actions) => actions.alarm.getAlarmGroupList);

    const [modalState, setModalState] = useState({
        visible: false,
    })

    useEffect(() => {
        if (alarmGroupList)
            setModalState({ ...modalState })
        else {
            getAlarmGroupList({})
        }
    }, [alarmGroupList])

    const addClick = () => {
        setModalState({ ...modalState, visible: true,mode:'new', })
    }
    const editClick = (record) => {
        setModalState({ ...modalState, visible: true,mode:'edit',id:record.id,oldName:record.group_name })
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
            dataIndex: 'group_name',
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
            content: "确认删除类型" + record.group_name + "吗?",
            okText:'确定',
            cancelText:'取消',
            onOk() {
                deleteAlarmGroup({id:record.id+""})
            },
            onCancel() {

            },
        });
    }

    const addOper=(v)=>{
        addAlarmGroup({group_name:v});
    }

    const editOper=(v)=>{
        updateAlarmGroup({group_name:v,id:modalState.id});
    }


    return <div>
        <Tooltip title="添加报警组" placement='bottom' color={'gray'}>
            <Button type='primary' icon={<PlusOutlined />} onClick={addClick}></Button>
        </Tooltip>
        <div style={{ margin: '5px' }}></div>
        <NameModal visible={modalState.visible} onOk={onModalOk} onCancel={onModalCancel}
            addOper={addOper} editOper={editOper} mode={modalState.mode} oldName={modalState.oldName}
        ></NameModal>
        <Table
            columns={columns}
            dataSource={alarmGroupList}
            scroll={{x:1000,y:700}}
            pagination={{ pageSize: 100 }}
            size='small'
        >
        </Table>
    </div>
}

export default AlarmGroupEditPage;