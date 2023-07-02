<?php
declare(strict_types=1);
namespace App\Http\Controllers\Contract;

use App\Exceptions\ShowableException;
use App\Http\Controllers\Controller;
use App\Models\Contract\Contract;
use App\Models\EnforcementProceeding\EnforcementProceeding;
use App\Models\ExecutiveDocument\ExecutiveDocument;
use App\Models\ExecutiveDocument\ExecutiveDocumentType;
use App\Models\MoneySum;
use App\Models\Subject\Bailiff\BailiffDepartment;
use App\Models\Subject\Court\Court;
use App\Services\Excel\Readers\CreateExecutiveDocsExcelService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class ExecutiveDocumentsController extends Controller
{
    public function set(Request $request, Contract $contract){
       $data = $request->all();
        $formData = $data['formData'];
        if(isset($data['id'])) {
            $exDoc = ExecutiveDocument::find($data['id']);
            if($exDoc->contract->id !== $contract->id) throw new ShowableException('id исполнительного документа не соответствует с запросом');
        }if(count($data['deleteIds']) !== 0){
            $contract->executiveDocuments()->whereIn('id',  $data['deleteIds'])->delete();
            return;
        }
        else $exDoc = new ExecutiveDocument();
        if(isset($formData['resolution_date'])){
            $exDoc->resolution_date = $formData['resolution_date'];

        }
        if(isset($formData['resolution_number'])){
            $exDoc->resolution_number = $formData['resolution_number'];
        }
        $exDoc->issued_date = $formData['issued_date'];
        $exDoc->number = $formData['number'];
        $type = ExecutiveDocumentType::find($data['typeId']);
        $exDoc->type()->associate($type);
        $moneySum = new MoneySum();
        $moneySum->main = $formData['main'];
        $moneySum->percents = $formData['percents'];
        $moneySum->penalties = $formData['penalties'];
        $moneySum->sum = $moneySum->countSum();
        $moneySum->save();
        $exDoc->moneySum()->associate($moneySum);
        $exDoc->fee = $formData['fee'];
        $court = Court::find($data['courtId']);
        $exDoc->court()->associate($court);
        $bailiff = BailiffDepartment::find($data['bailiffId']);
        $exDoc->bailiffDepartment()->associate($bailiff);
        $exDoc->contract()->associate($contract);
        $exDoc->save();
    }

    public function getAll(Contract $contract):Collection
    {

        $list = $contract->executiveDocuments;
        return $list->map(function (ExecutiveDocument $document){
            $returned = $document->toArray();
            $bailiffDepartment = BailiffDepartment::find($document->bailiff_department_id);
            $court = Court::find($document->court_id);
            $docType = ExecutiveDocumentType::find($document->type_id);
            $returned['bailiffDepartment'] = [
                'name'=>$bailiffDepartment->name,
                'id'=>$bailiffDepartment->id
            ];
            $returned['court'] = [
                'name'=>$court->name,
                'id'=>$court->id
            ];
//            $returned['typeId'] = [
//                'name'=>$docType->name,
//                'id'=>$docType->id
//            ];
            $returned['main'] = $document->moneySum->main;
            $returned['percents'] = $document->moneySum->percents;
            $returned['penalties'] = $document->moneySum->penalties;
            $enforcementProceedingsList = $document->enforcementProceedings;
            $proceedingsArray = $enforcementProceedingsList->map(function (EnforcementProceeding $proceeding){
                $item = $proceeding->toArray();
                $item['bailiff'] = [
                    'name' => $proceeding->bailiff->name->getFull(),
                    'id' => $proceeding->bailiff->id
                ];
                return $item;
            })->toArray();
            $returned['enforcementProceedings'] = $proceedingsArray;
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
