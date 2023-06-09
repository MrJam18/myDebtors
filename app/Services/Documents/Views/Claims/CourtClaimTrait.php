<?php

namespace App\Services\Documents\Views\Claims;

use App\Services\Documents\Views\Base\Builders\DocBodyBuilder;

trait CourtClaimTrait
{

    protected function setClaimValues(): void
    {
        $this->creditorTitle = 'Истец';
        $this->debtorTitle = 'Ответчик';
        $this->askHeader->push('На основании изложенного, руководствуясь ст.131-132 ГПК РФ,');
        $this->askHeader->push('Прошу:');
        $this->enclosures->push('Доказательства направления иска ответчику');
    }

    protected function buildRequirements(DocBodyBuilder $builder): void
    {
        parent::buildRequirements($builder);
        $debtorGenitive = $this->debtor->name->getFullGenitive();
        $nextCountDate = $this->claim->count_date->clone()->addDay()->format(RUS_DATE_FORMAT);
        $builder->addRow('3.  Взыскать с ' . $debtorGenitive . ' в пользу ' . $this->creditor->name . ' задолженность по договору займа № ' . $this->contract->number . ' от ' . $this->contract->issued_date->format(RUS_DATE_FORMAT) . ' г., в том числе:');
        $builder->addRow('3.1.  Проценты за пользование займом, начисленные на сумму основного долга по ставке ' . $this->contract->percent . " % годовых с $nextCountDate г. по день фактического исполнения обязательств.");
        $builder->addRow('3.2.  Неустойку за просрочку исполнения обязательств, начисленную на сумму основного долга по ставке ' . $this->contract->penalty . " % годовых с $nextCountDate г. по день фактического исполнения обязательств.");
        $builder->addRow('4.  Рассмотреть дело по настоящему иску в отсутствие истца.');
        $builder->addRow('5.  Направить исполнительный лист по настоящему делу в адрес истца.');
    }
}