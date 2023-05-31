<?php
declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Controllers\AbstractControllers\AbstractController;
use App\Models\Contract\Contract;
use App\Models\CourtClaim\CourtClaim;
use App\Models\CourtClaim\CourtClaimStatus;
use App\Models\CourtClaim\CourtClaimType;
use App\Models\Subject\Court\Court;
use App\Models\Subject\People\Agent;
use Illuminate\Http\Request;

class DocumentsController extends AbstractController
{
    function createCourtOrder(Request $request)
    {
        $data = $request->all();
        $courtClaim = new CourtClaim();
        $courtClaim->type()->associate(CourtClaimType::find(1));
        $courtClaim->status()->associate(CourtClaimStatus::find(1));
        $courtClaim->court()->associate(Court::find($data['court_id']));
        $courtClaim->contract()->associate(Contract::findWithGroupId($data['contract_id']));
        $courtClaim->agent()->associate(Agent::findWithGroupId($data['agent_id']));
        $courtClaim->count_date = $data['count_date'];
    }
}