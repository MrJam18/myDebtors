<?php
declare(strict_types=1);

namespace App\Services\Documents\Views;

use App\Models\EnforcementProceeding\EnforcementProceeding;
use App\Models\Subject\People\Agent;
use App\Services\Documents\Views\Base\Builders\DocBodyBuilder;

class BailiffExecutiveDocumentRequestDocView extends BailiffStatementView
{
    public function __construct(EnforcementProceeding $enforcementProceeding, Agent $agent)
    {
        $this->enforcementProceeding = $enforcementProceeding;
        $this->department = $enforcementProceeding->executiveDocument->bailiffDepartment;
        $this->creditor = $enforcementProceeding->executiveDocument->contract->creditor;
        parent::__construct($agent,  defaultFontSize: 12);
    }

    protected function buildBody(DocBodyBuilder $builder): void
    {
        $builder->addHeader('Заявление');
        $builder->addIndentRow("{$this->enforcementProceeding->end_date->format(RUS_DATE_FORMAT)} г. вашим отделом судебных приставов было окончено исполнительное производство № {$this->enforcementProceeding->number} на основании ст. 46 ч. 1 п. 3-4.");
        $builder->addIndentRow("Согласно данной статье, исполнительный документ после окончания исполнительного производства возвращается взыскателю. Кроме того, согласно ст. 47 ч.6 п. 1 копия постановления об окончании исполнительного производства и о возвращении взыскателю исполнительного документа должна быть отправлена взыскателю не позднее следующего дня после его вынесения.");
        $builder->addIndentRow("Однако, до настоящего времени, исполнительный документ, а также постановление об окончании исполнительного производства, в адрес взыскателя направлены не были.");
        $builder->addAskHeader('На основании изложенного, руководствуясь статьями 46, 47, 50 Федерального закона от 02.10.2007 N 229-ФЗ "Об исполнительном производстве",');
        $builder->addRow("1. Направить исполнительный документ № {$this->enforcementProceeding->executiveDocument->number} от {$this->enforcementProceeding->executiveDocument->issued_date->format(RUS_DATE_FORMAT)} г., а также постановление об окончании исполнительного производства № {$this->enforcementProceeding->number}, в адрес взыскателя.");
    }
}