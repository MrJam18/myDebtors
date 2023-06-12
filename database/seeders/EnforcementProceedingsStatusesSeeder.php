<?php

namespace Database\Seeders;

use App\Models\EnforcementProceeding\EnforcementProceedingStatus;

class EnforcementProceedingsStatusesSeeder extends BaseSeeder
{
    public function __construct(){
        $this->model = new EnforcementProceedingStatus();
    }

    public function run(): void
    {
        $this->setNameAndSave('возбуждено');
        $this->setNameAndSave('приостановлено');
        $this->setNameAndSave('окончено');
        $this->setNameAndSave('прекращено');

    }
}
