<?php
declare(strict_types=1);

namespace App\Services\Documents\Views;

use App\Models\Contract\Contract;
use App\Models\Contract\IpInitStatement;
use App\Models\ExecutiveDocument\ExecutiveDocument;
use App\Services\Documents\Views\Base\BaseDocView;
use App\Services\Documents\Views\Base\Builders\DocBodyBuilder;
use App\Services\Documents\Views\Base\Builders\DocFooterBuilder;
use App\Services\Documents\Views\Base\Builders\DocHeadBuilder;

class IpInitDocView extends BaseDocView
{
    protected IpInitStatement $statement;
    protected Contract $contract;
    protected ExecutiveDocument $executiveDocument;

    public function __construct(IpInitStatement $statement)
    {
        $this->statement = $statement;
        $this->contract = $statement->executiveDocument->contract;
        $this->executiveDocument = $statement->executiveDocument;
        parent::__construct($statement->agent, null, 'Times New Roman', 12);
    }

    protected function buildHead(DocHeadBuilder $builder): void
    {
        $builder->addRow("В {$this->executiveDocument->bailiffDepartment->name}");
        $builder->addAddress($this->executiveDocument->bailiffDepartment->address->getFull());
        $builder->addRow('Взыскатель:');
        $builder->addRow($this->contract->creditor->name);
        $builder->addAddress($this->contract->creditor->address->getFull());
        $builder->addRow('Представитель:');
        $builder->addRow($this->statement->agent->name->getFull());
        $builder->addAddress($this->statement->agent->address->getFull());
    }

    protected function buildBody(DocBodyBuilder $builder): void
    {
        $debtorGenitive = $this->contract->debtor->name->getFullGenitive();
        $creditorGenitive = $this->contract->creditor->getGenitiveName();
        $requisites = $this->contract->creditor->requisites;
        $sum = $this->executiveDocument->moneySum->sum + $this->executiveDocument->fee;
        $builder->addHeader('Заявление о возбуждении исполнительного производства');
        $builder->addIndentRow("Прошу принять {$this->executiveDocument->type->name} № {$this->executiveDocument->number} от {$this->executiveDocument->issued_date->format(RUS_DATE_FORMAT)} г., выданный судом: {$this->executiveDocument->court->name} по гражданскому делу о взыскании задолженности с $debtorGenitive в пользу {$creditorGenitive} по {$this->contract->type->dativeIncline()} № {$this->contract->number} от {$this->contract->issued_date->format(RUS_DATE_FORMAT)} г. в общем размере $sum руб. Из них:");
        $builder->addRow("{$this->executiveDocument->moneySum->main} руб. - Основной долг;");
        $builder->addRow("{$this->executiveDocument->moneySum->percents} руб. - Проценты за пользование займом;");
        $builder->addRow("{$this->executiveDocument->moneySum->penalties} руб. - Неустойка за просрочку исполнения обязательств;");
        $builder->addRow("{$this->executiveDocument->fee} руб. - Расходы по уплате государственной пошлины.");
        $builder->addIndentRow('Взысканные денежные средства прошу перечислить на следующие реквизиты:');
        $builder->addRow("Получатель: " . $this->contract->creditor->name);
        $builder->addRow('Расчетный счет: ' . $requisites->checking_account);
        $builder->addRow('Корреспондентский счет: ' . $requisites->correspondent_account);
        $builder->addRow('Наименование банка: ' . $requisites->bank->name);
        $builder->addRow('БИК банка: ' . $requisites->bank->BIK);
        $builder->addIndentRow('Прошу направить постановление о возбуждении исполнительного производства заказным письмом с уведомлением о вручении согласно п. 4.8.3.4 приказа от 10 декабря 2010 г. N 682 «ОБ УТВЕРЖДЕНИИ ИНСТРУКЦИИ ПО ДЕЛОПРОИЗВОДСТВУ В ФЕДЕРАЛЬНОЙ СЛУЖБЕ СУДЕБНЫХ ПРИСТАВОВ».');
        $builder->addIndentRow('В случае истечения срока добровольного исполнения требований, указанных в постановлении о возбуждении исполнительного производства, прошу установить временное ограничение на выезд из РФ в отношении должника.');
    }

    protected function buildFooter(DocFooterBuilder $builder): void
    {
        $builder->addRow("{$this->executiveDocument->type->name} № {$this->executiveDocument->number} от {$this->executiveDocument->issued_date->format(RUS_DATE_FORMAT)} г.");
        $builder->addRow($this->statement->agent->enclosure);

    }
}