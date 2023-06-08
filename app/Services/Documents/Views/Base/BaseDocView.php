<?php
declare(strict_types=1);

namespace App\Services\Documents\Views\Base;

use App\Services\Documents\Views\Base\Builders\DocBodyBuilder;
use App\Services\Documents\Views\Base\Builders\DocFooterBuilder;
use App\Services\Documents\Views\Base\Builders\DocHeadBuilder;
use Illuminate\Support\Collection;
use PhpOffice\PhpWord\Element\Section;
use PhpOffice\PhpWord\PhpWord;
use PhpOffice\PhpWord\Style\Language;
use PhpOffice\PhpWord\Style\Tab;

abstract class BaseDocView
{
    protected PhpWord $document;
    protected Section $baseSection;
    private DocHeadBuilder $headBuilder;
    private DocBodyBuilder $bodyBuilder;
    private DocFooterBuilder $footerBuilder;

    public function __construct(PhpWord $document = null, string $defaultFontName = 'Times New Roman', int $defaultFontSize = 11)
    {
        if (!$document) $this->document = new PhpWord();
        else $this->document = $document;
        $this->document->setDefaultFontName($defaultFontName);
        $this->document->setDefaultFontSize($defaultFontSize);
        $this->baseSection = $this->document->addSection();
        $this->headBuilder = new DocHeadBuilder($this->baseSection);
        $this->bodyBuilder = new DocBodyBuilder($this->baseSection);
        $this->footerBuilder = new DocFooterBuilder($this->baseSection);
        $this->document->addParagraphStyle('signatureTabs', ['tabs' => [new Tab('right', 9090)]]);
        $this->document->getSettings()->setThemeFontLang(new Language(Language::RU_RU));
    }

    abstract protected function buildHead(DocHeadBuilder $builder): void;

    abstract protected function buildBody(DocBodyBuilder $builder): void;

    abstract protected function buildFooter(DocFooterBuilder $builder): void;

    function buildDocument(): void
    {
        $this->buildHead($this->headBuilder);
        $this->buildBody($this->bodyBuilder);
        $this->footerBuilder->addHeader('Приложение:');
        $this->buildFooter($this->footerBuilder);

    }

    protected function addTextForEach(Collection $collection, array|callable $textAddFunc): void
    {
        $collection->each(fn(string $text)=>call_user_func($textAddFunc, $text));
    }
    protected function inclineNumWord(int $number, string $word, string $genitiveWord, string $pluralWord): string
    {
        $num = $number % 100;
        if ($num > 19) {
            $num = $num % 10;
        }

        $out =  $number . ' ';
        $out .= match ($num) {
            1 => $word[0],
            2, 3, 4 => $genitiveWord,
            default => $pluralWord,
        };

        return $out;
    }

    /**
     * @return PhpWord
     */
    public function getDocument(): PhpWord
    {
        return $this->document;
    }

}