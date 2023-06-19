<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Enums\LoadEntityEnum;
use App\Services\Excel\Base\ExcelService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExcelController
{
    function getTemplate(Request $request): ?StreamedResponse
    {
        $entityEnum = null;
        $entityId = (int)$request->input('entityId');
            foreach (LoadEntityEnum::cases() as $loadEntity) {
                if($loadEntity->value === $entityId) $entityEnum = $loadEntity;
            }
        if($entityEnum) return Storage::download('templates/' . strtolower($entityEnum->name) . '.xlsx', $entityEnum->name . '.xlsx');
        else return null;
    }
    function getDebtors(Request $request)
    {
        $table = new Spreadsheet();
        $active = $table->getActiveSheet();

    }

}