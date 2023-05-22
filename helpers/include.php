<?php
declare(strict_types=1);
$files = glob(__DIR__ .  DIRECTORY_SEPARATOR . 'src' . DIRECTORY_SEPARATOR . '*.php');
if($files) {
    foreach ($files as $file) {
        require_once $file;
    }
}

unset($file);
unset($files);
