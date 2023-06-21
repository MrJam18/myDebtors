<?php

namespace App\Services;

use App\Http\Requests\Base\ListRequestData;
use App\Http\Requests\PaginateRequest;
use App\Models\CommentFile;
use App\Services\AbstractServices\BaseService;
use App\Services\Components\CommentFileData;

class CommentFileService extends BaseService
{

    public function index (ListRequestData $request): array
    {

    }

    public function show () {

    }
    /**
     * @throws \Exception
     */
    public function create (string $data): CommentFile
    {
//
        $fileData = new CommentFileData($data);
        $file = new CommentFile();
        $file->url = $fileData->url;
        $file->save();
        return $file;
    }

    /**
     * @throws \Exception
     */
    public function update (CommentFile $file, string $data): void
    {
//        DB::
        $newFileData = new CommentFileData($data);
        $file->update(['url' => $newFileData->url]);
    }

    public function destroy (CommentFile $file): void
    {
        $file->delete();
    }
}
