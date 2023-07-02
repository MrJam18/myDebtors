<?php
declare(strict_types=1);

use Illuminate\Database\Eloquent\Model;

function getFullName(Model $model): string {
    $full = $model->surname . ' ' . $model->name;
    if($model->patronymic) $full .= " $model->patronymic";
    return $full;
}
