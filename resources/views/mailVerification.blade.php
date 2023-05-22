<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Проверка электронной почты</title>
</head>
<body style="width: 100%; height: 100vh; display: flex; justify-content: center; align-items: center; margin: 0">
    <h3 style="">{{$message}}</h3>
<script>
    const redirect = {{$redirect ? 'true' : 'false'}};
    if(redirect) {
        setTimeout(() => {
            window.location.replace('/login');
        }, 10000);
    }
</script>
</body>
</html>