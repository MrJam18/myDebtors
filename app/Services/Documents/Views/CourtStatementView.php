<?php
declare(strict_types=1);

namespace App\Services\Documents\Views;

use App\Models\Contract\Contract;
use App\Models\Subject\Court\Court;
use App\Models\Subject\Creditor\Creditor;
use App\Models\Subject\People\Debtor;
use App\Services\Documents\Views\Base\BaseDocView;
use App\Services\Documents\Views\Base\Builders\DocFooterBuilder;
use App\Services\Documents\Views\Base\Builders\DocHeadBuilder;

abstract class CourtStatementView extends BaseDocView
{
    protected Contract $contract;
    protected Creditor $creditor;
    protected Court $court;
    protected Debtor $debtor;

    protected function buildHead(DocHeadBuilder $builder): void
    {
        $builder->addRow('В ' . $this->court->name);
        $builder->addAddress($this->court->address->getFull());
        $builder->addRow('Заявитель');
        $builder->addRow($this->creditor->name);
        $builder->addAddress($this->creditor->address->getFull());
        $builder->addRow('Представитель:');
        $builder->addRow($this->agent->name->getFull());
        $builder->addAddress($this->agent->address->getFull());
    }

    protected function buildFooter(DocFooterBuilder $builder): void
    {
        $builder->addRow($this->agent->enclosure);
    }

}