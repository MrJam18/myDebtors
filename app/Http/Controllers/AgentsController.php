<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaginateRequest;
use App\Models\Passport\Passport;
use App\Models\Passport\PassportType;
use App\Models\Requisites\BankRequisites;
use App\Models\Requisites\Requisites;
use App\Models\Subject\Agent;
use App\Models\Subject\Creditor\Creditor;
use App\Models\Subject\Name;
use App\Providers\Database\AgentsProvider;
use App\Services\AddressService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class AgentsController extends Controller
{
    /**
     * @throws \Exception
     */
    function getList(PaginateRequest $request, AgentsProvider $provider): array | JsonResponse
    {
        $data = $request->validated();
        $paginator = $provider->getList( $data);

        $list = $paginator->items()->map(function (Agent $agent) {
            return [
                'idd' => $agent->id,
                'is_default' => $agent->is_default,
                'no_show_group' => $agent->no_show_group,
                'surname' => $agent->name->surname,
                'name'=> $agent->name->name,
                'patronymic'=> $agent->name->patronymic,
                'createdAt'=>$agent->created_at->format(RUS_DATE_FORMAT),
                'enclosure'=>$agent->enclosure,
            ];
        });
        return $paginator->jsonResponse($list);
    }

    function addOne(Request $request): void
    {
        $data = $request->all();
        DB::transaction(function () use(&$data) {
            $user = Auth::user();
            $formData = $data['formData'];
            $addressService = new AddressService();
            $address = $addressService->addAddress($data['address']);
            $passport = new Passport();
            $agent = new Agent();
            $name = new Name();
            $name->name = $formData['name'];
            $name->surname = $formData['surname'];
            $name->patronymic = $formData['patronymic'];
            $name->save();
            $agent->name()->associate($name);
            $agent->is_default = $data['is_default'];
            $agent->no_show_group = $data['no_show_group'];
            $agent->enclosure = $formData['enclosure'];
            $agent->user()->associate($user);
            $agent->address()->associate($address);
            $passport->series=$formData['passportSeries'];
            $passport->number=$formData['passportNumber'];
            $passportType = PassportType::find(1);
            $passport->type()->associate($passportType);
            $passport->save();
            $agent->passport()->associate($passport);
            $agent->save();
        });
    }


}
