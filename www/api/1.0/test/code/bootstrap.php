<?php
declare(strict_types=1);

require_once sprintf("%s/_.php", __DIR__);

error_reporting(E_ALL);

define('SESSION_NAME', "SID");

header("Cache-Control: no-cache, must-revalidate");
header("Expires: Sat, 26 Jul 1997 05:00:00 GMT");
header("Pragma: no-cache");

