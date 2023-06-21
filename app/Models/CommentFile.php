<?php

namespace App\Models;

use App\Models\Base\BaseModel;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property int $id;
 * @property string $url;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 */

class CommentFile extends BaseModel
{
    use HasFactory;

    protected $fillable = [
        'url',
    ];

    public $timestamps = true;
}
