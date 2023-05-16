<?php

namespace App\Http\Requests;


use App\Http\Requests\Base\BaseRequest;
use App\Http\Requests\Base\ListRequestData;
use App\Providers\Database\AbstractProviders\Components\enums\OrderDirection;
use App\Providers\Database\AbstractProviders\Components\OrderBy;

class PaginateRequest extends BaseRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }


    public function validated($key = null, $default = null): ListRequestData
    {
        $data = new ListRequestData((int)$this->page, (int)$this->perPage);
        if ($this->order) {
            $direction = $this->order[1];
            $data->orderBy = new OrderBy($this->order[0], constant(OrderDirection::class . "::$direction"));
        }
        return $data;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'perPage' => ['required', 'numeric'],
            'page' => ['required', 'numeric'],
            'order' => ['array']
        ];
    }

//    protected function prepareForValidation(): void
//    {
//        $this->merge([
//            'page' => (int)$this->page,
//            'perPage' => (int)$this->perPage
//        ]);
//    }
}
