const childProcess = require('child_process');


function runCmd(cmd, args) {
    try {
        childProcess.spawnSync(cmd, args);
    } catch (e) {
        console.log(e);
    }
}

function pull() {
    runCmd('git', ['fetch']);
    runCmd('git', ['pull']);
    console.log('test');
}

setInterval(()=> {
    pull();
}, 60000);
pull();