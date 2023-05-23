<?php

namespace App\Http\Controllers;

use App\Http\Requests\SearchRequest;
use App\Models\Cession\Cession;
use App\Models\Subject\Agent;
use App\Models\Subject\Creditor\Creditor;
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
    function test_input($data)
    {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }
    /**
     * Display a listing of the resource.
     */
    public function index(SearchRequest $request)
    {
        $regexp = '/(\bdiv\b)|\<|\>/';
        $req = self::test_input($request->searchString);

        // проверка на пустоту
        if ($req === null)
            return;
        // проверка по регулярке
        if (preg_match($regexp, $req)) {
            $results = array('departments' => [], 'department_pages' => []);
            return $results;
        }

        if (strpos($req, '.')) {
            $contract = Contract::where('number', 'LIKE', '%' . $req . '%')->select('id', 'number', 'issued_date')->paginate(10);
        } elseif (is_numeric($req)) {
            $contract = Contract::where('number', 'LIKE', '%' . $req . '%')->paginate(10);
            $creditor = Creditor::where('court_identifier', 'LIKE', '%' . $req . '%')->select('id', 'name', 'short', 'court_identifier')->paginate(10);
        } else {
            $creditor = Creditor::where('name', 'LIKE', '%' . $req . '%')->orWhere('short', 'LIKE', '%' . $req . '%')->select('id', 'name', 'short', 'court_identifier')->paginate(10);
        }
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

        return compact('creditor', 'contract');
    }
}