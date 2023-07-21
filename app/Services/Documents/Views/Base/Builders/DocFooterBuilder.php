<?php
declare(strict_types=1);

namespace App\Services\Documents\Views\Base\Builders;

use PhpOffice\PhpWord\Element\Section;
use PhpOffice\PhpWord\Element\Text;
use PhpOffice\PhpWord\Style\Tab;

class DocFooterBuilder extends BaseBuilder
{
    protected array $pStyle = [
        'spaceBefore' => 20,
        'spaceAfter' => 20,
        'indentation' => ['left' => 100]
    ];
    public function __construct(Section $section)
    {
        parent::__construct($section);

    }

    function addRow(string $text): Text
    {
       return $this->section->addText("- $text;", null, $this->pStyle);
    }
    function addHeader(string $text): Text
    {
        return $this->section->addText($text, ['bold' => true], [
            'spaceBefore' => 300,
            'spaceAfter' => 20
        ]);
    }
    function addSignature(string $initials): Text
    {
        $now = now()->format(RUS_DATE_FORMAT);
        return $this->section->addFooter()->addText("$now г.\t_____________ $initials", null, [
            'tabs' => [new Tab('right', 9090)],
        ]);
    }


}