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
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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

    /**
     * @throws Exception
     */
    function getOne($id): array
    {
        /**
         * @var $agent Agent
         */
        $agent = Agent::query()->find($id);
        if(!$agent) throw new Exception('cant find agent by id ' . $id);

        return [
            'name' => $agent->name->name,
            'surname' => $agent->name->surname,
            'patronymic' => $agent->name->patronymic,
            'is_default' => $agent->is_default,
            'no_show_group' => $agent->no_show_group,
            'enclosure' => $agent->enclosure,
            'fullAddress' => $agent->address?->getFull(), // проверить на существование адреса перед вызовом getFull()
            'passportSeries' => $agent->passport?->series, // проверить на существование паспорта перед обращением к series
            'passportNumber' => $agent->passport?->number, // проверить на существование паспорта перед обращением к number

        ];
    }

    public function update(Request $request): JsonResponse
    {
        $addressService = new AddressService();
        $input = $request->all();
        $formData=$input['formData'];
        $agentId = $input['id'];
        $agent = Agent::query()->find($agentId);
        if(!$agent) throw new Exception('cant find agent by id ' . $agentId);

        // Обработка данных формы
        foreach ($formData as $key => $value) {
            if (in_array($key, ['name', 'surname', 'patronymic'])) {
                $agent->name->$key = $value;
                $agent->name->save();
            } elseif ($key === 'passportSeries' || $key === 'passportNumber') {
                $passportData[$key] = $value;
            } else {
                $agent->$key = $value;
            }
        }
        // Проверка, не пуст ли массив $passportData, который содержит информацию о паспорте

        if (!empty($passportData)) {
            // Если у агента уже есть паспорт (связанный объект Passport), то мы его обновляем
            if ($agent->passport) {
                // Если в массиве $passportData есть ключ 'passportSeries', обновляем серию паспорта агента
                if (isset($passportData['passportSeries'])) {
                    $agent->passport->series = $passportData['passportSeries'];
                }
                // Если в массиве $passportData есть ключ 'passportNumber', обновляем номер паспорта агента
                if (isset($passportData['passportNumber'])) {
                    $agent->passport->number = $passportData['passportNumber'];
                }
                $agent->passport->save();
            } else {
                // Если у агента нет связанного объекта Passport, создаем новый объект Passport
                $passport = new Passport;
                // Если в массиве $passportData есть ключ 'passportSeries', устанавливаем серию нового паспорта
                if (isset($passportData['passportSeries'])) {
                    $passport->series = $passportData['passportSeries'];
                }
                // Если в массиве $passportData есть ключ 'passportNumber', устанавливаем номер нового паспорта
                if (isset($passportData['passportNumber'])) {
                    $passport->number = $passportData['passportNumber'];
                }
                $passport->save();
                $agent->passport()->associate($passport);
            }
        }
        // Обработка адреса
        if (isset($input['address']) && $input['address'] != 'initial') {
            $updatedAddress = $addressService->updateAddress($agent->address, $input['address']);
            $agent->address()->associate($updatedAddress);
        }
        // Обработка checkbox
        if (isset($input['is_default']) and $input['no_show_group']){
            $agent->no_show_group=$input['no_show_group'];
            $agent->is_default = $input['is_default'];
        }

        if ($agent->save()) Log::info('saved'); // сохраняем обновленного агента

        return response()->json($agent, 200);
    }

    public function delete($id): JsonResponse
    {
        $agent = Agent::query()->find($id);
        if(!$agent) throw new Exception('cant find agent by id ' . $id);
        $agent->address?->delete();
        $agent->passport?->delete();
        $agent->delete();
        return response()->json(['success' => 'Agent deleted'], 200);

    }


}
