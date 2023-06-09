<?php
declare(strict_types=1);

namespace App\Enums\Database;

enum ActionObjectEnum: int
{
    case CourtOrder = 1;
    case Payment = 2;
    case IssuedDate = 3;
    case DueDate = 4;
    case IssuedSum = 5;
    case Percent = 6;
    case Penalty = 7;
    case Number = 8;
    case Comment = 9;
    case CourtClaim = 10;
    case Status = 11;
    case EnforcementProceedingStatement = 12;
    case Contract = 13;
    case File = 14;

}