<?php
declare(strict_types=1);

namespace App\Services\Documents;

use PhpOffice\PhpWord\SimpleType\Jc;
use PhpOffice\PhpWord\Style\Indentation;

class TestDocument
{
    function test()
    {
        $phpWord = new \PhpOffice\PhpWord\PhpWord();

        /* Note: any element you append to a document must reside inside of a Section. */

// Adding an empty Section to the document...
        $section = $phpWord->addSection();
        $table = $section->addTable();
        $table->addRow();
        $table->addCell(1000)->addText('bigTest');
        $table->addCell(300)->addText('smallTest');
        $headers = [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
//            'Content-Length' => $validated['size'],
            'Content-Transfer-Encoding' => 'binary',
            'Content-Disposition' => 'attachment; filename=' . 'test',
        ];
// Saving the document as OOXML file...
        $objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord);
        return response()->streamDownload(function () use ($objWriter) {
            $objWriter->save('php://output');
        }, 'test', $headers);
    }
}