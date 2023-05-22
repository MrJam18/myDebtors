<?php
declare(strict_types=1);

namespace App\Providers\Database\AbstractProviders\Components\enums;

enum CompareOperator: string
{
    case More = '>';
    case Less = '<';
    case Equals = '=';
    case MoreOrEquals = '>=';
    case LessOrEquals = '<=';
    case NotEquals = '!=';
}
