<?php
declare(strict_types=1);

namespace App\Services\Documents\Views;

use App\Models\Cession\Cession;
use App\Models\Cession\CessionEnclosure;
use App\Models\Cession\CessionGroup;
use App\Models\Contract\Contract;
use App\Models\CourtClaim\CourtClaim;
use App\Models\Subject\Creditor\Creditor;
use App\Models\Subject\People\Agent;
use App\Models\Subject\People\Debtor;
use App\Models\Subject\People\Name;
use App\Services\Counters\Base\Limited;
use App\Services\Counters\CountService;
use App\Services\Counters\IgnorePaymentsLoanCountService;
use App\Services\Counters\LimitedLoanCountService;
use App\Services\Documents\Views\Base\BaseDocView;
use App\Services\Documents\Views\Base\Builders\DocBodyBuilder;
use App\Services\Documents\Views\Base\Builders\DocFooterBuilder;
use App\Services\Documents\Views\Base\Builders\DocHeadBuilder;
use App\Services\Documents\Views\CountingTables\CountingPenaltiesTable;
use App\Services\Documents\Views\CountingTables\CountingPercentsTable;
use Illuminate\Support\Collection;
use PhpOffice\PhpWord\Element\Section;

abstract class LoanClaimDocView extends BaseDocView
{
    protected Contract $contract;
    protected Creditor $creditor;
    protected Debtor $debtor;
    protected CourtClaim $claim;
    protected Agent $agent;
    protected Creditor $firstCreditor;
    protected ?CessionGroup $cessionGroup;
    protected CountService $countService;
    protected string $creditorTitle;
    protected string $debtorTitle;
    protected Collection $lastText;
    protected Collection $enclosures;
    protected Collection $askHeader;
    protected CountingPercentsTable $percentsTable;
    protected CountingPenaltiesTable $penaltiesTable;
    protected Section $tableSection;


    public function __construct(CourtClaim $claim, CountService $countService)
    {
        parent::__construct();
        $this->lastText = new Collection();
        $this->enclosures = new Collection();
        $this->askHeader = new Collection();
        $this->claim = $claim;
        $this->countService = $countService;
        $this->contract = $claim->contract;
        $this->creditor = $claim->contract->creditor;
        $this->debtor = $claim->contract->debtor;
        $this->agent = $claim->agent;
        $this->cessionGroup = $this->contract->cession;
        if($this->cessionGroup) {
            $this->firstCreditor = $this->cessionGroup->cessions()->orderBy('transfer_date')->first()->assignor;
            $this->cessionGroup->cessions->each(function (Cession $cession) {
                $this->lastText->push($cession->text);
                $cession->enclosures->each(function (CessionEnclosure $enclosure) {
                    $this->enclosures->push($enclosure->name);
                });
            });
        }
        else $this->firstCreditor = $this->creditor;
        if($this->claim->is_contract_jurisdiction) {
            $this->lastText->push('Условиями договора займа определена подсудность в суде: ' . $this->claim->court->name . '.');
        }
        $this->enclosures->push($this->agent->enclosure);
        $tableSection = $this->document->addSection(['marginLeft' => 1100]);
        $this->percentsTable = new CountingPercentsTable($tableSection, $this->contract, $this->countService->getBreaks());
        $this->penaltiesTable = new CountingPenaltiesTable($tableSection, $this->contract, $this->countService->getBreaks());
        $this->tableSection = $tableSection;
    }



    function buildDocument(): void
    {
        parent::buildDocument();
        $this->percentsTable->build();
        $this->tableSection->addTextBreak(5);
        $this->penaltiesTable->build();

    }

    protected function buildHead(DocHeadBuilder $builder): void
    {
        $builder->addRow('В ' . $this->claim->court->name);
        $builder->addAddress($this->claim->court->address->getFull());
        $builder->addRow($this->creditorTitle . ':');
        $builder->addRow($this->creditor->name);
        $builder->addAddress($this->creditor->address->getFull());
        if($this->creditor->type->id === 3) {
            $builder->addRow('Паспорт: ' . $this->creditor->court_identifier);
        }
        else $builder->addRow('ИНН: ' . $this->creditor->court_identifier);
        $builder->addRow('Представитель:');
        $builder->addRow($this->agent->name->getFull());
        $builder->addAddress($this->agent->address->getFull());
        $builder->addPassport($this->agent->passport);
        $builder->addRow($this->debtorTitle . ':');
        $builder->addRow($this->debtor->name->getFull());
        $builder->addAddress($this->debtor->address->getFull());
        $builder->addRow('Дата рождения: ' . $this->debtor->birth_date->format(RUS_DATE_FORMAT) . ' г.');
        $builder->addRow('Место Рождения:');
        $builder->addRow($this->debtor->birth_place);
        if($this->debtor->passport) $builder->addPassport($this->debtor->passport);
        else $builder->addRow('Паспорт: данные неизвестны');
        $result = $this->countService->getResult();
        $builder->addRow('Цена иска: ' . $result->sum . ' руб.');
        $builder->addRow('Госпошлина: ' . $this->countService->getFee($this->claim->type) . ' руб.');
    }

    protected function buildBody(DocBodyBuilder $builder): void
    {
        $result = $this->countService->getResult();
        $builder->addHeader($this->claim->type->name);
        $countServiceClass = get_class($this->countService);
        $debtorGenitive = $this->debtor->name->getFullGenitive();
        $creditorGenitive = null;
        if($this->creditor->type->id === 3) {
            $creditorName = new Name();
            $creditorData = explode(' ', $this->creditor->name);
            $creditorName->surname = $creditorData[0];
            $creditorName->name = $creditorData[1];
            if(isset($creditorData[2])) $creditorName->patronymic = $creditorData[2];
            $creditorGenitive = $creditorName->getFullGenitive();
        }
        if($countServiceClass === IgnorePaymentsLoanCountService::class) {
            /**
             * @var Limited $limited;
             */
            $limited = $this->countService->getLimited();
            if($limited->isLimited) $limited->setText();
        }
        else $limited = null;
        $builder->addIndentRow($this->contract->issued_date->format(RUS_DATE_FORMAT) . ' г. ' . $this->firstCreditor->name . ' (далее - "Заимодавец") и ' . $this->debtor->name->getFull() . ' (далее - "Должник") заключили договор займа № ' . $this->contract->number . ' (далее - "Договор"). В соответствии с условиями договора заимодавец передал должнику денежную сумму в размере ' . $this->contract->issued_sum . ' рублей сроком на ' . $this->inclineNumWord($this->contract->issued_date->diffInDays($this->contract->due_date), 'день', "дня", "дней") . ", а Должник обязался возвратить такую же сумму денег и уплатить проценты в размере " . $this->contract->percent . ' % годовых от суммы займа.');
        $builder->addIndentRow($this->contract->issued_date->format(RUS_DATE_FORMAT) . ' г. должник денежную сумму по договору получил, что подтверждается расходным кассовым ордером.');
        $builder->addIndentRow('До настоящего времени сумма займа не оплачена. Этим Заемщик нарушил обязанность возвратить сумму займа до ' . $this->contract->due_date->format(RUS_DATE_FORMAT) . ' г., предусмотренную условиями договора.');
        $builder->addIndentRow('Также, согласно условиям договора “за неисполнение или ненадлежащее исполнение заемщиком обязательства по возврату займа и уплате процентов на сумму займа начисляется неустойка в размере ' . $this->contract->penalty . ' % процентов годовых от суммы неисполненного обязательства за каждый день просрочки с даты, следующей за датой наступления исполнения обязательства, установленной договором займа, по дату погашения просроченной задолженности.');
        $builder->addIndentRow('Так, по п.1 ст. 330 ГК РФ "Неустойкой (штрафом, пеней) признается определенная законом или договором денежная сумма, которую должник обязан уплатить кредитору в случае неисполнения или ненадлежащего исполнения обязательства, в частности в случае просрочки исполнения. По требованию об уплате неустойки кредитор не обязан доказывать причинение ему убытков."');
        $builder->addIndentRow('На ' . $this->claim->count_date->format(RUS_DATE_FORMAT) . ' г. сумма задолженности по договору' . ($countServiceClass === LimitedLoanCountService::class ? ', с учетом ограничений размера процентов и неустойки, установленных Федеральным законом от 27.12.2018 г. № 554-ФЗ и ст. 12.1 Федерального закона от 02.07.2010 N 151-ФЗ,' : '') . ' составляет:');
        $builder->addIndentRow('Основной долг: ' . $result->main . ' руб.');
        $builder->addIndentRow('Проценты по договору: ' . $result->percents . ' руб.');
        $builder->addIndentRow('Неустойка по договору: ' . $result->penalties . ' руб.');
        if($limited && isset($limited->text)) $builder->addIndentRow($limited->text);
        $builder->addIndentRow('В соответствии со ст. 309 ГК РФ, обязательства должны исполняться надлежащим образом в соответствии с условиями обязательства, односторонний отказ от исполнения обязательства не допускается (ст.310 ГК РФ), исполнение обязательства должно производится в сроки, установленные договором (ст. 314 ГК РФ).');
        $builder->addIndentRow('Согласно ст. 807 ГК РФ по договору займа одна сторона (займодавец) передает в собственность другой стороне (заемщику) деньги или другие вещи, определенные родовыми признаками, а заемщик обязуется возвратить займодавцу такую же сумму денег (сумму займа) или равное количество других полученных им вещей того же рода и качества. Договор займа считается заключенным с момента передачи денег или других вещей.');
        $builder->addIndentRow('Статья 810 ГК РФ предусматривает, что заемщик обязан возвратить займодавцу полученную сумму займа в срок и в порядке, которые предусмотрены договором займа.');
        $builder->addIndentRow('В соответствии со ст. 809 ГК РФ:');
        $builder->addRow('"1. Если иное не предусмотрено законом или договором займа, займодавец имеет право на получение с заемщика процентов на сумму займа в размерах и в порядке, определенных договором.');
        $builder->addRow('2. При отсутствии иного соглашения проценты выплачиваются ежемесячно до дня возврата суммы займа»."');
        $this->addTextForEach($this->lastText, [$builder, 'addIndentRow']);
        $builder->addIndentRow($this->askHeader->first());
        $builder->addNoSpaceHeader($this->askHeader->last());
        $builder->addRow('1.  Взыскать с ' . $debtorGenitive . ' в пользу ' . ($creditorGenitive ?? $this->creditor->name) . ' задолженность на ' . $this->claim->count_date->format(RUS_DATE_FORMAT) . ' г. по договору займа № ' . $this->contract->number . ' от ' . $this->contract->issued_date->format(RUS_DATE_FORMAT) . ' г. в сумме ' . ($limited ? $result->sum - $result->percents + $limited->getPercents() : $result->sum) . ' руб., в том числе:');
        $builder->addRow('1.1.  Основной долг в размере ' . $result->main . ' руб.');
        $builder->addRow('1.2.  Проценты за пользование займом в размере ' . ($limited && $limited->getPercents() != 0 ? $limited->getPercents() : $result->percents) . ' руб.');
        $builder->addRow('1.3.  Неустойка за просрочку исполнения обязательств в размере ' . $result->penalties . ' руб.');
        $builder->addRow('2.  Взыскать с ' . $debtorGenitive . ' в пользу ' . ($creditorGenitive ?? $this->creditor->name) . '  расходы по уплате государственной пошлины в размере ' . $this->countService->getFee($this->claim->type) . ' руб.');
    }

    protected function buildFooter(DocFooterBuilder $builder): void
    {
        $builder->addRow('Квитанция об оплате государственной пошлины');
        $builder->addRow('Расчет исковых требований');
        $builder->addRow('Договор займа № ' . $this->contract->number . ' от ' . $this->contract->issued_date->format(RUS_DATE_FORMAT) . ' г.');
        $builder->addRow('Расходный кассовый ордер');
        $this->enclosures->each(fn(string $text) => $builder->addRow($text));
        $builder->addSignature($this->agent->name->initials());
    }

}