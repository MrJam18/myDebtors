<?php
declare(strict_types=1);

namespace App\Services;

use App\Models\Address\Address;
use App\Models\Address\Area;
use App\Models\Address\Country;
use App\Models\Address\Region;
use App\Models\Address\Settlement;
use App\Models\Address\Street;
use App\Services\AbstractServices\BaseService;
use App\Services\Components\AddressData;

class AddressService extends BaseService
{
    function addAddress(array $addressData): Address
    {
        $addressData = new AddressData($addressData);
        $address = new Address();
        $country = Country::firstOrCreate($this->getNameArr($addressData->country));
        $address->country()->associate($country);
        $region = Region::firstOrCreate($this->getNameArr($addressData->country), ['country_id' => $address->country->id]);
        $address->region()->associate($region);
        if ($addressData->area) {
            $area = Area::firstOrCreate($this->getNameArr($addressData->area),
                [
                    'region_id' => $address->region->id
                ]);
            $address->area()->associate($area);
        }
        $settlement = Settlement::firstOrCreate($this->getNameArr($addressData->settlement),
            [
                'area_id' => $address->area?->id,
                'region_id' => $address->region->id
            ]);
        $address->settlement()->associate($settlement);
        $street = Street::firstOrCreate($this->getNameArr($addressData->street),
            [
                'settlement_id' => $address->settlement->id
            ]);
        $address->street()->associate($street);
        $address->postal_code = $addressData->postal_code;
        $address->house = $addressData->house;
        if($addressData->flat) $address->flat = $addressData->flat;
        if($addressData->block) $address->block = $addressData->block;
        $address->save();
        return $address;
    }

    private function getNameArr(string $name): array
    {
        return [
            'name' => $name
        ];
    }

}
