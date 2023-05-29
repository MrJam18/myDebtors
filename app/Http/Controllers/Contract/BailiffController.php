<?php
declare(strict_types=1);
namespace App\Http\Controllers\Contract;

use App\Http\Controllers\Controller;
use App\Http\Requests\SearchRequest;
use App\Models\Subject\Bailiff;
use App\Models\Subject\Court\Court;
use App\Services\AddressService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class BailiffController extends Controller
{
    public function create(Request $request): void
    {
        $bailiff = new Bailiff();
        $data = $request->all();
       // Log::info(print_r($data, true));
        $bailiff->name = $data['name'];
        $addressService = new AddressService();
        $address = $addressService->addAddress($data['address']);
        $bailiff->address()->associate($address);
        $bailiff->save();
    }

    public function findByName(SearchRequest $request): array | Collection
    {
        $data = Bailiff::query()->search(['name'=>$request->validated()])->get();
        //Log::info(print_r($data, true));
        return $data->map(function(Bailiff $bailiff){
            return [
                'name'=> $bailiff->name,
                'id' => $bailiff->id
            ];
        });
    }
}
