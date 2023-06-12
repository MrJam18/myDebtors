<?php
declare(strict_types=1);

namespace App\Enums\Database;

enum ActionTypeEnum: int
{
    case Create = 1;
    case Add = 2;
    case Delete = 3;
    case Change = 4;

}