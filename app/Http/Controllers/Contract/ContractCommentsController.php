<?php

declare(strict_types=1);

namespace App\Http\Controllers\Contract;

use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Http\Requests\PaginateRequest;
use App\Models\Contract\Contract;
use App\Models\Contract\ContractComment;
use App\Models\CommentFile;
use App\Models\Subject\People\Name;
use App\Providers\Database\Contracts\ContractCommentsProvider;
use App\Services\CommentFileService;
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
    public function index(PaginateRequest $request, ContractCommentsProvider $provider, Contract $contract): array | JsonResponse
    {
        $data = $request->validated();
        $paginator = $provider->getList($data, $contract);

        $list = $paginator->items()->map(function (ContractComment $comment) {
            return [
                'created_at' => $comment->created_at->format(RUS_DATE_FORMAT),
                'text' => $comment->comments,
                'author' => Name::find($comment->user->id)->name,
                'comment_file'=> CommentFile::find($comment->file->id)->url,
                'idd' => $comment->id
            ];
        });
        return $paginator->jsonResponse($list);
    }

//    function createFile
    public function create(Request $request): JsonResponse
    {
        $data = $request->all();

            $groupId = getGroupId();
            $comment = new ContractComment();
            $comment->comments = $data['comment'];
            $comment->user()->associate(Auth::user());
            $contract = Contract::query()->byGroupId($groupId)->find(['contractId'], ['id']);
            if(!$contract) throw new Exception('cant find contract');
            $comment->contract()->associate($contract);
            $file = CommentFile::query()->find($data['CommentFileId'], ['id']);
            if(!$file) throw new Exception('cant find comment file');
//            $comment->file()->associate(optional($file));
            $comment->save();

        return response()->json(['success' => 'Comment created'], 200);
    }

    /**
     * @throws Exception
     */
    public function show($id): array | JsonResponse
    {
        $commentId = (int)$id;
        /**
         * @var ContractComment $comment;
         */
        $comment = ContractComment::findWithGroupId($commentId);

        return [
                    'text' => $comment->comments,
                    'comment_file' => $comment->file,
                    'idd' => $comment->id,
            ];
    }

    /**
     * @throws Exception
     */
    public function update(Request $request): JsonResponse
    {
        $data = $request->all();
        $comment = ContractComment::query()->find(['id']);
        if(!$comment) throw new Exception('cant find contractComment');
        $comment->comment = $data['comment'];
        $comment->contract = Contract::query()->find($data['contract_id'], ['id']);
        if (isset($data['comment_file_id'])) $comment->file = CommentFile::query()->find($data['comment_file_id'], ['id']);
        $comment->update();
        return response()->json(['success' => 'Comment updated'], 200);
    }

    /**
     * @throws Exception
     */
    public function destroy(ContractComment $comment): JsonResponse
    {
        if (isset($comment->file)) CommentFileService::query()->find($comment->file)->delete();
        $comment->delete();
        return response()->json(['success' => 'Comment deleted'], 200);
    }
}
