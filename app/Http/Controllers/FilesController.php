<?php

namespace App\Http\Controllers;

use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Http\Requests\PaginateRequest;
use App\Models\Contract\ContractComment;
use App\Models\File;
use App\Providers\Database\FilesProvider;
use Illuminate\Http\Request;

class FilesController extends AbstractController
{
    /**
     * @throws \Exception
     */
    public function show(PaginateRequest $request, FilesProvider $provider) {

        $data = $request->validated();
        $paginator = $provider->getList($data);
        return $paginator->items()->map(function (File $file) {
            return [
                'id' => $file->id,
                'comment' => $file->url,
                ];
        });
    }

    public function create(Request $request) {

    }

    public function update(Request$request) {

    }

    public function destroy (Request $request) {

    }
}
