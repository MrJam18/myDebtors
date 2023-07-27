<?php
declare(strict_types=1);

namespace App\Enums\Database;

enum ContractStatusEnum: int
{
    case DontReady = 1;
    case FilesWaiting = 2;
    case CourtOrderSent = 4;
    case CourtOrderReceived = 5;
    case CourtOrderCanceled = 6;
    case CourtClaimSent = 7;
    case Decision = 8;
    case DecisionReceived = 9;
    case RefusalDecision = 10;
    case AppealSent = 11;
    case AppealRejected = 12;
    case AppealSatisfied = 13;
    case ExecutiveDocumentReceived = 14;
    case ExecutiveDocumentSent = 15;
    case EnforcementProceedingInitiated = 16;
    case EnforcementProceedingFinishedWithoutExecution = 17;
    case EnforcementProceedingFinishedWithExecution = 18;
}