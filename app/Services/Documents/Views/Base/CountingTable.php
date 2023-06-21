<?php
declare(strict_types=1);

namespace App\Services\Documents\Views\Base;

use App\Models\Contract\Contract;
use App\Models\MoneySum;
use App\Services\Documents\Views\Base\Builders\CountingTableBuilder;
use Illuminate\Support\Collection;
use PhpOffice\PhpWord\Element\Section;

abstract class CountingTable
{
    protected Section $section;
    protected Contract $contract;
    protected Collection $countBreaks;
    protected MoneySum $sums;
    protected CountingTableBuilder $builder;

    public function __construct(Section $section, Contract $contract, Collection $countBreaks)
    {
        $this->section = $section;
        $section->setStyle();
        $this->contract = $contract;
        $this->countBreaks = $countBreaks;
        $this->sums = new MoneySum();
        $this->sums->main = $this->contract->issued_sum;
    }

    abstract protected function buildTable(CountingTableBuilder $builder): void;

    public function build(): void
    {
        $this->buildTable($this->builder);
    }
}