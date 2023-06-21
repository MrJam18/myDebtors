<?php
declare(strict_types=1);

namespace App\Services\Documents;

use App\Models\Contract\IpInitStatement;
use App\Services\Documents\Base\DocumentService;
use App\Services\Documents\Views\IpInitDocView;

class IpInitStatementDocument extends DocumentService
{
    public function __construct(IpInitStatement $statement)
    {
        parent::__construct();
        $this->view = new IpInitDocView($statement);
        $this->view->buildDocument();
    }

}