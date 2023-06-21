<?php
declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Subject\Bailiff\BailiffPosition;

class BailiffPositionsSeeder extends BaseSeeder
{
    public function __construct()
    {
        $this->model = new BailiffPosition();
    }

    function run(): void
    {
        $this->setNameAndSave('Судебный пристав-исполнитель');
        $this->setNameAndSave('Ведущий судебный пристав-исполнитель');
        $this->setNameAndSave('Заместитель начальника отделения - заместитель старшего судебного пристава');
        $this->setNameAndSave('Начальник отделения - старший судебный пристав');
        $this->setNameAndSave('Начальник отделения');
        $this->setNameAndSave('Начальник отдела - старший судебный пристав');
    }


}