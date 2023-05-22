<?php

namespace App\Http\Controllers;

use App\Models\Cession\Cession;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Http\Requests\PaginateRequest;
use App\Models\Auth\User;
use App\Models\Contract\Contract;
use App\Models\Subject\Debtor;
use App\Providers\Database\DebtorsProvider;
use Illuminate\Support\Facades\Auth;

class SearchController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request, DebtorsProvider $provider)
    {
        $regexp = '/(\bdiv\b)|\<|\>/';
        $req = $request['data'];

        // проверка на пустоту
        if ($req === null)
            return;
        // проверка по регулярке
        $decode_req = htmlspecialchars($req);
        if (preg_match($regexp, $decode_req)) {
            $results = array('departments' => [], 'department_pages' => []);
            return $results;
        }

        $deptors = Debtor::where()->get();
        $results = User::where('email', 'LIKE', "%{$req}%")->get();

        // $user = Auth::user();
        // $requestData = $request->validated();
        // $paginator = $provider->getList($user->group->id, $requestData);
        // $list = $paginator->items()->map(function (Debtor $debtor) {
        //     $contracts = $debtor->contracts->map(function (Contract $contract) {
        //         return [
        //             'text' => 'договор № ' . $contract->number . ' выдан ' . $contract->issued_date . ' г.',
        //             'id' => $contract->id,
        //             'creditor' => $contract->creditor->name,
        //             'status' => $contract->status->name
        //         ];
        //     });
        //     return [
        //         'id' => $debtor->id,
        //         'text' => $debtor->name->getFull() . ", " . $debtor->birth_date->format(RUS_DATE_FORMAT) . ' г. р., место рождения: ' . $debtor->birth_place,
        //         'contracts' => $contracts
        //     ];
        // });
        // $list = array();
        // foreach ($results as $el) {
        //     $list = array
        //     dd($el->email);
        // }
        return $results->toJson();
    }
}