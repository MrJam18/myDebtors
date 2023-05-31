<?php
declare(strict_types=1);

namespace Database\Seeders;

use App\Models\Holiday;
use Carbon\Carbon;
use Illuminate\Database\Seeder;

class HolidaysSeeder extends Seeder
{
    private Holiday $holiday;

    public function __construct()
    {
        $this->holiday = new Holiday();
    }

    public function run(): void
    {
        $this->saveHoliday('2023-01-01', 'Новогодние каникулы');
        $this->saveHoliday('2023-01-02', 'Новогодние каникулы');
        $this->saveHoliday('2023-01-03', 'Новогодние каникулы');
        $this->saveHoliday('2023-01-04', 'Новогодние каникулы');
        $this->saveHoliday('2023-01-04', 'Новогодние каникулы');
        $this->saveHoliday('2023-01-05', 'Новогодние каникулы');
        $this->saveHoliday('2023-01-06', 'Новогодние каникулы');
        $this->saveHoliday('2023-01-07', 'Рождество Христово');
        $this->saveHoliday('2023-01-08', 'Новогодние каникулы');
        $this->saveHoliday('2023-02-23', 'День защитника отечества');
        $this->saveHoliday('2023-03-08', ' Международный женский день');
        $this->saveHoliday('2023-05-01', 'Праздник Весны и Труда');
        $this->saveHoliday('2023-05-09', 'День Победы');
        $this->saveHoliday('2023-06-12', 'День России');
        $this->saveHoliday('2023-11-04', 'День народного единства');
    }

    private function saveHoliday(string $date, string $name): void
    {
        $date = new Carbon($date);
        $this->holiday->date = $date;
        $this->holiday->name = $name;
        $this->holiday->save();
        $this->holiday = new Holiday();
    }

}