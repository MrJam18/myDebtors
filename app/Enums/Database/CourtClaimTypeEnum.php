<?php
declare(strict_types=1);

namespace App\Enums\Database;

enum CourtClaimTypeEnum: int
{
    case CourtOrder = 1;
    case CourtClaim = 2;
}