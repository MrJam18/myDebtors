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
            'alignment' => Jc::BOTH,
            'spaceBefore' => 20,
            'spaceAfter' => 20
        ];
    }


    function addRow(string $text): Text
    {
        $pStyle = $this->indentParagraphStyle;
        unset($pStyle['indentation']);
        return $this->section->addText($text, null, $pStyle);
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
            'spaceAfter' => 20
        ]);
    }
    function addNoSpaceHeader(string $header): Text
    {
        return $this->section->addText($header, ['bold' => true], [
            'alignment' => Jc::CENTER,
            'spaceBefore' => 20,
            'spaceAfter' => 20
        ]);
    }
    function addAskHeader(string $text): Text
    {
        $returned = $this->addIndentRow($text);
        $this->addNoSpaceHeader('Прошу:');
        return $returned;
    }
}