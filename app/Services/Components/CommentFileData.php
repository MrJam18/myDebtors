<?php
declare(strict_types=1);

namespace App\Services\Components;

use App\Http\Requests\Base\ListRequestData;
use App\Models\Base\CustomPaginator;
use App\Models\CommentFile;
use App\Providers\Database\AbstractProviders\AbstractProvider;
use Exception;
use Illuminate\Support\Arr;

class CommentFileData extends AbstractProvider
{
     /**
     * @throws Exception
     */
    public function __construct(?string $data)
    {
        parent::__construct();
        $this->model = CommentFile::class;

    }

    /**
     * @throws Exception
     */
    public function getUrl (string $data): array
    {
        return [
            'url' => $data
        ];
    }
}
