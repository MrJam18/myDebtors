<?php
declare(strict_types=1);

namespace App\Services\Documents\Base\Builders;

use PhpOffice\PhpWord\Element\Section;
use PhpOffice\PhpWord\Element\Text;
use PhpOffice\PhpWord\Style\Tab;

class DocFooterBuilder extends BaseBuilder
{
    public function __construct(Section $section)
    {
        parent::__construct($section);
    }

    function addRow(string $text): Text
    {
       return $this->section->addText("- $text;", null, ['indentation' => ['left' => 100]]);
    }
    function addHeader(string $text): Text
    {
        return $this->section->addText($text, ['bold' => true], ['spaceBefore' => 300]);
    }


}