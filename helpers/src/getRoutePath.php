<?php
declare(strict_types=1);

function getRouterPath(string $path): string
{
    return \base_path("routes" . DIRECTORY_SEPARATOR . "routers" . DIRECTORY_SEPARATOR ."$path.php");
}
