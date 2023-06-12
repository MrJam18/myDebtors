<?php

namespace App\Models\EnforcementProceeding;

use App\Models\Base\BaseModel;
use App\Models\ExecutiveDocument\ExecutiveDocument;
use App\Models\Subject\Bailiff\Bailiff;
use App\Models\Subject\Bailiff\BailiffDepartment;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class EnforcementProceeding extends BaseModel
{

    /**
     * @property int $id;
     * @property string $number;
     * @property Carbon $begin_date;
     * @property Carbon $end_date;
     * @property Carbon $created_at;
     * @property Carbon $updated_at;
     * @property Carbon $status_date;
     * @property EnforcementProceedingStatus $proceedingStatus
     * @property Bailiff $bailiff
     * @property ExecutiveDocument $executiveDocument
     * @property float $sum;
     * @property float $percents;
     * @property float $penalties;
     * @property float $main;
     * @property float $fee;
     */

    protected $fillable = [
        'begin_date',
        'end_date',
        'sum',
        'percents',
        'penalties',
        'main',
        'fee',
        'number'
    ];

    public static function boot() {
        parent::boot();

        // При каждом сохранении или обновлении модели
        static::saving(function($model) {
            // Обновляем поле status_date текущей датой и временем
            $model->status_date = Carbon::now();
        });
    }

    function proceedingStatus(): BelongsTo
    {
        return $this->belongsTo(EnforcementProceedingStatus::class,'status_id');
    }
    function bailiff(): BelongsTo
    {
        return $this->belongsTo(Bailiff::class,'bailiff_id');
    }
    function executiveDocument(): BelongsTo
    {
        return $this->belongsTo(ExecutiveDocument::class,'executive_document_id');
    }
}
