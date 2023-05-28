<?php
declare(strict_types=1);

namespace App\Http\Controllers\AbstractControllers;

use App\Exceptions\ShowableException;
use Closure;
use Exception;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Routing\Controller;

class AbstractController extends Controller
{
    function log(string $message): void
    {
        error_log($message);
    }

    /**
     * @throws Exception
     */
    function getFormData(?string $key = null): array|string|null
    {
        $data = request()->input('formData');
        if ($data) {
            if ($key) return $data[$key];
            else return $data;
        }
        throw new Exception('cant get form data');
    }

    function exceptionIfNull(mixed &$data, $message = 'data is null'): void
    {
        if (!$data) throw new Exception($message);
    }

    function transaction(Request $request, Closure $callback): mixed
    {
        $data = $request->all();
        $formData = null;
        if (isset($data['formData'])) $formData = $data['formData'];
        return $callback($data, $formData);
    }

    function throwExceptionIfGroupDontCompared(Model $model): void
    {
        $groupId = $model->user->group->id;
        if ($groupId !== getGroupId()) {
            throw new ShowableException('У вас нет прав на получение/изменение данной сущности');
        }
    }
}
