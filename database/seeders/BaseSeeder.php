<?php
declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Base\BaseModel;
use Illuminate\Database\Seeder;

abstract class BaseSeeder extends Seeder
{
    protected BaseModel $model;

    function setNameAndSave(string $name): void
    {
        $this->model->name = $name;
        $this->model->save();
        $this->model = new (get_class($this->model));
    }
}