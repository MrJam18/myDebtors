<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Models\Contract\Contract;
use App\Models\ExecutiveDocument\ExecutiveDocument;
use App\Models\Subject\Bailiff\BailiffDepartment;
use App\Models\Subject\Court\Court;
use App\Models\Subject\People\Debtor;
use App\Services\Excel\Writers\BailiffDepartmentsExcelWriterService;
use App\Services\Excel\Writers\ContractsExcelWriterService;
use App\Services\Excel\Writers\CourtsExcelWriterService;
use App\Services\Excel\Writers\DebtorsExcelWriterService;
use App\Services\Excel\Writers\ExecutiveDocsExcelWriterService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExcelController
{
    function getTemplate(Request $request): ?StreamedResponse
    {
        return Storage::download('templates/' . $request->input('entityKey') . '.xlsx', $request->input('entityName') . '.xlsx');
    }
    function getDebtors(DebtorsExcelWriterService $service): StreamedResponse
    {
        $debtors = Debtor::query()->byGroupId(getGroupId())->with(['address', 'name', 'passport'])->get();
        $service->buildSpreadSheet($debtors);
        return $service->getFileResponse('Реестр должников');
    }
    function getContracts(ContractsExcelWriterService $service): StreamedResponse
    {
        $contracts = Contract::query()->byGroupId(getGroupId())->with('type', 'status')->get();
        $service->handle($contracts);
        return $service->getFileResponse('Реестр договоров');
    }
    function getExecutiveDocs(ExecutiveDocsExcelWriterService $service): StreamedResponse
    {
        $contracts = Contract::query()->byGroupId(getGroupId())->select(['id']);
        $executiveDocs = ExecutiveDocument::query()->whereIn('contract_id', $contracts)
            ->with(['type'])->get();
        $service->handle($executiveDocs);
        return $service->getFileResponse('Реестр исп. документов');
    }
    function getCourts(CourtsExcelWriterService $service): StreamedResponse
    {
        $courts = Court::query()->with(['requisites' => ['bank']])->get();
        $service->handle($courts);
        return $service->getFileResponse('Реестр судов');
    }
    function getBailiffDepartments(BailiffDepartmentsExcelWriterService $service): StreamedResponse
    {
        $departments = BailiffDepartment::with(['address'])->get();
        $service->handle($departments);
        return $service->getFileResponse('Реестр отделов судебных приставов');
    }

}