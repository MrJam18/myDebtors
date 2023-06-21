<?php
declare(strict_types=1);
namespace App\Http\Controllers\Contract;

use App\Http\Controllers\Controller;
use App\Http\Requests\SearchRequest;
use App\Models\Subject\Bailiff\BailiffDepartment;
use App\Services\AddressService;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;

class BailiffDepartmentsController extends Controller
{
    public function create(Request $request): array
    {
        $bailiff = new BailiffDepartment();
        $data = $request->all();
       // Log::info(print_r($data, true));
        $bailiff->name = $data['name'];
        $addressService = new AddressService();
        $address = $addressService->addAddress($data['address']);
        $bailiff->address()->associate($address);
        $bailiff->save();
        return [
            'name'=> $bailiff->name,
            'id' => $bailiff->id
        ];
    }

    public function findByName(SearchRequest $request): array | Collection
    {
        $data = BailiffDepartment::query()->search(['name'=>$request->validated()])->get();
        //Log::info(print_r($data, true));
        return $data->map(function(BailiffDepartment $bailiff){
            return [
                'name'=> $bailiff->name,
                'id' => $bailiff->id
            ];
        });
    }

}
