@php
$file = "/path/to/filename.php";
$line = 35;
print "<a href='phpstorm://open?url=file://$file&line=$line'>Open with PhpStorm</a>";
// Alternate Syntax to match PhpStorm 8 for the Macintosh
print "<a href='phpstorm://open?file=$file&line=$line'>Open with PhpStorm</a>";
@endphp
