<?php
declare(strict_types=1);

namespace App\Models\Subject\Bailiff;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use App\Models\Base\BaseModel;
use Carbon\Carbon;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property 
 */
class BailiffPosition extends BaseModel
{
    protected $fillable = [
        
    ];
    public $timestamps = true;
}
