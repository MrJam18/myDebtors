<?php
declare(strict_types=1);

namespace App\Http\Controllers\Contract;

use App\Enums\Database\ActionObjectEnum;
use App\Exceptions\ShowableException;
use App\Http\Controllers\AbstractControllers\AbstractContractController;
use App\Models\Contract\Contract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class FilesController extends AbstractContractController
{
    public function __construct(Request $request)
    {
        parent::__construct($request, ActionObjectEnum::File);
    }

    private array $fileList = [
        'contract',
        'courtOrder',
        'cancelDecision',
        'executiveDocument',
        'IPInit',
        'IPEnd',
    ];

    function getExistingFiles(Contract $contract): array
    {
        $fileList = [];
        foreach ($this->fileList as $key => $value) {
            $fileList[$value] = false;
        }
        $files = Storage::files('contracts/' . $contract->id);
        foreach ($files as $file) {
            $fileList[pathinfo($file, PATHINFO_FILENAME)] = true;
        }

        return $fileList;
    }

    function getFile(Contract $contract, Request $request): StreamedResponse
    {
        $fileName = $request->input('fileName');
        return Storage::download("contracts/$contract->id/$fileName.pdf");
    }

    function saveFile(Contract $contract, Request $request): void
    {
        if (in_array($request->input('name'), $this->fileList)) {
            $request->file('file')->storeAs($this->getDirPath($contract->id), "{$request->input('name')}.pdf");
        }
        else throw new ShowableException('Неверное имя файла');
    }
    function deleteFile(Contract $contract, string $fileName): void
    {
        Storage::delete($this->getDirPath($contract->id) . $fileName . '.pdf');
    }
    private function getDirPath(int $contractId): string
    {
        return "contracts/$contractId/";
    }

}