<?php
    $spab_server_path = '/home4/therevpr/spab_2021s1/spab-server';
    $node_path = '/home4/therevpr/.nvm/versions/node/v14.16.0/bin/node';

    chdir($spab_server_path);

    if ($_GET["type"] == 'killnode') {
        echo '====KILL NODE====<br>';
        echo nl2br(@shell_exec('killall -s SIGKILL node'));
        echo '<br>';
        sleep(2);
        echo nl2br(@shell_exec('ps'));
        echo '<br>';

        if (file_exists('./spab_run.pid')) {
            unlink('./spab_run.pid');
        }
    }

    if ($_GET["type"] == 'restart' || $_GET["type"] == 'stop') {
        if (file_exists('./spab_run.pid')) {
            echo '====STOPPING====<br>';
            echo nl2br(@shell_exec('kill ' . @file_get_contents('./spab_run.pid')));
            echo '<br>';
            sleep(2);
        }
        echo nl2br(@shell_exec('ps'));
        echo '<br>';
        echo '====STOPPED====<br>';
    }

    if ($_GET["type"] == 'start' || $_GET["type"] == 'restart') {
        if (!file_exists('./spab_run.pid')) {
            echo '====STARTING====<br>';
            echo nl2br(@shell_exec($node_path.' ./dist/index.js 2>/dev/null >/dev/null &'));
            echo '<br>';
            sleep(2);
        }
        echo nl2br(@shell_exec('ps'));
        echo '<br>';
        echo '====STARTED====<br>';
    }
?>