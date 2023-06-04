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

class ContractCommentsController extends AbstractController
{
    /**
     * @throws Exception
     */
    public function index(PaginateRequest $request, ContractCommentsProvider $provider): array | JsonResponse
    {
        $data = $request->validated();
        $paginator = $provider->getList($data);

        $list = $paginator->items()->map(function (ContractComment $comment) {
            return [
                'id' => $comment->id,
                'comment' => $comment->comment,
                'contractId' => $comment->contract,
                'userId' => $comment->user,
                'fileId'=> $comment->file,
                'createdAt'=>$comment->created_at->format(RUS_DATE_FORMAT),
                'updatedAT'=>$comment->updated_at->format(RUS_DATE_FORMAT),
            ];
        });
        return $paginator->jsonResponse($list);
    }

    public function create(Request $request): JsonResponse
    {
        $data = $request->all();

        DB::transaction(function () use (&$data){
            $groupId = getGroupId();
            $comment = new ContractComment();
            $comment->comment = $data['comment'];
            $comment->user()->associate(Auth::user());
            $contract = Contract::query()->byGroupId($groupId)->find(['contractId'], ['id']);
            if(!$contract) throw new Exception('cant find contract');
            $comment->contract()->associate($contract);
            $file = File::query()->byGroupId($groupId)->find($data['fileId'], ['id']);
            $comment->file()->associate(optional($file));
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

    /**
     * @throws Exception
     */
    public function update(Request $request): JsonResponse
    {
        $data = $request->all();
        DB::transaction(function () use (&$data) {
            $comment = ContractComment::query()->find(['id']);
            if(!$comment) throw new Exception('cant find contractComment');
            $comment->comment = $data['comment'];
            $comment->contract = Contract::query()->find($data['contract_id'], ['id']);
            $comment->file = optional(File::query()->find($data['file_id'], ['id']));
            $comment->update();
        });
        return response()->json(['success' => 'Comment updated'], 200);
    }

    /**
     * @throws Exception
     */
    public function destroy(ContractComment $comment): JsonResponse
    {
        $comment->delete();
        $comment->file?->delete();
        return response()->json(['success' => 'Comment deleted'], 200);
    }
}
