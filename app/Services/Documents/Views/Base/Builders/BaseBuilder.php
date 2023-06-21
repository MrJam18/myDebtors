<?php
declare(strict_types=1);

namespace App\Services\Documents\Views\Base\Builders;

use PhpOffice\PhpWord\Element\Section;

abstract class BaseBuilder
{
    protected Section $section;

    public function __construct(Section $section)
    {
        $this->section = $section;
    }


}