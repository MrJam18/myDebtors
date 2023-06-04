<?php
declare(strict_types=1);

namespace App\Models;

use App\Models\Base\BaseModel;
use Illuminate\Support\Carbon;


/**
 * @property int $id;
 * @property Carbon $date;
 * @property string $name;
 */
class Holiday extends BaseModel
{
    protected $fillable = [
        'date',
        'name'
    ];
    public $timestamps = true;

}