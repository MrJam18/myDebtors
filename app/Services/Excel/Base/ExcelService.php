<?php
declare(strict_types=1);

namespace App\Services\Excel\Base;

use App\Services\AbstractServices\BaseService;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ExcelService extends BaseService
{
    protected Spreadsheet $spreadsheet;

    public function __construct(?Spreadsheet $spreadsheet = null)
    {
        if(!$spreadsheet) $spreadsheet = new Spreadsheet();
        $this->spreadsheet = $spreadsheet;
    }

    function getFileResponse(string $name): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'Content-Transfer-Encoding' => 'binary',
        ];
        $writer = new Xlsx($this->spreadsheet);
        return response()->streamDownload(function () use ($writer) {
            $writer->save('php://output');
        }, $name . '.xlsx', $headers);
    }
}