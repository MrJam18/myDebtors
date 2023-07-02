<?php
declare(strict_types=1);

namespace App\Models\Address;

use App\Models\Base\BaseModel;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property string $postal_code;
 * @property string | null $block;
 * @property string | null $flat;
 * @property string $house;
 * @property Region $region;
 * @property Settlement $settlement;
 * @property Street $street;
 * @property Area | null $area;
 * @property Country $country;
 */
class Address extends BaseModel
{
    protected $fillable = [
        'postal_code',
        'block',
        'flat',
        'house'
    ];
    public $timestamps = true;

    function region(): BelongsTo
    {
        return $this->belongsTo(Region::class);
    }
    function settlement(): BelongsTo
    {
        return $this->belongsTo(Settlement::class);
    }
    function street(): BelongsTo
    {
        return $this->belongsTo(Street::class);
    }
    function area(): BelongsTo
    {
        return $this->belongsTo(Area::class);
    }
    function country(): BelongsTo
    {
        return $this->belongsTo(Country::class);
    }
    function getFull(): string
    {
        /**
         * @var Address $data;
         */
        $data = self::query()->where('addresses.id', $this->id)
            ->joinRelation('country')
            ->joinRelation('region')
            ->leftJoinRelation('area')
            ->rightJoinRelation('settlement')
            ->joinRelation('street')
            ->select(['countries.name as country_name', 'regions.name as region_name', 'areas.name as area_name',
                'settlements.name as settlement_name', 'streets.name as street_name'])
            ->first();
        $fullAddress = $this->postal_code . ', ';
        if($this->country_id !== 1) $fullAddress .= $data->country_name . ', ';
        $fullAddress .= $data->region_name . ', ';
        if($data->area_name) $fullAddress .= $data->area_name . ', ';
        $fullAddress .= $data->settlement_name . ', ' . $data->street_name . ', ' . $this->house;
        if($this->block) $fullAddress .= ', ' . $this->block;
        if($this->flat) $fullAddress .= ', ' . $this->flat;
        return $fullAddress;
    }
    function getFullByNested(): string
    {
        $fullAddress = $this->postal_code . ', ';
        if($this->country_id !== 1) $fullAddress .= $this->country->name . ', ';
        $fullAddress .= $this->region->name . ', ';
        if($this->area_id) $fullAddress .= $this->area->name . ', ';
        $fullAddress .= $this->settlement->name . ', ' . $this->street->name . ', ' . $this->house;
        if($this->block) $fullAddress .= ', ' . $this->block;
        if($this->flat) $fullAddress .= ', ' . $this->flat;
        return $fullAddress;
    }
    function getShort(): string
    {
        /**
         * @var Address $data;
         */
        $data = self::query()->where('addresses.id', $this->id)
            ->leftJoinRelation('area')
            ->rightJoinRelation('settlement')
            ->joinRelation('street')
            ->select(['areas.name as area_name',
                'settlements.name as settlement_name', 'streets.name as street_name'])
            ->first();
        $fullAddress = '';
        if($data->area_name) $fullAddress .= $data->area_name . ', ';
        $fullAddress .= $data->settlement_name . ', ' . $data->street_name . ', ' . $this->house;
        if($this->block) $fullAddress .= ', ' . $this->block;
        if($this->flat) $fullAddress .= ', ' . $this->flat;
        return $fullAddress;
    }
    function getShortByNested(): string
    {
        $fullAddress = '';
        if($this->area_id) $fullAddress .= $this->area->name . ', ';
        $fullAddress .= $this->settlement->name . ', ' . $this->street->name . ', ' . $this->house;
        if($this->block) $fullAddress .= ', ' . $this->block;
        if($this->flat) $fullAddress .= ', ' . $this->flat;
        return $fullAddress;
    }
}
