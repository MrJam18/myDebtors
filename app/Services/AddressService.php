<?php
declare(strict_types=1);

namespace App\Services;

use App\Exceptions\ShowableException;
use App\Models\Address\Address;
use App\Models\Address\Area;
use App\Models\Address\Country;
use App\Models\Address\Region;
use App\Models\Address\Settlement;
use App\Models\Address\Street;
use App\Services\AbstractServices\BaseService;
use App\Services\Components\AddressData;
use Illuminate\Support\Facades\Http;

class AddressService extends BaseService
{
    function addAddress(array $addressData): Address
    {
        $addressData = new AddressData($addressData);
        $address = new Address();
        $country = Country::firstOrCreate($this->getNameArr($addressData->country));
        $address->country()->associate($country);
        $region = Region::firstOrCreate($this->getNameArr($addressData->region), ['country_id' => $address->country->id]);
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
        if($addressData->postal_code)$address->postal_code = $addressData->postal_code;
        $address->house = $addressData->house;
        if($addressData->flat) $address->flat = $addressData->flat;
        if($addressData->block) $address->block = $addressData->block;
        $address->save();
        return $address;
    }

    function getAddressFromString(string $addressString): Address
    {
        $headers = [
            'Content-Type' => 'application/json',
            'Authorization' => 'Token 56f00db2c366abb68541863cad53bbee37215ef6',
            'X-Secret' => 'd7956304aa07578ba3ce1222cd1f80fe1f6d6c12'
        ];
        $response = Http::withHeaders($headers)->post('https://cleaner.dadata.ru/api/v1/clean/address', [$addressString]);
        if($response->status() !== 200) throw new ShowableException('Ошибка при разборе адреса: ' . $addressString);
        $data = $response->json();
        if(!$data || !$data[0]) throw new ShowableException('Не могу найти такой адрес: ' . $addressString);
        $data = $data[0];
        if(!$data['house']) throw new ShowableException('Адрес указан не до дома: ' . $addressString);
        $addressData = [
            'country' => $data['country'],
            'region' => $data['region_with_type'],
            'area' => $data['area_with_type'],
            'settlement' => $data['city_with_type'] ?? $data['settlement_with_type'],
            'street' => $data['street_with_type'] ?? $data['settlement_with_type'],
            'house' => "{$data['house_type']} {$data['house']}",
            'flat' => $data['flat'] ? "{$data['flat_type']} {$data['flat']}" : null,
            'block' => $data['block'] ? "{$data['block_type']} {$data['block']}" : null,
            'postal_code' => $data['postal_code']
        ];
        return $this->addAddress($addressData);

    }


    private function getNameArr(string $name): array
    {
        return [
            'name' => $name
        ];
    }

}
