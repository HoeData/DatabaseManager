import React, { Component, useEffect, useState } from 'react';
import { Button, Tooltip, Table, Modal } from 'antd'
import {
    PlusOutlined, DeleteOutlined, EditOutlined
} from '@ant-design/icons';
import NameModal from '../Common/NameModal'
import { useStoreActions, useStoreState } from 'easy-peasy';
import { PhotoshopPicker } from 'react-color'

import { EditableRow, EditableCell } from '../Common/EditableTable'

const { confirm } = Modal;
//报警级别编辑页面
function AlarmLevelEditPage() {

    const addAlarmLevel = useStoreActions((actions) => actions.alarm.addAlarmLevel);
    const deleteAlarmLevel = useStoreActions((actions) => actions.alarm.deleteAlarmLevel);
    const updateAlarmLevel = useStoreActions((actions) => actions.alarm.updateAlarmLevel);
    const alarmLevelList = useStoreState((state) => state.alarm.alarmLevelList);
    const getAlarmLevelList = useStoreActions((actions) => actions.alarm.getAlarmLevelList);
    const onlyRead = useStoreState((state) => state.database.onlyRead);

    const [modalState, setModalState] = useState({
        visible: false,
    })

    const [state, setState] = useState({
        colorPickerShow: false,
        mouseX: 0,
        mouseY: 0,
        row:undefined,
        colorType:undefined,
        color:undefined,
        colorObject:undefined
    })

    useEffect(() => {
        if (alarmLevelList)
            setModalState({ ...modalState })
        else {
            getAlarmLevelList({})
        }
    }, [alarmLevelList])

    const addClick = () => {
        setModalState({ ...modalState, visible: true })
    }
    const editClick = (record) => {
        setModalState({ ...modalState, visible: true, mode: 'edit', id: record.id, oldName: record.level_name })
    }
    const onModalOk = () => {
        setModalState({ ...modalState, visible: false })
    }
    const onModalCancel = () => {
        setModalState({ ...modalState, visible: false })
    }

    const getIntColor = (value) => {
        let str = value.toString(16);
        while (str.length < 6)
            str = '0' + str;
        return "#" + str;
    }


    const colorPanelWidth=515;
    const colorPanelHeight=300;
    const colorClick = (e,value,row,type) => {
        state.color=value;
        state.colorType=type;
        if(e.clientX+colorPanelWidth>document.body.clientWidth)
        {
           state.mouseX=(e.clientX-colorPanelWidth-20)+"px";
        }
        else 
        state.mouseX = (e.clientX+20)+"px";
        if(e.clientY+colorPanelHeight>document.body.clientHeight)
        {
           state.mouseY=(e.clientY-colorPanelHeight-20)+"px";
        }
        else 
        state.mouseY = (e.clientY+20)+"px";
        setState({ ...state, colorPickerShow: true,row:row})
    }

    const columns = [
        {
            title: '编号',
            dataIndex: 'level',
            width: 50,
            ellipsis: true,
        },
        {
            title: '名称',
            dataIndex: 'level_name',
            width: 100,
            ellipsis: true,
            editable: onlyRead ? false : true,
        },
        {
            title: '报警声音',
            dataIndex: 'wave_file',
            width: 100,
            ellipsis: true,
            editable: onlyRead ? false : true,
        },
        {
            title: '报警时长',
            dataIndex: 'duration',
            width: 100,
            ellipsis: true,
            editable: onlyRead ? false : true,
        },
        {
            title: '报警颜色',
            dataIndex: 'alarm_color',
            width: 100,
            ellipsis: true,
            render: (value,row) => {
                return <div style={{
                    width: '20px', height: '20px', backgroundColor: getIntColor(value),
                    borderRadius: '10px', marginLeft: '20px'
                }} onClick={(e)=>colorClick(e,getIntColor(value),row,'alarm')} ></div>
            }
        },
        {
            title: '确认颜色',
            dataIndex: 'ensure_color',
            width: 100,
            ellipsis: true,
            render: (value,row) => {
                return <div style={{
                    width: '20px', height: '20px', backgroundColor: getIntColor(value),
                    borderRadius: '10px', marginLeft: '20px',
                }} onClick={(e)=>colorClick(e,getIntColor(value),row,'ensure')} ></div>
            }
        },
        {
            title: '复归颜色',
            dataIndex: 'reset_color',
            width: 100,
            ellipsis: true,
            render: (value,row) => {
                return <div style={{
                    width: '20px', height: '20px', backgroundColor: getIntColor(value),
                    borderRadius: '10px', marginLeft: '20px'
                }} onClick={(e)=>colorClick(e,getIntColor(value),row,'reset')} ></div>
            }
        },
        {
            title: "操作",
            dataIndex: 'id',
            editable: false,
            width: 50,
            render: (text, record) => {
                if (text != 0)
                    return <div>
                        <DeleteOutlined style={{ marginLeft: '10px' }} onClick={() => deleteClick(record)} />
                    </div>
                else
                    return <div></div>
            }
        }
    ]

    const deleteClick = (record) => {
        confirm({
            content: "确认删除类型" + record.level_name + "吗?",
            okText:'确定',
            cancelText:'取消',
            onOk() {
                deleteAlarmLevel({ level: record.level + "" })
            },
            onCancel() {

            },
        });
    }

    const addOper = (v) => {
        addAlarmLevel({ level_name: v,alarm_color:16714250,ensure_color:16252701,reset_color:442112,normal_color:0,
            popup:0,wave_count:0, wave_file:"",duration:10});
    }

    const editOper = (v) => {
        updateAlarmLevel({ group_name: v, id: modalState.id });
    }

    const colorChange=(v)=>{
        state.colorObject=v;
        setState({...state,color:v.hex})
    } 
    const colorChangeComplete=(v)=>{
 
        setState({...state,color:v.hex})
    }
    const colorChangeAccept=(e)=>{
        if(!state.colorObject)
        return;
        let newRow={...state.row};    
        console.log(state.colorType)  
        if(state.colorType=='alarm')
        {
            newRow.id=newRow.level;
            newRow.alarm_color=state.colorObject.rgb.r*256*256+state.colorObject.rgb.g*256+state.colorObject.rgb.b;
        }
        else if(state.colorType=='ensure')
        {
            newRow.id=newRow.level;
            newRow.ensure_color=state.colorObject.rgb.r*256*256+state.colorObject.rgb.g*256+state.colorObject.rgb.b;
        }  
        else if(state.colorType=='reset')
        {
            newRow.id=newRow.level;
            newRow.reset_color=state.colorObject.rgb.r*256*256+state.colorObject.rgb.g*256+state.colorObject.rgb.b;
        }
        updateAlarmLevel(newRow)
        setState({...state,colorPickerShow:false})
    } 
    const colorChangeCancel=(v)=>{
        
        setState({...state,colorPickerShow:false})
    } 
    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };

    //更新报警级别
    const handleSave=(row)=>{
       
        let newRow = { ...row };
        newRow.id=newRow.level;
        newRow.duration=parseInt(newRow.duration);
        updateAlarmLevel(newRow)
    }


    const actcolumns = columns.map((col) => {
        if (!col.editable) {
            return col;
        }

        return {
            ...col,
            onCell: (record) => ({
                record,
                editable: col.editable,
                dataIndex: col.dataIndex,
                title: col.title,
                handleSave: handleSave,
            }),
        };
    });

    return <div  >
      
        <Tooltip title="添加报警组" placement='bottom' color={'gray'}>
            <Button type='primary' icon={<PlusOutlined />} onClick={addClick}></Button>
        </Tooltip>
        <div style={{ margin: '5px' }}></div>
        <NameModal visible={modalState.visible} onOk={onModalOk} onCancel={onModalCancel}
            addOper={addOper} editOper={editOper} mode={modalState.mode} oldName={modalState.oldName}
        ></NameModal>
        <Table 
            components={components}
            columns={actcolumns}
            dataSource={alarmLevelList}
            scroll={{ x: 1000, y: 700 }}
            pagination={{ pageSize: 100 }}
            size='small'
            onRow={record => {
                return {
                    onClick: event => { }, // 点击行
                    onDoubleClick: event => {

                    },
                    onContextMenu: event => { },
                    onMouseEnter: event => { }, // 鼠标移入行
                    onMouseLeave: event => { },
                };
            }}
        >
        </Table>  
        {state.colorPickerShow?<div style={{ position: 'absolute', left:state.mouseX, top:state.mouseY }}>
            <PhotoshopPicker color={state.color} 
            onAccept={colorChangeAccept}
            onCancel={colorChangeCancel}
            onChange={colorChange } 
            onChangeComplete={colorChangeComplete}></PhotoshopPicker></div>:null}
    </div>
}

export default AlarmLevelEditPage;