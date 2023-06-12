<?php
declare(strict_types=1);

namespace App\Http\Controllers\Contract;

use App\Enums\Database\ActionObjectEnum;
use App\Http\Controllers\AbstractControllers\AbstractContractController;
use App\Models\Contract\Contract;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FilesController extends AbstractContractController
{
    public function __construct(Request $request)
    {
        parent::__construct($request, ActionObjectEnum::File);
    }

    function getExistingFiles(Contract $contract): array
    {
        $fileList = [
            'contract' => false,
            'courtOrder' => false,
            'cancelDecision' => false,
            'executiveDocument' => false,
            'IPInit' => false,
            'IPEnd' => false,
        ];
        $files = Storage::files('contracts/' . $contract->id);
        foreach ($files as $file) {
            $fileList[pathinfo($file,PATHINFO_FILENAME)] = true;
        }
        return $fileList;
    }

}