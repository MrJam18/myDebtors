<?php
declare(strict_types=1);

namespace App\Services\Documents\Views\Claims;

use App\Models\CourtClaim\CourtClaim;
use App\Services\Counters\CreditCountService;
use App\Services\Documents\Views\Base\Builders\DocBodyBuilder;
use App\Services\Documents\Views\CountingTables\CreditCountPenaltiesTable;

abstract class CreditClaimDocView extends ClaimDocView
{

    public function __construct(CourtClaim $claim, CreditCountService $countService)
    {
        parent::__construct($claim, $countService);
        $this->penaltiesTable = new CreditCountPenaltiesTable($this->tableSection, $this->contract, $countService->getPenaltyBreaks());
    }

    protected function buildBody(DocBodyBuilder $builder): void
    {
        $builder->addHeader($this->claim->type->name);
        $builder->addIndentRow(
            "{$this->contract->issued_date->format(RUS_DATE_FORMAT)} г. {$this->firstCreditor->name} (далее - 'Заимодавец') и {$this->debtor->name->getFull()} (далее - 'Должник') заключили кредитный договор № {$this->contract->number} (далее - 'Договор'). В соответствии с условиями договора заимодавец передал должнику денежную сумму в размере {$this->contract->issued_sum} рублей сроком до {$this->contract->due_date->format(RUS_DATE_FORMAT)} г., а Должник обязался возвратить такую же сумму денег и уплатить проценты в размере {$this->contract->percent} % годовых от суммы займа."
        );
        $builder->addIndentRow(
            "Кроме того, согласно договору, должник обязался {$this->contract->month_due_date} числа каждого месяца оплачивать задолженность по договору равными платежами в размере {$this->contract->month_due_sum} рублей."
        );
        $builder->addIndentRow($this->contract->issued_date->format(RUS_DATE_FORMAT) . ' г. должник денежную сумму по договору получил, что подтверждается расходным кассовым ордером.');
        $builder->addIndentRow('До настоящего времени задолженность по договору не оплачена. Кроме того, должник пропустил сроки оплаты основного долга и процентов, предусмотренных договором.');
        $builder->addIndentRow('Также, согласно условиям договора “за неисполнение или ненадлежащее исполнение заемщиком обязательства по возврату займа и уплате процентов на сумму займа начисляется неустойка в размере ' . $this->contract->penalty . ' % процентов годовых от суммы неисполненного обязательства за каждый день просрочки с даты, следующей за датой наступления исполнения обязательства, установленной договором займа, по дату погашения просроченной задолженности.');
        $builder->addIndentRow('Так, по п.1 ст. 330 ГК РФ "Неустойкой (штрафом, пеней) признается определенная законом или договором денежная сумма, которую должник обязан уплатить кредитору в случае неисполнения или ненадлежащего исполнения обязательства, в частности в случае просрочки исполнения. По требованию об уплате неустойки кредитор не обязан доказывать причинение ему убытков."');
        $builder->addIndentRow('На ' . $this->claim->count_date->format(RUS_DATE_FORMAT) . ' г. сумма задолженности по договору, с учетом ограничений размера процентов и неустойки, установленных ст. 12.1 Федерального закона от 02.07.2010 N 151-ФЗ, составляет:');
    }
}