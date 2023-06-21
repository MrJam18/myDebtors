<?php

namespace App\Http\Controllers\Contract;

use App\Http\Controllers\Controller;
use App\Http\Requests\SearchRequest;
use App\Models\Subject\Bailiff\Bailiff;
use App\Models\Subject\Bailiff\BailiffDepartment;
use App\Models\Subject\Bailiff\BailiffPosition;
use App\Models\Subject\People\Name;
use Illuminate\Http\Request;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Log;

class BailiffsController extends Controller
{
    public function create(Request $request): array
    {
        /**
         * @param Bailiff $bailiff
         * @param Name $name
         * @param BailiffDepartment $bailiffDepartament
         */
        $data = $request->all();
        $bailiff = new Bailiff();
        $name = new Name();
        $name->name = $data['name'];
        $name->surname = $data['surname'];
        $name->patronymic = $data['patronymic'];
        $name->save();
        $bailiff->name()->associate($name);
        $bailiffDepartment = BailiffDepartment::find($data['bailiffDepartmentId']);
        if(!$bailiffDepartment) throw new \Exception('cant find bailiff department');
        $bailiff->department()->associate($bailiffDepartment);
        $bailiffPosition = BailiffPosition::find($data['bailiffPosition']);
        if(!$bailiffPosition) throw new \Exception('cant find bailiffPosition');
        $bailiff->position()->associate($bailiffPosition);
        $bailiff->save();
        return [
            'id'=> $bailiff->id,
            'name'=>$bailiff->name
        ];

    }
    public function findByName(SearchRequest $request)
    {
        // Разделяем строку поиска на отдельные слова
        $searchWords = explode(' ', $request->validated());

        // Ищем в таблице Bailiff
        $bailiffs = Bailiff::whereHas('name', function ($query) use ($searchWords) {
            foreach ($searchWords as $word) {
                $query->where('name', 'like', $word . '%')
                    ->orWhere('surname', 'like', $word . '%')
                    ->orWhere('patronymic', 'like', $word . '%');
            }
        })->with('name')->get();

        if ($bailiffs->isEmpty()) {
            // Обработка ситуации, когда bailiff не найден
            return response()->json(['Bailiff not found'], 200);
        }

        // Сформировать массив для ответа
        $response = $bailiffs->map(function($bailiff) {
            return [
                'id' => $bailiff->id,
                'name' => $bailiff->name->surname . ' ' . $bailiff->name->name . ' ' . $bailiff->name->patronymic,
            ];
        });

        return response()->json($response);
    }



    public function getBailiffPositions(): Collection|array
    {
        return BailiffPosition::query()->get();
    }
}
