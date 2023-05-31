<?php
declare(strict_types=1);

use Illuminate\Support\Facades\Auth;

/**
 * @throws Exception
 */
function getGroupId(): int
{
    $user = Auth::user();
    if (!$user) throw new Exception('cant get groupId');
    return $user->group_id;
}
