<?php
declare(strict_types=1);

namespace App\Http\Requests\Base;

class FilterElement
{
    public string $key;
    public string $operator;
    public string $value;

    public function __construct(array $data)
    {
        $this->key = $data['key'];
        $this->operator = $data['operator'];
        $this->value = $data['value'];
    }
}