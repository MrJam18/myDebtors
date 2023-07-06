<?php

declare(strict_types=1);

namespace App\Http\Controllers\Contract;

use App\Exceptions\ShowableException;
use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Http\Requests\PaginateRequest;
use App\Models\Contract\Contract;
use App\Models\Contract\ContractComment;
use App\Providers\ContractCommentsProvider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Exception;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\StreamedResponse;

class ContractCommentsController extends AbstractController
{
    /**
     * @throws Exception
     */
    public function getList(PaginateRequest $request, ContractCommentsProvider $provider, Contract $contract): array
    {
        $data = $request->validated();
        $paginator = $provider->getList($data, $contract);
        $list = $paginator->items()->map(function (ContractComment $comment) use ($contract) {
            $user = $comment->user_surname . ' ' . strtoupper(mb_substr($comment->user_name, 0, 1)) . '.';
            if($comment->user_patronymic) $user .= ' ' . strtoupper(mb_substr($comment->user_patronymic, 0, 1)) . '.';
            $returned = [
                'contract_comments.created_at' => $comment->created_at->format(RUS_DATE_TIME_FORMAT),
                'contract_comments.text' => $comment->text,
                'names.surname' => $user,
                'id' => $comment->id,
                'file_name' => $comment->file_name,
                'user_id' => $comment->user_id
            ];
            if($comment->file_name) $returned['file_url'] = "contract-comments/get-file/$comment->id";
            return $returned;
        });
        return $paginator->jsonResponse($list);
    }

    /**
     * @throws Exception
     */
    public function createOne(Request $request, Contract $contract): void
    {
        $data = $request->all();
        $comment = new ContractComment();
        $comment->contract()->associate($contract);
        $comment->text = $data['text'];
        $comment->user()->associate(Auth::user());
        $comment->save();
        if($file = $request->file('file')) {
            if($file->getSize() > 10485760) throw new ShowableException('Файл превышает размер в 10 мегабайт');
            $fileName = $comment->id . "__{$file->getClientOriginalName()}";
            $file->storeAs($this->getFileDir($contract), $fileName);
            $comment->file_name = $fileName;
            $comment->save();
        }
    }

    function getFile(Contract $contract, ContractComment $comment): StreamedResponse
    {
        return Storage::download($this->getFileDir($contract) . DIRECTORY_SEPARATOR . $comment->file_name);
    }

    function updateOne(Contract $contract, ContractComment $comment, Request $request): void
    {
        if($comment->user_id !== Auth::id()) throw new ShowableException('Вы не являетесь владельцем комментария и поэтому не можете изменить его');
        $data = $request->all();
        $comment->text = $data['text'];
        if($file = $request->file('file')) {
            if($file->getSize() > 10485760) throw new ShowableException('Файл превышает размер в 10 мегабайт');
            $fileDir = $this->getFileDir($contract);
            if($comment->file_name) {
                Storage::delete($fileDir . DIRECTORY_SEPARATOR . $comment->file_name);
            }
            $fileName = $comment->id . "__{$file->getClientOriginalName()}";
            $file->storeAs($fileDir, $fileName);
            $comment->file_name = $fileName;
        }
        elseif($comment->file_name) {
            Storage::delete($this->getFileDir($contract) . DIRECTORY_SEPARATOR . $comment->file_name);
            $comment->file_name = null;
        }
        $comment->save();
    }

    function deleteOne(ContractComment $comment): void
    {
        if($comment->user_id !== Auth::id()) throw new ShowableException('Только владелец комментария может удалить его');
        $comment->delete();
    }

    private function getFileDir(Contract $contract): string
    {
        return "contracts/$contract->id/comments";
    }
}
