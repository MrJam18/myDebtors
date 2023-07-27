<?php
declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Contract\ContractStatus;

class ContractStatusesSeeder extends BaseSeeder
{
    function run()
    {
        $this->model = new ContractStatus();
        $this->renameAndSave(10, 'В решении отказано');
        $this->setNameAndSave('Подана жалоба');
        $this->setNameAndSave('Жалоба отклонена');
        $this->setNameAndSave('Жалоба удовлетворена');
        $this->setNameAndSave('Исп. лист получен');
        $this->setNameAndSave('Исп. документ отправлен СПИ');
        $this->setNameAndSave('Исп. производство возбуждено');
        $this->setNameAndSave('Исп. производство окончено без исполнения');
        $this->setNameAndSave('Исп. производство окончено с исполнением');
    }
}