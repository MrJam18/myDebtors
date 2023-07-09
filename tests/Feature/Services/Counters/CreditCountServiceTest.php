<?php

namespace Tests\Feature\Services\Counters;

use App\Models\Contract\Contract;
use App\Models\Contract\ContractType;
use App\Services\Counters\CreditCountService;
use Carbon\Carbon;
use PHPUnit\Framework\TestCase;

class CreditCountServiceTest extends TestCase
{
    protected Contract $contract;
//    protected ContractType $contractType;

    protected function setUp(): void
    {
        parent::setUp();
        // TODO: Change the autogenerated stub

        //        $this->contractType =  new ContractType;
//        $this->contractType->id = 1;
//        $this->contractType->name = "договору займа";

        $this->contract = new Contract();
        $this->contract->issued_date = new Carbon('2020-02-02');
        $this->contract->due_date = new Carbon('2022-02-02');
        $this->contract->percent = 10;
        $this->contract->penalty = 50;
        $this->contract->issued_sum = 100000;
        $this->contract->number = 666;
        $this->contract->month_due_date = 2;
        $this->contract->type()->associate(ContractType::find(1));
//        if($payments) $this->payments = new Collection($payments);

    }

    public function test_count_credit_count_service(): void
    {
        $counterService = new CreditCountService();
        dd($counterService->count($this->contract, new Carbon('2022-01-01')));
    }
}