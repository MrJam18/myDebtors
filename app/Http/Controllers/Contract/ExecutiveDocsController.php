<?php
declare(strict_types=1);
namespace App\Http\Controllers\Contract;

use App\Http\Controllers\Controller;
use App\Models\Contract\Contract;
use App\Models\ExecutiveDocument\ExecutiveDocument;
use App\Models\ExecutiveDocument\ExecutiveDocumentType;
use App\Models\MoneySum;
use App\Models\Subject\Bailiff;
use App\Models\Subject\Court\Court;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ExecutiveDocsController extends Controller
{
    public function set(Request $request){
        $data = $request->all();
        Log::info(print_r($data, true));
        $exDoc = new ExecutiveDocument();
        $exDoc->issued_date = $data['dateIssue'];
        $exDoc->number = $data['number'];
        $type = ExecutiveDocumentType::find($data['typeId']);
        $exDoc->type()->associate($type);
        $moneySum = new MoneySum();
        $moneySum->main = $data['main'];
        $moneySum->percents = $data['percents'];
        $moneySum->penalties = $data['penalties'];
        $moneySum->sum = $moneySum->countSum();
        $moneySum->save();
        $exDoc->moneySum()->associate($moneySum);
        $exDoc->fee = $data['fee'];
        $court = Court::find($data['courtId']);
        $exDoc->court()->associate($court);
        $bailiff = Bailiff::find($data['bailiffId']);
        $exDoc->bailiff()->associate($bailiff);
        $contract = Contract::find($data['contractId']);
        $exDoc->contract()->associate($contract);

        $exDoc->save();
    }
}
