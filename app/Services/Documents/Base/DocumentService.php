<?php
declare(strict_types=1);

namespace App\Services\Documents\Base;

use App\Services\Documents\Views\Base\BaseDocView;
use PhpOffice\PhpWord\IOFactory;
use Symfony\Component\HttpFoundation\StreamedResponse;

abstract class DocumentService
{
    protected BaseDocView $view;

    public function __construct()
    {

    }

    function getFileResponse(string $name = 'Документ'): StreamedResponse
    {
        $headers = [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'Content-Transfer-Encoding' => 'binary',
        ];
        $objWriter = IOFactory::createWriter($this->view->getDocument());
        return response()->streamDownload(function () use ($objWriter) {
            $objWriter->save('php://output');
        }, $name . '.docx', $headers);
    }
}