<?php

namespace App\Models\Traits;

trait SumsTrait
{
    public function countSum(): float
    {
        $this->sum = $this->main + $this->percents + $this->penalties;
        if(isset($this->fee)) $this->sum += $this->fee;
        return $this->sum;
    }

    public function getSumsStringArray(): array
    {
        $array = [];
        $array['sum'] = $this->sum . RUS_ROUBLES_NAME;
        $array['main'] = $this->main . RUS_ROUBLES_NAME;
        $array['penalties'] = $this->penalties . RUS_ROUBLES_NAME;
        $array['percents'] = $this->percents . RUS_ROUBLES_NAME;
        if(isset($this->fee)) $array['fee'] = $this->fee . RUS_ROUBLES_NAME;
        return $array;
    }

}