<?php
declare(strict_types=1);

namespace App\Http\Controllers\Contract;

use App\Enums\Database\ActionObjectEnum;
use App\Enums\Database\ActionTypeEnum;
use App\Exceptions\ShowableException;
use App\Http\Controllers\AbstractControllers\AbstractContractController;
use App\Http\Requests\PaginateRequest;
use App\Models\Contract\Contract;
use App\Models\Contract\Payment;
use App\Models\MoneySum;
use App\Services\Counters\CreditCountService;
use App\Services\Counters\LimitedLoanCountService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class PaymentsController extends AbstractContractController
{
    public function __construct(Request $request)
    {
        parent::__construct($request, ActionObjectEnum::Payment);
    }

    function getList(Contract $contract, PaginateRequest $request): array
    {
        $data = $request->validated();
        $query = $contract->payments()->orderByData($data->orderBy)
            ->joinRelation('moneySum')
            ->with('moneySum');
        if($data->search) {
            if(containRusDate($data->search)) $query->searchByRusDate(['payments.date'], $data->search);
            else {
                $query->searchOne([
                    'money_sums.main',
                    'money_sums.percents',
                    'money_sums.penalties',
                    'money_sums.sum'
                ], $data->search);
            }
        }
        $paginator = $query->paginate($data->perPage, 'payments.*', page: $data->page);
        $list = $paginator->items()->map(function (Payment $payment) {
            return [
                'money_sums.sum' => $payment->moneySum->sum,
                'money_sums.main' => $payment->moneySum->main,
                'money_sums.percents' => $payment->moneySum->percents,
                'money_sums.penalties' => $payment->moneySum->penalties,
                'date' => $payment->date->format(RUS_DATE_FORMAT),
                'idd' => $payment->id
            ];
        });
        return $paginator->jsonResponse($list);
    }
    function addOne(Contract $contract, Request $request): void
    {
        $data = $request->all();
        $payment = new Payment();
        $payment->moneySum = new MoneySum();
        $payment->moneySum->sum = (float)$data['sum'];
        $payment->date = new Carbon($data['date']);
        $payment->contract()->associate($contract);
        $payments = $this->addPaymentInCollection($contract->payments, $payment);
        $this->countPaymentsAndSave($contract, $payments, $payment);
        $this->actionsService->createAction(ActionTypeEnum::Create,'Создан платеж от ' . $payment->date->format(RUS_DATE_FORMAT) . ' г. на сумму ' . $payment->moneySum->sum);
    }
    function changeOne(Contract $contract, string $paymentId, Request $request): void
    {
        $formData = $request->input('formData');
        $allPayments = $contract->payments()->orderBy('date')->get();
        $paymentIndex = null;
        /**
         * @var Payment $payment;
         */
        $payment = $allPayments->first(function (Payment $payment, int $index) use($paymentId, &$paymentIndex) {
            if((int)$paymentId === $payment->id) {
                $paymentIndex = $index;
                return true;
            }
            return false;
        });
        if(!$payment) throw new ShowableException('Платеж не найден');
        $paymentSnapShot = $payment->replicate();
        $paymentSumSnapShot = $payment->moneySum->sum;
        if($payment->date->format(ISO_DATE_FORMAT) !== $formData['date']) {
            $allPayments->slice($paymentIndex, 1);
            $this->addPaymentInCollection($allPayments, $payment);
            $payment->date = $formData['date'];
        }
        $payment->moneySum->sum = $formData['sum'];
        $this->countPaymentsAndSave($contract, $allPayments, $payment);
        $this->actionsService->createAction(ActionTypeEnum::Change, 'Изменен платеж от ' . $paymentSnapShot->date->format(RUS_DATE_FORMAT) . ' на сумму ' . $paymentSumSnapShot . " руб. на дату " . $payment->date->format(RUS_DATE_FORMAT) . " и сумму " . $payment->moneySum->sum . ' руб.');
    }

    function deleteOne(Contract $contract, Payment $payment): void
    {
        if($payment->contract->id !== $contract->id) throw new ShowableException('Id контракта не соответствует id платежа');
        $payment->delete();
        $this->countPaymentsAndSave($contract, $contract->payments);
        $this->actionsService->createAction(ActionTypeEnum::Delete, 'Удален платеж от ' . $payment->date->format(RUS_DATE_FORMAT) . ' г. на сумму ' . $payment->moneySum->sum . ' рублей');
    }

    private function countPaymentsAndSave(Contract $contract, Collection $payments, ?Payment $payment = null): void
    {
        if($contract->type->id === 1) $countService = new LimitedLoanCountService();
        else $countService = new CreditCountService();
        $countService->count($contract, now(), $payments);
        $countService->savePayments();
        if($payment) {
            $payment->moneySum()->associate($payment->moneySum);
            unset($payment->moneySum);
            $payment->save();
        }
    }
    private function addPaymentInCollection(Collection $collection, Payment $payment): Collection
    {
        $first = $collection->first();
        if(!$first) {
            $collection->push($payment);
        }
        else {
            if ($collection->first()->date >= $payment->date) {
                $collection->prepend($payment);
            } elseif ($collection->last()->date <= $payment->date) {
                $collection->push($payment);
            } else {
                $collection->push($payment);
                $collection->sort(function (Payment $first, Payment $second): int {
                    if ($first->date < $second->date) return -1;
                    if ($first->date === $second->date) return 0;
                    return +1;
                });
            }
        }
        return $collection;
    }


}