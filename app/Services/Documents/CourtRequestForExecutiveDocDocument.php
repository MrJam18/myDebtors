<?php
declare(strict_types=1);

namespace App\Services\Documents;

use App\Models\CourtClaim\CourtClaim;
use App\Services\Documents\Base\DocumentService;
use App\Services\Documents\Views\CourtRequestForExecutiveDocDocViewCourt;

class CourtRequestForExecutiveDocDocument extends DocumentService
{
    public function __construct(CourtClaim $claim)
    {
        $this->view = new CourtRequestForExecutiveDocDocViewCourt($claim);
        $this->view->buildDocument();
    }

}