<?php
declare(strict_types=1);
namespace App\Http\Controllers\Contract;

use App\Exceptions\ShowableException;
use App\Http\Controllers\Controller;
use App\Models\Contract\Contract;
use App\Models\EnforcementProceeding\EnforcementProceeding;
use App\Models\ExecutiveDocument\ExecutiveDocument;
use App\Models\MoneySum;
use App\Services\Excel\Readers\CreateExecutiveDocsExcelService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ExecutiveDocumentsController extends Controller
{
    public function set(Request $request, Contract $contract): void
    {
       $data = $request->all();
        DB::transaction(function () use (&$data, $contract) {
            foreach ($data['executiveDocs'] as $executiveDocData) {
                if(isset($executiveDocData['id'])) {
                    $exDoc = ExecutiveDocument::find($executiveDocData['id']);
                    if ($exDoc->contract->id !== $contract->id) throw new ShowableException('id исполнительного документа не соответствует с запросом');
                    $moneySum = $exDoc->moneySum;
                    $moneySum->main = $executiveDocData['main'];
                    $moneySum->percents = $executiveDocData['percents'];
                    $moneySum->penalties = $executiveDocData['penalties'];
                    $moneySum->sum = $moneySum->countSum();
                    $moneySum->save();
                }
                else {
                    $exDoc = new ExecutiveDocument();
                    $moneySum = new MoneySum();
                    $moneySum->main = $executiveDocData['main'];
                    $moneySum->percents = $executiveDocData['percents'];
                    $moneySum->penalties = $executiveDocData['penalties'];
                    $moneySum->sum = $moneySum->countSum();
                    $moneySum->save();
                    $exDoc->moneySum()->associate($moneySum);
                }
                if(isset($executiveDocData['resolution_date'])){
                    $exDoc->resolution_date = $executiveDocData['resolution_date'];
                }
                if(isset($executiveDocData['resolution_number'])){
                    $exDoc->resolution_number = $executiveDocData['resolution_number'];
                }
                $exDoc->issued_date = $executiveDocData['issued_date'];
                $exDoc->number = $executiveDocData['number'];
                $exDoc->type_id = $executiveDocData['type_id'];
                $exDoc->fee = $executiveDocData['fee'];
                $exDoc->court_id = $executiveDocData['court']['id'];
                $exDoc->bailiff_department_id = $executiveDocData['bailiffDepartment']['id'];
                $exDoc->contract()->associate($contract);
                $exDoc->save();
            }
            if(count($data['deleteIds']) !== 0) {
                $contract->executiveDocuments()->whereIn('id',  $data['deleteIds'])->delete();
            }
        });
    }

    public function getAll(Contract $contract):Collection
    {
        $list = $contract->executiveDocuments;
        return $list->map(function (ExecutiveDocument $document){
            $returned = $document->toArray();
            $returned['bailiffDepartment'] = [
                'name'=>$document->bailiffDepartment->name,
                'id'=>$document->bailiffDepartment->id
            ];
            $returned['court'] = [
                'name'=>$document->court->name,
                'id'=> $document->court->id
            ];
            $returned['main'] = $document->moneySum->main;
            $returned['percents'] = $document->moneySum->percents;
            $returned['penalties'] = $document->moneySum->penalties;
            Log::info(print_r($returned, true));
            /**
             * @var EnforcementProceeding $lastProceeding
             */
            $lastProceeding = $document->enforcementProceedings()->orderBy('begin_date', 'DESC')->first();
            if($lastProceeding) {
                $returned['lastProceeding'] = "№ {$lastProceeding->number} от {$lastProceeding->begin_date->format(RUS_DATE_FORMAT)} г.";
            }
            else $returned['lastProceeding'] = 'Отсутствует';
            return $returned;
        });
    }

    function getListForChooser(Contract $contract): Collection
    {
        return $contract->executiveDocuments->map(function (ExecutiveDocument $executiveDocument) {
            $returned = $executiveDocument->toArray();
            $returned = array_merge($returned, $executiveDocument->moneySum->getSumsStringArray());
            $returned['fee'] = $executiveDocument->fee . RUS_ROUBLES_NAME;
            $returned['id'] = $executiveDocument->id;
            $returned['bailiffDepartment'] = $executiveDocument->bailiffDepartment->name;
            $returned['court'] = $executiveDocument->court->name;
            $returned['issued_date'] = $executiveDocument->issued_date->format(RUS_DATE_FORMAT);
            $returned['type'] = $executiveDocument->type->name;
            $returned['name'] = $executiveDocument->getName();
            return $returned;
        });
    }

    function createFromExcel(Request $request): void
    {
        $service = CreateExecutiveDocsExcelService::createFromPath($request->file('table')->getRealPath());
        $service->handle();
    }
}
