<?php
declare(strict_types=1);

namespace App\Enums\Database;

enum CreditorTypeEnum: int
{
    case MFO = 1;
    case Bank = 2;
    case Individual = 3;
    case Collector = 4;
}