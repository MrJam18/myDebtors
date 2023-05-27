<?php
declare(strict_types=1);

namespace App\Models;

use App\Models\Base\BaseModel;
use Carbon\Carbon;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property float $sum;
 * @property float $percents;
 * @property float $penalties;
 * @property float $main;
 */
class MoneySum extends BaseModel
{
    protected $fillable = [
        'sum',
        'percents',
        'penalties',
        'main'
    ];
    public $timestamps = true;

    public function countSum(): float
    {
        $this->sum = $this->main + $this->percents + $this->penalties;
        return $this->sum;
    }
}
