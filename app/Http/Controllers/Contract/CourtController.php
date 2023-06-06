<?php
declare(strict_types=1);

namespace App\Http\Controllers\Contract;

use App\Http\Controllers\Controller;
use App\Http\Requests\SearchRequest;
use App\Models\Requisites\BankRequisites;
use App\Models\Requisites\Requisites;
use App\Models\Subject\Court\Court;
use App\Models\Subject\Court\CourtLevel;
use App\Models\Subject\Court\CourtType;
use App\Services\AddressService;
use Illuminate\Support\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CourtController extends Controller
{
    public function create(Request $request): array
    {
        /**
         * @param Court $court
         */
        $user = Auth::user();
        $court = new Court();
        $data = $request->all();
       //Log::info(print_r($data, true));
        $court->name = $data['court']['name'];
        $court->type_id = $data['court']['courtTypeId'];
        $court->level_id = $data['court']['courtLevelId'];
        $addressService = new AddressService();
        $address = $addressService->addAddress($data['address']);
        $court->address()->associate($address);
        $requisites = new Requisites();
        $bankRequisites = BankRequisites::find($data['court']['bankId']);
        $fields = ['inn', 'kbk', 'kpp', 'recipient', 'correspondent_account', 'checking_account'];
        foreach ($fields as $field) {
            if (isset($data['court'][$field])) {
                $requisites->$field = $data['court'][$field];
            }
        }
             $requisites->bank()->associate($bankRequisites);
             $requisites->user()->associate($user);
             $requisites->save();
             $court->requisites()->associate($requisites);
             $court->save();
             return [
                 'id' => $court->id,
                 'name' => $court->name
             ];
    }

    public function getLevels(): Collection|array
    {
        return CourtLevel::query()->get();
    }
    public function getTypes(): Collection|array
    {
        return CourtType::query()->get();
    }

    public function findByName(SearchRequest $request): array | Collection
    {
        $data = Court::query()->search(['name'=>$request->validated()])->get();
       // Log::info(print_r($data, true));
        return $data->map(function(Court $court){
            return [
                'name'=> $court->name,
                'id' => $court->id
            ];
        });
    }

    function searchBankRequisites(SearchRequest $request): array | Collection
    {
        $data = BankRequisites::query()->search([
            'name' => $request->validated(),
            'BIK' => $request->validated()
        ])->get();
        return $data->map(function(BankRequisites $requisites){
            return [
                'id' => $requisites->id,
                'name' => $requisites->name . ' ' . $requisites->BIK
            ];
        });
    }
}
