<?php

namespace App\Providers\Database;

use App\Http\Requests\Base\ListRequestData;
use App\Models\Base\CustomPaginator;
use App\Models\File;
use App\Providers\Database\AbstractProviders\AbstractProvider;
use Illuminate\Support\ServiceProvider;

class FilesProvider extends AbstractProvider
{

    public function __construct()
    {
        parent::__construct();
        $this->model = File::class;
    }

    /**
     * @throws \Exception
     */
    function getList(ListRequestData $data): CustomPaginator
    {
        return $this->byGroupId(getGroupId(), $data->orderBy)
            ->paginate($data->perPage, page: $data->page);
    }

    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
