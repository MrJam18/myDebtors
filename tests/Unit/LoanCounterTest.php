<?php
declare(strict_types=1);

namespace Tests\Unit;

use App\Models\Contract\Contract;
use App\Models\Contract\Payment;
use App\Models\MoneySum;
use App\Services\Counters\CountService;
use App\Services\Counters\LoanCountService;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Tests\TestCase;

class LoanCounterTest extends TestCase
{
    protected ?CountService $service;

    public function __construct(string $name)
    {
        parent::__construct($name);
        $this->service = new LoanCountService();
    }

    function test_percents_in_one_day()
    {
        $contract = $this->createTestContract(new Carbon('2020-01-01'), 100000, 100);
        $result = $this->countByService($contract, new Carbon('2020-01-02'));
        $this->assertEquals(273.22, $result->percents);
    }
    function test_percents_in_leap_year()
    {
        $contract = $this->createTestContract(new Carbon('2019-12-31'), 100000, 100);
        $result = $this->countByService($contract, new Carbon('2020-12-31'));
        $this->assertEquals(100000, $result->percents);
    }
    function test_percents_in_unleap_year()
    {
        $contract = $this->createTestContract(new Carbon('2020-12-31'), 100000, 100);
        $result = $this->countByService($contract, new Carbon('2021-12-31'));
        $this->assertEquals(100000, $result->percents);
    }
    function test_penalty_in_one_day()
    {
        $contract = $this->createTestContract(new Carbon('2020-01-01'), 100000, 100, 100, new Carbon('2020-01-01'));
        $result = $this->countByService($contract, new Carbon('2020-01-02'));
        $this->assertEquals(273.22, $result->penalties);
    }
    function test_penalties_in_leap_year()
    {
        $contract = $this->createTestContract(new Carbon('2018-12-31'), 100000, 100, 100, new Carbon('2019-12-31'));
        $result = $this->countByService($contract, new Carbon('2020-12-31'));
        $this->assertEquals(100000, $result->penalties);
    }
    function test_penalties_in_unleap_year()
    {
        $contract = $this->createTestContract(new Carbon('2018-12-31'), 100000, 100, 100, new Carbon('2020-12-31'));
        $result = $this->countByService($contract, new Carbon('2021-12-31'));
        $this->assertEquals(100000, $result->penalties);
    }
    function test_percents_with_payment()
    {
        $payment = new Payment();
        $payment->date = new Carbon('2021-12-31');
        $paymentSum = new MoneySum();
        $paymentSum->sum = 10000;
        $paymentSum->main = 1000;
        $paymentSum->penalties = 1000;
        $paymentSum->percents = 1000;
        $payment->money_sum = $paymentSum;
        $contract = $this->createTestContract(new Carbon('2020-12-31'), 100000, 100, 0, new Carbon('2020-12-31'), [$payment]);
        $result = $this->countByService($contract, new Carbon('2021-12-31'));
        $this->assertEquals(90000, $result->percents);
    }
    function test_all_with_payment()
    {
        $payment = new Payment();
        $payment->date = new Carbon('2021-12-31');
        $paymentSum = new MoneySum();
        $paymentSum->sum = 10000;
        $paymentSum->main = 1000;
        $paymentSum->penalties = 1000;
        $paymentSum->percents = 1000;
        $payment->money_sum = $paymentSum;
        $contract = $this->createTestContract(new Carbon('2020-12-31'), 100000, 100, 10, new Carbon('2020-12-31'), [$payment]);
        $result = $this->countByService($contract, new Carbon('2021-12-31'));
        $this->assertEquals(90000, $result->percents);
        $this->assertEquals(100000, $result->main);
        $this->assertEquals(10000, $result->penalties);
    }

    function test_limited_percents()
    {
        $contract = $this->createTestContract(new Carbon('2016-12-31'), 10000, 300);
        $result = $this->countByService($contract, new Carbon('2021-12-31'));
        $this->assertEquals(30000, $result->percents);
    }
    function test_limited_penalties_without_limited()
    {
        $contract = $this->createTestContract(new Carbon('2016-12-31'), 10000, 300, 100, new Carbon('2020-12-31'));
        $result = $this->countByService($contract, new Carbon('2021-12-31'));
        $this->assertEquals(30000, $result->percents);
        $this->assertEquals(10000, $result->penalties);
    }
    function test_limited_penalties()
    {
        $contract = $this->createTestContract(new Carbon('2019-01-27'), 10000, 300, 100, new Carbon('2020-01-01'));
        $result = $this->countByService($contract, new Carbon('2023-12-31'));
        $this->assertEquals(25000, $result->percents + $result->penalties);
    }
    function test_limited_with_payments()
    {
        $payment1 = new Payment();
        $payment1->date = new Carbon('2021-05-05');
        $payment1->money_sum = new MoneySum();
        $payment1->money_sum->sum = 5000;
        $payment2 = new Payment();
        $payment2->date = new Carbon('2021-10-05');
        $payment2->money_sum = new MoneySum();
        $payment2->money_sum->sum = 3000;
        $contract = $this->createTestContract(new Carbon('2019-01-27'), 50000, 300, 100, new Carbon('2019-01-27'), [$payment1, $payment2]);
        $result = $this->countByService($contract, new Carbon('2023-01-01'));
        $this->assertEquals(117000, $result->percents + $result->penalties);
    }



    protected function createTestContract(Carbon $issuedDate, float $issuedSum, float $percent = 0, float $penalty = 0, ?Carbon $dueDate = null, $payments = []): Contract
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
        return $contract;
    }

    protected function countByService(Contract $contract, Carbon $endDate): MoneySum
    {
        return $this->service->count($contract, $endDate);
    }

}