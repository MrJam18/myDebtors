<?php
declare(strict_types=1);

namespace App\Http\Requests\Base;

use App\Providers\Database\AbstractProviders\Components\OrderBy;

class ListRequestData
{

    public function __construct(
        public int $page,
        public int $perPage,
        public ?OrderBy $orderBy = null,
        public ?string $search = null
    )
    {

    }
}