<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\Action\ActionObject;
use App\Models\Action\ActionType;
use App\Models\Address\Country;
use App\Models\Auth\Group;
use App\Models\Auth\User;
use App\Models\Auth\UserRole;
use App\Models\Contract\ContractStatus;
use App\Models\Contract\ContractType;
use App\Models\CourtClaim\CourtClaimStatus;
use App\Models\CourtClaim\CourtClaimType;
use App\Models\ExecutiveDocument\ExecutiveDocumentType;
use App\Models\Passport\PassportType;
use App\Models\Subject\Court\CourtLevel;
use App\Models\Subject\Court\CourtType;
use App\Models\Subject\Creditor\CreditorType;
use App\Models\Subject\People\Name;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = new User();
        $user->email = 'amd@ya.ru';
        $user->password = '123';
        $user->phone = '89821174497';
        $username = new Name();
        $username->name = 'Джамиль';
        $username->surname = 'Мамедов';
        $username->patronymic = 'Рафигович';
        $username->save();
        $user->name_id = $username->id;
        $group = new Group();
        $group->name = 'test';
        $group->save();
        $user->group_id = $group->id;
        $userRole = new UserRole();
        $userRole->name = 'Администратор';
        $userRole->save();
        $userRole = new UserRole();
        $userRole = $this->setNameAndSave($userRole, 'Владелец группы');
        $this->setNameAndSave($userRole, 'Участник группы');
        $user->role_id = 2;
        $user->save();
        $creditorType = new CreditorType();
        $creditorType->name = 'Микрофинансовая организация';
        $creditorType->save();
        $creditorType = new CreditorType();
        $creditorType->name = 'Банк';
        $creditorType->save();
        $creditorType = new CreditorType();
        $creditorType->name = 'Физическое лицо';
        $creditorType->save();
        $creditorType = new CreditorType(['name' => 'Коллекторское агентство']);
        $creditorType->save();
        $passportType = new PassportType();
        $passportType = $this->setNameAndSave($passportType, 'Паспорт РФ сокращенно.');
        $passportType = $this->setNameAndSave($passportType, "Паспорт гражданина РФ");
        $passportType = $this->setNameAndSave($passportType, 'Паспорт иностранного гражданина');
        $passportType = $this->setNameAndSave($passportType, 'Заграничный паспорт гражданина РФ');
        $passportType = $this->setNameAndSave($passportType, 'Вид на жительство на территории РФ');
        $this->setNameAndSave($passportType, 'Свидетельство о предоставлении убежища в РФ');
        $executiveDocType = new ExecutiveDocumentType();
        $executiveDocType = $this->setNameAndSave($executiveDocType, 'Судебный приказ');
        $this->setNameAndSave($executiveDocType, 'Исполнительный лист');
        $model = new CourtLevel();
        $model = $this->setNameAndSave($model, 'Мировой суд');
        $model = $this->setNameAndSave($model, 'Районный/городской суд');
        $model = $this->setNameAndSave($model, 'Верховный суд субъекта');
        $model = $this->setNameAndSave($model,  'Суд апелляционной инстанции');
        $model = $this->setNameAndSave($model, 'Cуд кассационной инстанции');
        $this->setNameAndSave($model, 'Верховный суд РФ');
        $model = new CourtType();
        $model = $this->setNameAndSave($model, "Суд общей юрисдикции");
        $this->setNameAndSave($model, 'Арбитражный суд');
        $model = new ActionObject();
        $model = $this->setNameAndSave($model, "судебный приказ");
        $model = $this->setNameAndSave($model, 'Платеж');
//        $model = $this->setNameAndSave($model, 'Название договора');
        $model = $this->setNameAndSave($model, "дата выдачи");
        $model = $this->setNameAndSave($model, "дата исполнения");
        $model = $this->setNameAndSave($model, 'сумма выдачи');
        $model = $this->setNameAndSave($model, 'процентная ставка');
        $model = $this->setNameAndSave($model, 'размер неустойки');
        $model = $this->setNameAndSave($model, 'номер договора');
        $model = $this->setNameAndSave($model, 'комментарий');
        $model = $this->setNameAndSave($model, 'исковое заявление');
        $model = $this->setNameAndSave($model, 'статус');
        $model = $this->setNameAndSave($model, "заявление о возбуждении ИП");
        $model = $this->setNameAndSave($model, 'Договор');
        $model = $this->setNameAndSave($model, 'Дата ежемесячного платежа');
        $model = $this->setNameAndSave($model, 'Сумма ежемесячного платежа');
        $this->setNameAndSave($model, 'файл');
        $model = new ActionType();
        $model = $this->setNameAndSave($model, "создание");
        $model = $this->setNameAndSave($model, 'добавление');
        $model = $this->setNameAndSave($model, 'удаление');
        $this->setNameAndSave($model, 'изменение');
        $model = new ContractStatus();
        $model = $this->setNameAndSave($model, 'не готов');
        $model = $this->setNameAndSave($model, 'ожидание файлов');
        $model = $this->setNameAndSave($model, 'ожидание отправки СП');
        $model = $this->setNameAndSave($model, 'Заявление о выдаче СП отправлено');
        $model = $this->setNameAndSave($model, 'СП получен');
        $model = $this->setNameAndSave($model, 'СП отменен');
        $model = $this->setNameAndSave($model, 'Иск отправлен');
        $model = $this->setNameAndSave($model, "Вынесено решение");
        $model = $this->setNameAndSave($model, 'Решение получено');
        $model = $this->setNameAndSave($model, 'В решении отказано');
        $model = $this->setNameAndSave($model, 'Подана жалоба');
        $model = $this->setNameAndSave($model, 'Жалоба отклонена');
        $model = $this->setNameAndSave($model, 'Жалоба удовлетворена');
        $model = $this->setNameAndSave($model, 'Исп. лист получен');
        $model = $this->setNameAndSave($model, 'Исп. документ отправлен СПИ');
        $model = $this->setNameAndSave($model, 'Исп. производство возбуждено');
        $model = $this->setNameAndSave($model, 'Исп. производство окончено без исполнения');
        $this->setNameAndSave($model, 'Исп. производство окончено с исполнением');
        $model = new ContractType();
        $model = $this->setNameAndSave($model, 'Договор займа');
        $this->setNameAndSave($model, "Кредитный договор");
        $model = new Country();
        $this->setNameAndSave($model, 'Россия');
        $model = new CourtClaimType();
        $model = $this->setNameAndSave($model, 'Заявление о выдаче судебного приказа');
        $this->setNameAndSave($model, 'Исковое заявление');
        $model = new CourtClaimStatus();
        $model = $this->setNameAndSave($model, 'Не готов');
        $model = $this->setNameAndSave($model, "Отправлен");
        $model = $this->setNameAndSave($model, 'Получено решение');
        $model = $this->setNameAndSave($model, 'Получен исполнительный документ');
        $otherSeeder = new BailiffPositionsSeeder();
        $otherSeeder->run();
        $otherSeeder = new HolidaysSeeder();
        $otherSeeder->run();
        $otherSeeder = new EnforcementProceedingsStatusesSeeder();
        $otherSeeder->run();
    }

    private function setNameAndSave(Model $model, string $name): Model
    {
        $name = ucfirst($name);
        $model->name = $name;
        $model->save();
        return new (get_class($model));
    }
}
