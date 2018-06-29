function tokenize() {
    now = new Date();
    time = (new Date()).getTime();
    return calcMD5(time+"timestamp") + "_" + time;
}

function checkToken(timestamp, token) {
    return (calcMD5(timestamp+"timestamp") == token);
}

function checkTimestamp(timestamp) {
    now = new Date();
    var time = "";
    time += now.getTime();
    return (timestamp >= time-120000);
}
