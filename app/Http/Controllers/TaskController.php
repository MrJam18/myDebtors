<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Models\Auth\User;
use Illuminate\Database\Query\Builder;

class TaskController extends AbstractController
{
    function getList(): array
    {
        Author::query()->whereIn('authors.id', function (Builder $builder) {
            $builder->select('book_to_author.author_id')
                ->from('book_to_author');
        }, not: true)->get();
    }
}
