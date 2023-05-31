<?php
declare(strict_types=1);

namespace App\Models\Base;

use Illuminate\Support\Collection;
use Illuminate\Pagination\LengthAwarePaginator;


class CustomPaginator extends LengthAwarePaginator
{
    function jsonResponse(array | Collection | null $list = null): array
    {
        return [
            'list' => $list ?? $this->items(),
            'totalItems' => $this->total,
            'totalPages' => $this->lastPage
        ];
    }

    function items(): Collection
    {
        return new Collection(parent::items());
    }
}