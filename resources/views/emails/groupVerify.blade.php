<p>Пользователь с именем {{$user->name->getFull()}} и подтвержденной электронной почтой {{$user->email}} зарегистрировался на портале <a href="https://my-debtors.ru" class="">my-debtors.ru</a> и хочет вступить в вашу группу {{$user->group->name}}.</p>
<p>Для подтверждения этого, пройдите по следующей ссылке:</p>
<a href="{{$url}}">Подтверждение вступления в группу</a>