<?php
declare(strict_types=1);

namespace App\Http\Controllers\Contract;

use App\Http\Controllers\Controller;
use App\Http\Requests\SearchRequest;
use App\Models\Subject\Court\Court;
use App\Models\Subject\Court\CourtLevel;
use App\Models\Subject\Court\CourtType;
use App\Services\AddressService;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CourtController extends Controller
{
    /**
     * @param Request $request
     * @return void
     */
    public function create(Request $request): void
    {
        $court = new Court();
        $data = $request->all();
        //Log::info(print_r($data, true));
        $court->name = $data['court']['name'];
        $court->type_id = $data['court']['courtTypeId'];
        $court->level_id = $data['court']['courtLevelId'];
        $addressService = new AddressService();
        $address = $addressService->addAddress($data['address']);
        $court->address()->associate($address);
        $court->save();
    }

    public function getLevels(): Collection|array
    {
        return CourtLevel::query()->get();
    }
    public function getTypes(): Collection|array
    {
        return CourtType::query()->get();
    }

    public function findByName(SearchRequest $request): array
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
}
