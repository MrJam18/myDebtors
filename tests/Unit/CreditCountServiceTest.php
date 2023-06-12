<?php
declare(strict_types=1);

namespace Tests\Unit;

use App\Models\Contract\Contract;
use App\Models\Contract\ContractType;
use App\Services\Counters\CreditCountService;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class CreditCountServiceTest extends CounterTest
{
    public function __construct(string $name)
    {
        parent::__construct($name);
        $this->service = new CreditCountService();
    }


    function test_penalties_in_leap_year()
    {
        $contract = $this->createTestContract(new Carbon('2019-12-11'), 100000, 100, 100, new Carbon('2019-12-31'));
        $result = $this->countByService($contract, new Carbon('2020-06-30'));
        $this->assertEquals(49726.78, $result->penalties);
    }

    protected function createTestContract(
        Carbon $issuedDate,
        float $issuedSum = 100000,
        float $percent = 10,
        float $penalty = 10,
        ?Carbon $dueDate = null,
        $payments = [],
        int $monthDueDate = 10,
        float $monthDueSum = 1000
    ): Contract
    {
        if(!$dueDate) $dueDate = Carbon::now()->setTime(0, 0);
        $contract = new Contract();
        $contract->issued_date = $issuedDate;
        $contract->due_date = $dueDate;
        $contract->percent = $percent;
        $contract->penalty = $penalty;
        $contract->issued_sum = $issuedSum;
        $contract->number = 'test';
        $contract->payments = new Collection($payments);
        $contract->month_due_sum = $monthDueSum;
        $contract->month_due_date = $monthDueDate;
        $contract->type()->associate(ContractType::find(2));

        return $contract;
    }

}