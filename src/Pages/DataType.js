var DataType =
    [
        { title: 'Bool', 'value': 0 },
        { title: 'UInt8', value: 1 },
        { title: 'Int8', value: 2 },
      
        { title: 'UInt16', value: 4 },
        { title: 'Int16', value: 5 },
        { title: 'UInt32', value: 6 },
        { title: 'Int32', value: 7 },
        { title: 'Int64', value: 8 },
        { title: 'Real16', value: 9 },
        { title: 'Real32', value: 10 },
        { title: 'Real64', value: 11 },      
        { title: 'String', value: 13 },    
    ]
//从数字获得类型名
const getDataTypeFromInt = (value) => {
    let title = "";
    DataType.map((elem) => {
        if (elem.value == value)
            title = elem.title;
    })
    return title;
}
//从类型名获得数字
const getDataTypeFromString = (value) => {
    let title = 0;
    DataType.map((elem) => {
        if (elem.title == value)
            title = elem.value;
    })
    return title;
}
export  {DataType,getDataTypeFromInt,getDataTypeFromString};