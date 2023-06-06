<?php

namespace App\Http\Controllers;

use App\Http\Requests\PaginateRequest;
use App\Http\Requests\SearchRequest;
use App\Models\Passport\Passport;
use App\Models\Passport\PassportType;
use App\Models\Subject\Creditor\Creditor;
use App\Models\Subject\People\Agent;
use App\Models\Subject\People\Name;
use App\Providers\Database\AgentsProvider;
use App\Services\AddressService;
use Exception;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
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
            $agent->is_default = $formData['is_default'];
            $agent->no_show_group = $formData['no_show_group'];
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
    function getOne(Agent $agent): array
    {
        toConsole($agent->no_show_group);
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
        $agent = Agent::findWithGroupId($agentId);
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
        if ($input['address'] !== 'initial') {
            $updatedAddress = $addressService->addAddress($input['address']);
            $oldAddress = $agent->address;
            $agent->address()->associate($updatedAddress);
        }
        // Обработка checkbox
            $agent->no_show_group=$formData['no_show_group'];
            $agent->is_default = $formData['is_default'];
        $agent->save();
        if(isset($oldAddress)) $oldAddress->delete();
        return response()->json($agent);
    }

    public function delete(Agent $agent): JsonResponse
    {
        $agent->delete();
        $agent->address?->delete();
        $agent->passport?->delete();
        $agent->name->delete();
        return response()->json(['success' => 'Agent deleted']);
    }
    public function getDefault(): ?array
    {
        /**
         * @var Agent $agent
         */
        $agent = Agent::query()->where('user_id', Auth::id())->where('is_default', true)->first();
        if($agent) return [
            'name' => $agent->name->getFull(),
            'id' => $agent->id
        ];
        else return null;
    }
    function getSearchList(SearchRequest $request): Collection
    {
        $list = Agent::query()->byGroupId(getGroupId())->searchByFullName($request->validated())->limit(5)->get();
        toConsole(Agent::query()->byGroupId(getGroupId())->searchByFullName($request->validated())->limit(5)->toSql());
        return $list->map(function (Agent $agent) {
            return [
              'id' => $agent->id,
              'name' => $agent->name->getFull()
            ];
        });
    }



}
