<?php

namespace Tests;

use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    protected function toConsole(string $string)
    {
        fwrite(STDERR, print_r($string, TRUE));
    }
}
