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

    function updateAddress(Address $currentAddress, array $newAddressData): Address
    {
        $addressData = new AddressData($newAddressData);

        $country = Country::updateOrCreate($this->getNameArr($currentAddress->country->name), $this->getNameArr($addressData->country));
        $currentAddress->country()->associate($country);

        $regionData = array_merge($this->getNameArr($currentAddress->region->name), ['country_id' => $currentAddress->country->id]);
        $region = Region::updateOrCreate($regionData, $this->getNameArr($addressData->region));
        $currentAddress->region()->associate($region);

        if ($addressData->area) {
            $areaData = array_merge($this->getNameArr($currentAddress->area->name), ['region_id' => $currentAddress->region->id]);
            $area = Area::updateOrCreate($areaData, $this->getNameArr($addressData->area));
            $currentAddress->area()->associate($area);
        }

        $settlementData = array_merge($this->getNameArr($currentAddress->settlement->name), [
            'area_id' => $currentAddress->area?->id,
            'region_id' => $currentAddress->region->id
        ]);
        $settlement = Settlement::updateOrCreate($settlementData, $this->getNameArr($addressData->settlement));
        $currentAddress->settlement()->associate($settlement);

        $streetData = array_merge($this->getNameArr($currentAddress->street->name), ['settlement_id' => $currentAddress->settlement->id]);
        $street = Street::updateOrCreate($streetData, $this->getNameArr($addressData->street));
        $currentAddress->street()->associate($street);

        $currentAddress->postal_code = $addressData->postal_code;
        $currentAddress->house = $addressData->house;
        $currentAddress->flat = $addressData->flat ?? $currentAddress->flat;
        $currentAddress->block = $addressData->block ?? $currentAddress->block;

        $currentAddress->save();

        return $currentAddress;
    }


    private function getNameArr(string $name): array
    {
        return [
            'name' => $name
        ];
    }

}
