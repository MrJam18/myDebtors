<?php
declare(strict_types=1);

namespace App\Models;

use App\Models\Base\BaseModel;
use App\Models\Casts\Money;
use App\Models\Traits\SumsTrait;
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
    use SumsTrait;
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        $this->main = 0;
        $this->penalties = 0;
        $this->percents = 0;
    }

    protected $fillable = [
        'sum',
        'percents',
        'penalties',
        'main'
    ];
    public $timestamps = false;

    protected $casts = [
        'sum' => Money::class,
        'percents' => Money::class,
        'penalties' => Money::class,
        'main' => Money::class
    ];
}




