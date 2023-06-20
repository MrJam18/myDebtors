<?php
declare(strict_types=1);

namespace App\Enums;

enum LoadEntityEnum: int
{
    case Debtors = 1;
    case Contracts = 2;
    case ExecutiveDocs = 3;
    case EnforcementProceedings = 4;
}