<?php
declare(strict_types=1);

namespace App\Helpers;

use Illuminate\Routing\RouteRegistrar;
use Illuminate\Support\Facades\Route;

class RoutersHandler
{
    public function __construct(private ?string $folderPath = null)
    {
    }
    function add(string $name, ?string $middleware = null): RouteRegistrar
    {
        $route = Route::prefix($name)->name($name . '/');
        if ($middleware) $route->middleware($middleware);
        $relativePath = $this->folderPath ? $this->folderPath . DIRECTORY_SEPARATOR . $name : $name;
        $route->group(\getRouterPath($relativePath));
        return $route;
    }

    function addFolder(string $folderName, ?string $middleware = null): RouteRegistrar
    {
        $route = Route::name($folderName . '/');
        if ($middleware) $route->middleware($middleware);
        $folderPath = \base_path() . DIRECTORY_SEPARATOR . 'routes' . DIRECTORY_SEPARATOR . 'routers' . DIRECTORY_SEPARATOR;
        if($this->folderPath) $folderPath .= $this->folderPath . DIRECTORY_SEPARATOR;
        $folderPath .= $folderName . DIRECTORY_SEPARATOR . '*.php';
        $files = glob($folderPath);
        if ($files) foreach ($files as $file)
        {
            $prefix = basename($file, '.php');
            $route->prefix($prefix)->group($file);
        }
        return $route;
    }
}
