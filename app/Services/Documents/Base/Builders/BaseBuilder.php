<?php
declare(strict_types=1);

namespace App\Services\Documents\Base\Builders;

use PhpOffice\PhpWord\Element\Section;
use PhpOffice\PhpWord\Element\Text;
use PhpOffice\PhpWord\Style\Tab;

abstract class BaseBuilder
{
    protected Section $section;

    public function __construct(Section $section)
    {
        $this->section = $section;
    }


}