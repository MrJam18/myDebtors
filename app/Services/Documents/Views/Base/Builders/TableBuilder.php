<?php
declare(strict_types=1);

namespace App\Services\Documents\Views\Base\Builders;

use App\Models\MoneySum;
use Illuminate\Support\Collection;
use PhpOffice\PhpWord\Element\Row;
use PhpOffice\PhpWord\Element\Section;
use PhpOffice\PhpWord\Element\Table;

abstract class TableBuilder extends BaseBuilder
{
    protected Table $table;
    protected array $defaultCellStyle;
    protected array $defaultFontStyle;
    protected MoneySum $sums;
    protected float $percent;
    public function __construct(Section $section, MoneySum $sums, float $percent)
    {
        parent::__construct($section);
        $this->sums = $sums;
        $this->percent = $percent;
    }

    function addRow(Collection $cells, ?array $cellStyle = null, ?array $fontStyle = null, ?array $rowStyle = null, ?int $width = null): Row
    {
        if(!$fontStyle) $fontStyle = $this->defaultFontStyle;
        if(!$cellStyle) $cellStyle = $this->defaultCellStyle;
        $row = $this->table->addRow(500, $rowStyle);
        $cells->each(function (string $cell) use($row, &$cellStyle, &$fontStyle, $width) {
            $row->addCell($width, $cellStyle)->addText($cell, $fontStyle);
        });
        return $row;
    }
    protected function addTextCell(string $text, ?array $cellStyle = null, ?array $fontStyle = null, ?int $width = null)
    {
        if(!$cellStyle) $cellStyle = $this->defaultCellStyle;
        if(!$fontStyle) $fontStyle = $this->defaultFontStyle;
        $this->table->addCell($width, $cellStyle)->addText($text, $fontStyle);
    }
    function setTable(Table $table): void
    {
        $this->table = $table;
    }
}