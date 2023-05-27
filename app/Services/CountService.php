<?php


namespace App\Services;
use Illuminate\Support\Carbon;
use App\Services\AbstractServices\BaseService;

class CountService extends BaseService
{
    public function countDelay($due_date, $now_date){
        return $now_date->diffInDays($due_date);
    }
}
