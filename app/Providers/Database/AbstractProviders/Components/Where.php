<?php
declare(strict_types=1);

namespace App\Providers\Database\AbstractProviders\Components;

use App\Providers\Database\AbstractProviders\Components\enums\CompareOperator;

class Where
{


    public function __construct(
        public string $column,
        public string $value,
        public CompareOperator $operator = CompareOperator::Equals,
    )
    {
    }
}
