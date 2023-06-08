<?php
declare(strict_types=1);

namespace App\Services\Documents\Views\Base\Builders;

use PhpOffice\PhpWord\Element\Section;
use PhpOffice\PhpWord\Element\Text;
use PhpOffice\PhpWord\SimpleType\Jc;

class DocBodyBuilder extends BaseBuilder
{
    private array $indentParagraphStyle;

    public function __construct(Section $section)
    {
        parent::__construct($section);
        $this->indentParagraphStyle = [
            'indentation' => ['firstLine' => 800],
            'alignment' => Jc::BOTH
        ];
    }


    function addRow(string $text): Text
    {
        return $this->section->addText($text, null, ['alignment' => Jc::BOTH]);
    }

    function addIndentRow(string $text): Text
    {
        return $this->section->addText($text, null, $this->indentParagraphStyle);
    }

    function addHeader(string $header): Text
    {
        return $this->section->addText($header . '.', ['bold' => true], [
            'spaceBefore' => 200,
            'alignment' => Jc::CENTER,
        ]);
    }
    function addNoSpaceHeader(string $header): Text
    {
        return $this->section->addText($header, ['bold' => true], [
            'alignment' => Jc::CENTER,
        ]);
    }
}