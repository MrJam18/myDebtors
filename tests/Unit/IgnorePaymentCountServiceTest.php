<?php
declare(strict_types=1);

namespace Tests\Unit;

use App\Models\Contract\Payment;
use App\Models\MoneySum;
use App\Services\Counters\IgnorePaymentsLoanCountService;
use Carbon\Carbon;

class IgnorePaymentCountServiceTest extends CounterTest
{

    public function __construct(string $name)
    {
        parent::__construct($name);
        $this->service = new IgnorePaymentsLoanCountService();
    }

    function test_limited_percents()
    {
        $contract = $this->createTestContract(new Carbon('2016-12-31'), 10000, 300);
        $result = $this->countByService($contract, new Carbon('2021-12-31'));
        $this->assertEquals(150000, $result->percents);
        $this->assertEquals(30000, $this->service->getLimited()->getPercents());
    }
    function test_limited_penalties_without_limited()
    {
        $contract = $this->createTestContract(new Carbon('2016-12-31'), 10000, 300, 100, new Carbon('2020-12-31'));
        $result = $this->countByService($contract, new Carbon('2021-12-31'));
        $this->assertEquals(150000, $result->percents);
        $this->assertEquals(30000, $this->service->getLimited()->getPercents());
        $this->assertEquals(10000, $result->penalties);
    }
    function test_limited_penalties()
    {
        $contract = $this->createTestContract(new Carbon('2019-01-27'), 10000, 300, 20, new Carbon('2020-01-01'));
        $result = $this->countByService($contract, new Carbon('2023-12-31'));
        $this->assertEquals(25000, $this->service->getLimited()->getPercents() + $result->penalties);
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
        $contract = $this->createTestContract(new Carbon('2019-01-27'), 50000, 300, 30, new Carbon('2019-01-27'), [$payment1, $payment2]);
        $result = $this->countByService($contract, new Carbon('2023-01-01'));
        $this->assertEquals(125000, $this->service->getLimited()->getPercents() + $result->penalties);
    }

}