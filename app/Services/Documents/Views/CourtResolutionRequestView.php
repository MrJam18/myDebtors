<?php
declare(strict_types=1);

namespace App\Services\Documents\Views;

use App\Enums\Database\CourtClaimTypeEnum;
use App\Models\CourtClaim\CourtClaim;
use App\Services\Documents\Views\Base\Builders\DocBodyBuilder;

class CourtResolutionRequestView extends CourtStatementView
{
    protected CourtClaim $claim;
    public function __construct(CourtClaim $claim)
    {
        $this->claim = $claim;
        $this->debtor = $claim->contract->debtor;
        $this->contract = $claim->contract;
        $this->creditor = $this->contract->creditor;
        $this->court = $claim->court;
        parent::__construct($claim->agent,  defaultFontSize: 12);
    }


    protected function buildBody(DocBodyBuilder $builder): void
    {
        if($this->claim->type->id === CourtClaimTypeEnum::CourtOrder->value) {
            $wasDecision = 'вынесен судебный приказ';
        }
        else {
            $wasDecision = 'вынесено решение';
        }
        $builder->addHeader('Ходатайство');
        $builder->addIndentRow("{$this->claim->status_date->format(RUS_DATE_FORMAT)} г. в ваш суд было подано {$this->claim->type->name} о взыскании задолженности по {$this->contract->type->dativeIncline()} №{$this->contract->number} от {$this->contract->issued_date->format(RUS_DATE_FORMAT)} г. с {$this->debtor->name->getFullGenitive()} в пользу {$this->creditor->getGenitiveName()}. В настоящее время у заявителя отсутствует информация о движении данного дела. На сайте суда информация также отсутствует.");
        if($this->claim->type->id === CourtClaimTypeEnum::CourtClaim->value) {
            $builder->addIndentRow('Так, п. 1 ст. 154 ГПК РФ предусмотрено следующее:');
            $builder->addIndentRow('"1. Гражданские дела рассматриваются и разрешаются судом до истечения двух месяцев со дня поступления заявления в суд, если иные сроки рассмотрения и разрешения дел не установлены настоящим Кодексом, а мировым судьей до истечения месяца со дня принятия заявления к производству."');
            $builder->addIndentRow('Таким образом, вашим судом был нарушен срок рассмотрения данного дела.');
        }
        else {
            $builder->addIndentRow('Так, п. 1 ст. 130 ГПК РФ предусмотрено следующее:');
            $builder->addIndentRow('"1. В случае, если в установленный срок от должника не поступят в суд возражения, судья выдает взыскателю второй экземпляр судебного приказа, заверенный гербовой печатью суда, для предъявления его к исполнению. По просьбе взыскателя судебный приказ может быть направлен судом для исполнения судебному приставу-исполнителю, в том числе в форме электронного документа, подписанного судьей усиленной квалифицированной электронной подписью в порядке, установленном законодательством Российской Федерации."');
            $builder->addIndentRow('Таким образом, вашим судом был нарушен срок выдачи судебного приказа.');

        }
        $builder->addAskHeader('На основании изложенного, руководствуясь статьями 35, 154, 130, 428 ГПК РФ,');
        $builder->addRow('1. Разъяснить истцу, на какой стадии находится рассмотрение вышеуказанного гражданского дела.');
        $builder->addRow("2. В случае, если по вышеуказанному делу $wasDecision, то направить его по адресу взыскателя: {$this->creditor->address->getFull()}.");
        if($this->claim->type->id === CourtClaimTypeEnum::CourtClaim->value) {
            $builder->addRow("3. В случае, если по вышеуказанному делу решение вступило в законную силу, то направить исполнительный лист по адресу истца.");
        }

    }
}