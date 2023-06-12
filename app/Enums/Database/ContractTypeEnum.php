<?php
declare(strict_types=1);

namespace App\Enums\Database;

enum ContractTypeEnum: int
{
    case Loan = 1;
    case Credit = 2;
}