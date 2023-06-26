<?php
declare(strict_types=1);

namespace App\Enums\Database;

enum ExecutiveDocTypeEnum: int
{
    case CourtOrder = 1;
    case ReceivingOrder = 2;
}