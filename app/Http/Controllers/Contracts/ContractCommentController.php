<?php

declare(strict_types=1);

namespace App\Http\Controllers\Contracts;

use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Http\Requests\PaginateRequest;
use App\Models\Contract\Contract;
use App\Models\Contract\ContractComment;
use App\Models\File;
use App\Providers\Database\Contracts\ContractCommentsProvider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Exception;

class ContractCommentController extends AbstractController
{

    public function create(Request $request): JsonResponse
    {
        $data = $request->all();
        DB::transaction(function () use (&$data){
            $comment = new ContractComment();
            $comment->comment = $data['comment'];
            $comment->user()->associate(Auth::user());
            $comment->contract()->associate(new Contract(['id' => $data['contractId']]));
            $comment->file()->associate(new File(['id' => $data['fileId']]));
            $comment->save();
        });
        return response()->json(['success' => 'Comment created'], 200);
    }

    /**
     * @throws Exception
     */
    public function show(PaginateRequest $request, ContractCommentsProvider $provider): array
    {
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

    public function update(Request $request): JsonResponse
    {
        $data = $request->all();
        DB::transaction(function () use (&$data) {
            $comment = ContractComment::find($data['id']);
            $comment->comment = $data['comment'];
            $comment->contract = $data['contract_id'];
            $comment->file = $data['file_id'];
            $comment->update();
        });
        return response()->json(['success' => 'Comment updated'], 200);
    }

    /**
     * @throws Exception
     */
    public function destroy($id): JsonResponse
    {
        $comment = ContractComment::query()->find($id);
        if(!$comment) throw new Exception('cant find comment by id ' . $id);
        $comment->delete();
        return response()->json(['success' => 'Comment deleted'], 200);
    }
}
