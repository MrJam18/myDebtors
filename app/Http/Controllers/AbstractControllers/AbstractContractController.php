<?php
declare(strict_types=1);

namespace App\Http\Controllers\AbstractControllers;

use App\Enums\Database\ActionObjectEnum;
use App\Services\ActionsService;
use Illuminate\Http\Request;

abstract class AbstractContractController extends AbstractController
{
    protected ActionsService $actionsService;

    public function __construct(Request $request, ActionObjectEnum $defaultObject)
    {
        foreach ($request->route()->parameters() as $name => $value) {
            if($name === 'contract') {
                $this->actionsService = new ActionsService((int)$value, $defaultObject);
                break;
            }
        }
    }

}