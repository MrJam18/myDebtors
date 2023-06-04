<?php

use App\Helpers\RoutersHandler;
use App\Services\Documents\TestDocument;
use Illuminate\Support\Facades\Route;
$router = new RoutersHandler();

$router->addFolder('private', 'auth');
$router->add('users');
Route::get('test', [TestDocument::class, 'test']);
