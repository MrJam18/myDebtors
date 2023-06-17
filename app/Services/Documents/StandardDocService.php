<?php
declare(strict_types=1);

namespace App\Services\Documents;

use App\Services\Documents\Base\DocumentService;
use App\Services\Documents\Views\Base\BaseDocView;

class StandardDocService extends DocumentService
{
    public function __construct(BaseDocView $view)
    {
        parent::__construct();
        $this->view = $view;
        $view->buildDocument();
    }

}