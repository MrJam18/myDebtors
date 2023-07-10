<?php

namespace Tests\Feature\Services\Counters;

use App\Models\Contract\Contract;
use App\Models\Contract\ContractType;
use App\Services\Counters\CreditCountService;
use Carbon\Carbon;
use Tests\TestCase;

class CreditCountServiceTest extends TestCase
{
    protected Contract $contract;

    protected function setUp(): void
    {
        parent::setUp();

        $this->contract = new Contract();
        $this->contract->issued_date = new Carbon('2020-02-02');
        $this->contract->due_date = new Carbon('2022-02-02');
        $this->contract->percent = 10;
        $this->contract->penalty = 50;
        $this->contract->issued_sum = 100000;
        $this->contract->number = 666;
        $this->contract->month_due_date = 10;
        $this->contract->type()->associate(ContractType::find(1));

    }

    public function test_counting_credit_count_service(): void
    {
        $counterService = new CreditCountService();
        $count = $counterService->count($this->contract, new Carbon('2022-01-01'));
        $this->assertEquals(true, is_object($count));
    }

    function test_calculate_day_credit_count_service(): void
    {
        $counterService = new CreditCountService();
        $count = $counterService->count($this->contract, new Carbon('2020-02-03'));
        $this->assertEquals(27.32, $count->percents) ;
    }

    function test_calculate_week_credit_count_service(): void
    {
        $counterService = new CreditCountService();
        $count = $counterService->count($this->contract, new Carbon('2020-02-08'));
        $this->assertEquals(163.93, $count->percents) ;
    }
    function test_calculate_month_credit_count_service(): void
    {
        $counterService = new CreditCountService();
        $count = $counterService->count($this->contract, new Carbon('2020-03-02'));
        $this->assertEquals(1229.51, $count->percents);
    }

    function test_calculate_year_credit_count_service(): void
    {
        $counterService = new CreditCountService();
        $count = $counterService->count($this->contract, new Carbon('2021-02-02'));
        $this->assertEquals(10440.83, $count->percents);
    }

    function test_calculate_full_credit_count_service(): void
    {
        $counterService = new CreditCountService();
        $count = $counterService->count($this->contract, new Carbon('2022-02-02'));
        $this->assertEquals(20002.47, $count->percents);
    }

    function test_calculate_total_sum_credit_count_service(): void
    {
        $counterService = new CreditCountService();
        $count = $counterService->count($this->contract, new Carbon('2022-02-02'));
        $this->assertEquals(120002.47, $count->sum);
    }
}
