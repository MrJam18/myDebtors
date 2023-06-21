<?php

namespace App\Services\Documents\Views\Claims;

trait CourtOrderTrait
{
    protected function setClaimValues(): void
    {
        $this->debtorTitle = 'Должник';
        $this->creditorTitle = 'Взыскатель';
        $this->askHeader->push('На основании изложенного, руководствуясь ст.121-123 ГПК РФ,', 'Прошу выдать судебный приказ, в котором:');
    }


}