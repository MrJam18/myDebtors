<?php
declare(strict_types=1);

namespace App\Providers\Database\AbstractProviders\Components;

use App\Providers\Database\AbstractProviders\Components\enums\OrderDirection;

class OrderBy
{
    public function __construct(
        public string $column,
        public OrderDirection $direction
    )
    {
    }
}
