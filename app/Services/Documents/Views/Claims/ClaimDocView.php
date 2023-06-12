<?php
declare(strict_types=1);

namespace App\Services\Documents\Views\Claims;

use App\Models\Cession\Cession;
use App\Models\Cession\CessionEnclosure;
use App\Models\Cession\CessionGroup;
use App\Models\Contract\Contract;
use App\Models\CourtClaim\CourtClaim;
use App\Models\MoneySum;
use App\Models\Subject\Creditor\Creditor;
use App\Models\Subject\People\Agent;
use App\Models\Subject\People\Debtor;
use App\Models\Subject\People\Name;
use App\Services\Counters\Base\Limited;
use App\Services\Counters\CountService;
use App\Services\Counters\IgnorePaymentsLoanCountService;
use App\Services\Documents\Views\Base\BaseDocView;
use App\Services\Documents\Views\Base\Builders\DocBodyBuilder;
use App\Services\Documents\Views\Base\Builders\DocFooterBuilder;
use App\Services\Documents\Views\Base\Builders\DocHeadBuilder;
use App\Services\Documents\Views\Base\CountingTable;
use App\Services\Documents\Views\CountingTables\LoanCountPenaltiesTable;
use App\Services\Documents\Views\CountingTables\CountingPercentsTable;
use Illuminate\Support\Collection;
use PhpOffice\PhpWord\Element\Section;

abstract class ClaimDocView extends BaseDocView
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
    protected CountingTable $penaltiesTable;
    protected Section $tableSection;
    protected ?Limited $limited;
    protected MoneySum $result;
    protected string $countServiceClass;

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
//        $this->penaltiesTable = new LoanCountPenaltiesTable($tableSection, $this->contract, $this->countService->getBreaks());
        $this->tableSection = $tableSection;
        $this->result = $this->countService->getResult();
//        $builder->addHeader($this->claim->type->name);
        $this->countServiceClass = get_class($this->countService);
        if($this->countServiceClass === IgnorePaymentsLoanCountService::class) {
            $this->limited = $this->countService->getLimited();
            if($this->limited->isLimited) $this->limited->setText();
        }
        else $this->limited = null;
    }
    function buildDocument(): void
    {
        $this->setClaimValues();
        $this->buildHead($this->headBuilder);
        $this->buildBody($this->bodyBuilder);
        $this->buildBottomBody($this->bodyBuilder);
        $this->buildRequirements($this->bodyBuilder);
        $this->footerBuilder->addHeader('Приложение:');
        $this->buildFooter($this->footerBuilder);
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
        $builder->addRow("Дата рождения: {$this->debtor->birth_date->format(RUS_DATE_FORMAT)} г.");
        $builder->addRow('Место Рождения:');
        $builder->addRow($this->debtor->birth_place);
        if($this->debtor->passport) $builder->addPassport($this->debtor->passport);
        else $builder->addRow('Паспорт: данные неизвестны');
        $result = $this->countService->getResult();
        $builder->addRow('Цена иска: ' . $result->sum . ' руб.');
        $builder->addRow('Госпошлина: ' . $this->countService->getFee($this->claim->type) . ' руб.');
    }

    protected function buildRequirements(DocBodyBuilder $builder)
    {
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
        $builder->addIndentRow($this->askHeader->first());
        $builder->addNoSpaceHeader($this->askHeader->last());
        $builder->addRow('1.  Взыскать с ' . $debtorGenitive . ' в пользу ' . ($creditorGenitive ?? $this->creditor->name) . ' задолженность на ' . $this->claim->count_date->format(RUS_DATE_FORMAT) . ' г. по договору займа № ' . $this->contract->number . ' от ' . $this->contract->issued_date->format(RUS_DATE_FORMAT) . ' г. в сумме ' . ($this->limited ? $this->result->sum - $this->result->percents + $this->limited->getPercents() : $this->result->sum) . ' руб., в том числе:');
        $builder->addRow('1.1.  Основной долг в размере ' . $this->result->main . ' руб.');
        $builder->addRow('1.2.  Проценты за пользование займом в размере ' . ($this->limited && $this->limited->getPercents() != 0 ? $this->limited->getPercents() : $this->result->percents) . ' руб.');
        $builder->addRow('1.3.  Неустойка за просрочку исполнения обязательств в размере ' . $this->result->penalties . ' руб.');
        $builder->addRow('2.  Взыскать с ' . $debtorGenitive . ' в пользу ' . ($creditorGenitive ?? $this->creditor->name) . '  расходы по уплате государственной пошлины в размере ' . $this->countService->getFee($this->claim->type) . ' руб.');
    }

    protected function buildBottomBody(DocBodyBuilder $builder)
    {
        $builder->addIndentRow('Основной долг: ' . $this->result->main . ' руб.');
        $builder->addIndentRow('Проценты по договору: ' . $this->result->percents . ' руб.');
        $builder->addIndentRow('Неустойка по договору: ' . $this->result->penalties . ' руб.');
        if($this->limited && isset($this->limited->text)) $builder->addIndentRow($this->limited->text);
        $builder->addIndentRow('В соответствии со ст. 309 ГК РФ, обязательства должны исполняться надлежащим образом в соответствии с условиями обязательства, односторонний отказ от исполнения обязательства не допускается (ст.310 ГК РФ), исполнение обязательства должно производится в сроки, установленные договором (ст. 314 ГК РФ).');
        $builder->addIndentRow('Согласно ст. 807 ГК РФ по договору займа одна сторона (займодавец) передает в собственность другой стороне (заемщику) деньги или другие вещи, определенные родовыми признаками, а заемщик обязуется возвратить займодавцу такую же сумму денег (сумму займа) или равное количество других полученных им вещей того же рода и качества. Договор займа считается заключенным с момента передачи денег или других вещей.');
        $builder->addIndentRow('Статья 810 ГК РФ предусматривает, что заемщик обязан возвратить займодавцу полученную сумму займа в срок и в порядке, которые предусмотрены договором займа.');
        $builder->addIndentRow('В соответствии со ст. 809 ГК РФ:');
        $builder->addRow('"1. Если иное не предусмотрено законом или договором займа, займодавец имеет право на получение с заемщика процентов на сумму займа в размерах и в порядке, определенных договором.');
        $builder->addRow('2. При отсутствии иного соглашения проценты выплачиваются ежемесячно до дня возврата суммы займа»."');
        $this->addTextForEach($this->lastText, [$builder, 'addIndentRow']);
    }

    protected function buildFooter(DocFooterBuilder $builder): void
    {
        $builder->addRow('Квитанция об оплате государственной пошлины');
        $builder->addRow('Расчет исковых требований');
        $builder->addRow( $this->contract->type->name . ' № ' . $this->contract->number . ' от ' . $this->contract->issued_date->format(RUS_DATE_FORMAT) . ' г.');
        $builder->addRow('Расходный кассовый ордер');
        $this->enclosures->each(fn(string $text) => $builder->addRow($text));
        $builder->addSignature($this->agent->name->initials());
    }

    abstract protected function setClaimValues(): void;

}