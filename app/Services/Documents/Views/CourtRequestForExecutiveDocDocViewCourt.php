<?php
declare(strict_types=1);

namespace App\Services\Documents\Views;

use App\Enums\Database\ContractTypeEnum;
use App\Models\Contract\Contract;
use App\Models\CourtClaim\CourtClaim;
use App\Models\Subject\Creditor\Creditor;
use App\Models\Subject\People\Debtor;
use App\Services\Documents\Views\Base\Builders\DocBodyBuilder;

class CourtRequestForExecutiveDocDocViewCourt extends CourtStatementView
{
    protected Contract $contract;
    protected CourtClaim $claim;
    protected Creditor $creditor;
    protected Debtor $debtor;

    public function __construct(CourtClaim $claim)
    {
        $this->contract = $claim->contract;
        $this->creditor = $this->contract->creditor;
        $this->debtor = $this->contract->debtor;
        $this->claim = $claim;
        $this->court = $claim->court;
        parent::__construct($claim->agent, defaultFontSize: 12);
    }

    protected function buildBody(DocBodyBuilder $builder): void
    {
        if($this->contract->type->id === ContractTypeEnum::Loan->value) {
            $resolutionName = "судебный приказ";
            $executiveDocName = $resolutionName;
        }
        else {
            $resolutionName = 'решение суда';
            $executiveDocName = 'исполнительный лист';
        }
        $builder->addHeader('Заявление');
        $builder->addIndentRow("В ваш суд было подано {$this->claim->type->name} о взыскании задолженности по {$this->contract->type->dativeIncline()} № {$this->contract->number} от {$this->contract->issued_date->format(RUS_DATE_FORMAT)} г.");
        $text = "В настоящий момент $resolutionName вступил";
        if($this->contract->type->id === ContractTypeEnum::Credit->value) $text .= 'о';
        $text .= " в законную силу.";
        $builder->addIndentRow($text);
        $builder->addIndentRow("На основании изложенного, руководствуясь статьями 35, 428 ГПК РФ,");
        $builder->addNoSpaceHeader('Прошу:');
        $builder->addRow("1. Выдать взыскателю $executiveDocName о взыскании задолженности по {$this->contract->type->dativeIncline()} № {$this->contract->number} от {$this->contract->issued_date->format(RUS_DATE_FORMAT)} г.");
        $builder->addRow("2. Направить $executiveDocName по адресу взыскателя: {$this->creditor->address->getFull()}");
    }
}