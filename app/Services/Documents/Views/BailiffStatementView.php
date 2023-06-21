<?php
declare(strict_types=1);

namespace App\Services\Documents\Views;

use App\Models\EnforcementProceeding\EnforcementProceeding;
use App\Models\Subject\Bailiff\BailiffDepartment;
use App\Models\Subject\Creditor\Creditor;
use App\Services\Documents\Views\Base\BaseDocView;
use App\Services\Documents\Views\Base\Builders\DocFooterBuilder;
use App\Services\Documents\Views\Base\Builders\DocHeadBuilder;

abstract class BailiffStatementView extends BaseDocView
{
    protected BailiffDepartment $department;
    protected Creditor $creditor;
    protected EnforcementProceeding $enforcementProceeding;

    protected function buildHead(DocHeadBuilder $builder): void
    {
        $builder->addRow('В ' . $this->department->name);
        $builder->addAddress($this->department->address->getFull());
        $builder->addRow('Взыскатель:');
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