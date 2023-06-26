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
            if($comment->file) $file = CommentFile::find($comment->file->id)->url;
            $fileStatus = 'X';
            if (isset($file)) $fileStatus = 'V';
            return [
                'created_at' => $comment->created_at->format(RUS_DATE_FORMAT),
                'text' => $comment->comments,
                'author' => Name::find($comment->user->id)->name,
                'comment_file'=> $fileStatus,
                'idd' => $comment->id
            ];
        });
        return $paginator->jsonResponse($list);
    }

//    function createFile

    /**
     * @throws Exception
     */
    public function create(Request $request): void
    {
        $data = $request->all();
            $comment = new ContractComment();
            $comment->contract()->associate(Contract::findWithGroupId((int)$data['id']));
            $comment->comments = $data['commentText'];
            $comment->user()->associate(Auth::user());
//            $file = CommentFile::find($data['file']);
//            if($file) $comment->file()->associate(optional($file));
            $comment->save();

//        return response()->json(['success' => 'Comment created'], 200);
    }

    /**
     * @throws Exception
     */
    public function show($id): array | JsonResponse
    {
        $comment = ContractComment::find((int)$id);

        return [
                    'text' => $comment->comments,
            ];
    }

    /**
     * @throws Exception
     */
    public function update(Request $request): JsonResponse
    {
        $data = $request->all();
        $comment = ContractComment::findWithGroupId((int)$data['id']);
        if(!$comment) throw new Exception('cant find contractComment');
        $comment->comments = $data['value'];
        $comment->save();
        return response()->json(['success' => 'Comment updated'], 200);
    }

    /**
     * @throws Exception
     */
    public function delete($id): void
    {
        ContractComment::destroy($id);
    }
}
