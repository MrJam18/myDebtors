<?php

namespace Tests\Unit;

use App\Models\Subject\Creditor\CreditorType;
use Tests\TestCase;

class ExampleTest extends TestCase
{
    /**
     * A basic test example.
     */
    public function test_that_true_is_true(): void
    {
        $this->assertTrue(true);
    }
    public function test_set_name_and_save(): void
    {
        $model = new CreditorType();
        $model->name = 'test';
        $newModel = new (get_class($model));
        $this->assertEquals(get_class($model), get_class($newModel));
    }
}
