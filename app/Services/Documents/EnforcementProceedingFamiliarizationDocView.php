<?php
declare(strict_types=1);

namespace App\Services\Documents;

use App\Models\Contract\Contract;
use App\Models\EnforcementProceeding\EnforcementProceeding;
use App\Models\Subject\People\Agent;
use App\Services\Documents\Views\BailiffStatementView;
use App\Services\Documents\Views\Base\Builders\DocBodyBuilder;

class EnforcementProceedingFamiliarizationDocView extends BailiffStatementView
{
    protected Contract $contract;

    public function __construct(EnforcementProceeding $enforcementProceeding, Agent $agent)
    {
        $this->enforcementProceeding = $enforcementProceeding;
        $this->creditor = $enforcementProceeding->executiveDocument->contract->creditor;
        $this->contract = $this->enforcementProceeding->executiveDocument->contract;
        $this->department = $this->enforcementProceeding->executiveDocument->bailiffDepartment;
        parent::__construct($agent, defaultFontSize: 12);
    }

    protected function buildBody(DocBodyBuilder $builder): void
    {
        $enfProceedText = "№ {$this->enforcementProceeding->number} от {$this->enforcementProceeding->begin_date->format(RUS_DATE_FORMAT)} г. о взыскании задолженности по {$this->contract->type->dativeIncline()} с {$this->contract->debtor->name->getFullGenitive()} в пользу {$this->creditor->getGenitiveName()}";
        $builder->addHeader('Заявление');
        $builder->addIndentRow("В вашем отделе судебных приставов на исполнении находилось исполнительное производство $enfProceedText.");
        $builder->addIndentRow('Взыскателю требуется ознакомиться с материалами данного исполнительного производства.');
        $builder->addAskHeader('На основании изложенного, руководствуясь статьей 50 Федерального закона от 02.10.2007 N 229-ФЗ "Об исполнительном производстве"');
        $builder->addRow("1. Ознакомить представителя взыскателя с материалами исполнительного производства $enfProceedText.");
        $builder->addRow("2. О готовности ознакомления уведомить по телефону {$this->agent->phone}.");
    }
}