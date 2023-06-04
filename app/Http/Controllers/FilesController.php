<?php

namespace App\Http\Controllers;

use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Http\Requests\PaginateRequest;
use Illuminate\Http\Request;

class FilesController extends AbstractController
{
    public function show(PaginateRequest $request, FilesP $controller) {

        $data = $request->validated();
        $paginator = $provider->getList($data);
        return $paginator->items()->map(function (ContractComment $comment) {
            return [
                'id' => $comment->id,
                'comment' => $comment->comment,
                'user' => $comment->user,
                'contract' => $comment->contract,
                'file' => $comment->file,
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
