<?php
declare(strict_types=1);

namespace App\Http\Controllers\Contract;

use App\Exceptions\ShowableException;
use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Http\Requests\PaginateRequest;
use App\Models\Base\CustomPaginator;
use App\Models\Contract\Contract;
use App\Models\Contract\Payment;
use App\Models\MoneySum;
use App\Services\Counters\CreditCountService;
use App\Services\Counters\LimitedLoanCountService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class PaymentsController extends AbstractController
{
    function getList(Contract $contract, PaginateRequest $request): array
    {
        $data = $request->validated();
        /**
         * @var CustomPaginator $paginator
         */
        $paginator = $contract->payments()->orderBy($data->orderBy->column, $data->orderBy->direction->name)->with('moneySum')->paginate($data->perPage, page: $data->page);
        $list = $paginator->items()->map(function (Payment $payment) {
            $returned = array_merge($payment->toArray(), $payment->moneySum->toArray());
            $returned['idd'] = $payment->id;
            $returned['date'] = $payment->date->format(RUS_DATE_FORMAT);
            return $returned;
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
        if($payment->date->format(ISO_DATE_FORMAT) !== $formData['date']) {
            $allPayments->slice($paymentIndex, 1);
            $this->addPaymentInCollection($allPayments, $payment);
            $payment->date = $formData['date'];
        }
        $payment->moneySum->sum = $formData['sum'];
        $this->countPaymentsAndSave($contract, $allPayments, $payment);
    }

    function deleteOne(Contract $contract, Payment $payment): void
    {
        if($payment->contract->id !== $contract->id) throw new ShowableException('Id контракта не соответствует id платежа');
        $payment->delete();
        $this->countPaymentsAndSave($contract, $contract->payments);
    }

    private function countPaymentsAndSave(Contract $contract, Collection $payments, ?Payment $payment = null): void
    {
        if($contract->type->id === 1) $countService = new LimitedLoanCountService();
        else $countService = new CreditCountService();
        $countService->count($contract, now(), $payments);
        $payments->each(function(Payment $payment) {
            $payment->moneySum->save();
        });
        if($payment) {
            $payment->moneySum()->associate($payment->moneySum);
            unset($payment->moneySum);
            $payment->save();
        }
    }
    private function addPaymentInCollection(Collection $collection, Payment $payment): Collection
    {
        if($collection[0]->date >= $payment->date) {
            $collection->prepend($payment);
        }
        elseif ($collection->last()->date <= $payment->date) {
            $collection->push($payment);
        }
        else {
            $collection->push($payment);
            $collection->sort(function (Payment $first, Payment $second): int {
                if($first->date < $second->date) return -1;
                if($first->date === $second->date) return 0;
                return +1;
            });
        }
        return $collection;
    }


}