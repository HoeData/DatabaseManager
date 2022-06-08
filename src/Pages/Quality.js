var Quality=
[
    {title:'Good','value':0},
    {title:'NoData',value:1},
    {title:'Created',value:2},
    {title:'ShutDown',value:3},
    {title:'CalcOff',value:4},
    {title:'Bad',value:5},
    {title:'DivByZero',value:6},
    {title:'Removed',value:7},
    {title:'Opc',value:256},
    {title:'User',value:512},
    {title:'Control',value:1024},
]

const getQualityFromInt=(value)=>{
    let title = "";
    Quality.map((elem) => {
        if (elem.value == value)
            title = elem.title;
    })
    return title;
}

export {Quality,getQualityFromInt} ;