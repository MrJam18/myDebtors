<?php
declare(strict_types=1);

namespace App\Services\Documents\Views\Base\Builders;


use App\Models\Passport\Passport;
use PhpOffice\PhpWord\Element\Section;
use PhpOffice\PhpWord\Element\Text;
use PhpOffice\PhpWord\SimpleType\Jc;

class DocHeadBuilder extends BaseBuilder
{
    private array $headParagraph;

    public function __construct(Section $section)
    {
        parent::__construct($section);
        $this->headParagraph = [
            'alignment' => Jc::END,
            'indentation' => [
                'left' => 4000,
            ],
            'spaceBefore' => 1,
            'spaceAfter' => 1
        ];
    }

    function addRow(string $text): Text
    {
        return $this->section->addText($text, null, $this->headParagraph);
    }

    function addAddress(string $address): Text
    {
        return $this->addRow('Адрес: ' . $address);
    }

    function addPassport(Passport $passport)
    {
        $this->addRow('Паспорт: серия ' . $passport->series . ' № ' . $passport->number);
    }

}