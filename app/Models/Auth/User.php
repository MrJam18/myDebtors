<?php

namespace App\Models\Auth;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Action\Action;
use App\Models\Cession\CessionGroup;
use App\Models\Contract\Contract;
use App\Models\Requisites\Requisites;
use App\Models\Subject\Agent;
use App\Models\Subject\Creditor\Creditor;
use App\Models\Subject\Debtor;
use App\Models\Subject\Name;
use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Hash;
use Laravel\Sanctum\HasApiTokens;
use Tymon\JWTAuth\Contracts\JWTSubject;

/**
 * @property int $id;
 * @property Carbon $created_at;
 * @property Carbon $updated_at;
 * @property string $email;
 * @property Carbon $email_verified_at;
 * @property string $password;
 * @property boolean $is_online;
 * @property string $phone;
 * @property UserRole $role;
 * @property Group $group;
 * @property Name $name;
 * @property Collection $cessionGroups;
 * @property Collection $creditors;
 * @property Collection $agents;
 * @property Collection $debtors;
 * @property Collection $contracts;
 * @property Collection $actions;
 * @property string $remember_token;
 * @property Collection $requisites
 */
class User extends Authenticatable implements JWTSubject
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'email',
        'password',
        'email_verified_at',
        'is_online',
        'phone',
        'remember_token'
    ];

    function role(): BelongsTo
    {
       return $this->belongsTo(UserRole::class);
    }

    function group(): BelongsTo
    {
        return $this->belongsTo(Group::class);
    }

    function name(): BelongsTo
    {
        return $this->belongsTo(Name::class);
    }
    function cessionGroups(): HasMany
    {
        return $this->hasMany(CessionGroup::class);
    }
    function creditors(): HasMany
    {
        return $this->hasMany(Creditor::class);
    }
    function agents(): HasMany
    {
        return $this->hasMany(Agent::class);
    }
    function debtors(): HasMany
    {
        return $this->hasMany(Debtor::class);
    }
    function contracts(): HasMany
    {
        return $this->hasMany(Contract::class);
    }
    function actions(): HasMany
    {
        return $this->hasMany(Action::class);
    }
    function Requisites(): HasMany
    {
        return $this->hasMany(Requisites::class);
    }

    protected function password(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => Hash::make($value),
        );
    }


    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    /**
     * Get the identifier that will be stored in the subject claim of the JWT.
     *
     */
    public function getJWTIdentifier(): int
    {
        return $this->getKey();
    }

    /**
     * Return a key value array, containing any custom claims to be added to the JWT.
     *
     * @return array
     */
    public function getJWTCustomClaims(): array
    {
        return [
            'group_id' => $this->group->id,
            'name_id' => $this->name->id,
            'email' => $this->email
        ];
    }
}
