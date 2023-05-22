<?php
declare(strict_types=1);

namespace App\Enums\Database;

enum PassportTypesEnum: int
{
    case Russian = 1;
    case Foreign = 2;
    case International = 3;
    case ResidentCard = 4;
    case Shelter = 5;
}
