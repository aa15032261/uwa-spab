const childProcess = require('child_process');


function runCmd(cmd) {
    try {
        childProcess.spawnSync(cmd);
    } catch (e) {
        console.log(e);
    }
}

setInterval(()=> {
    runCmd('git fetch');
    runCmd('git pull');
}, 60000);