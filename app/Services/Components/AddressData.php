<?php
declare(strict_types=1);

namespace App\Services\Components;

use Exception;

class AddressData
{
    public string $country;
    public string $region;
    public ?string $area;
    public string $settlement;
    public string $street;
    public string $house;
    public ?string $flat;
    public ?string $block;
    public string $postal_code;

    /**
     * @throws Exception
     */
    public function __construct(array $data)
    {
        $this->checkEmpty($data['country']);
        $this->checkEmpty($data['region']);
        $this->checkEmpty($data['settlement']);
        $this->checkEmpty($data['street']);
        $this->checkEmpty($data['house']);
        $this->checkEmpty($data['postal_code']);
        $this->country = $data['country'];
        $this->region = $data['region'];
        $this->area = $data['area'];
        $this->settlement = $data['settlement'];
        $this->street = $data['street'];
        $this->house = $data['house'];
        $this->flat = $data['flat'];
        $this->block = $data['block'];
        $this->postal_code = $data['postal_code'];
    }

    /**
     * @throws Exception
     */
    private function checkEmpty(string $data): void
    {
        if (empty($data)) throw new Exception('address data not defined');
    }


}
