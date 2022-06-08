//const BaseUrl = 'http://main.server.hoe-data.com:21801/';
//const baseUrl = 'http://39.102.45.165:21801/';
//const baseUrl = 'http://49.232.3.75:21801/';
//const baseUrl = 'http://127.0.0.1:21801/';


// let hostIp = "127.0.0.1";
let hostIp = "127.0.0.1";
//let hostIp = "39.102.45.165";
//let hostIp = "39.105.20.78";
let hostPort = "21801";
//ip
 
function setHostIp(info) {
    hostIp = info;
}

function setHostPort(info) {
    hostPort = info;
}
function GetBaseUrl() {
    return "http://" + hostIp + ":" + hostPort+"/";
}

export {setHostIp,setHostPort,hostIp,hostPort,GetBaseUrl}