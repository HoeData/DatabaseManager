import React, { Component, useCallback, useEffect, useRef, useState } from 'react';
import ResizeTable from '../Common/ResizeTable';
import { EditableRow, EditableCell } from '../Common/EditableTable'
import moment from 'moment'

export default function TestPage1() {

    const datas = [
        {
            id: 0,
            TagName: 'xxxx'
        },
        {
            id: 1,
            TagName: 'ssss'
        },
        {
            id: 2,
            TagName: '3333'
        }
    ]
    const columns = [
        {
            title: 'id',
            dataIndex: 'id',
            width: 50,
            ellipsis: true,
            editable:true 
        },
        {
            title: '标签',
            dataIndex: 'TagName',
            width:200,
            ellipsis: true,
            editable:true 
        }
    ]

    const components = {
        body: {
            row: EditableRow,
            cell: EditableCell,
        },
    };
    const handleSave = (row) => {
        
    };

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
    return <ResizeTable   components={components}  columns={actcolumns}  dataSource={datas}>

    </ResizeTable>
}