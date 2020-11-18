<?php
declare(strict_types=1);

define('ENTRY_POINT', true);
define('MAX_LENGTH', 1024);

require_once "./code/bootstrap.php";

session_name(SESSION_NAME);


$post = "POST" === $_SERVER['REQUEST_METHOD'];
if (!empty($_REQUEST[SESSION_NAME]) || $post) {
    session_start();
}

$scope = empty($_SESSION) ? [
    'log' => [],
    'response' => [
        'version' => "",
        'severity' => "", // trivial, major, critical
        'html' => "",
    ],
] : $_SESSION;

if (isset($_REQUEST['cleanup'])) {
    $scope['log'] = [];
    if (isset($_SESSION)) {
        $_SESSION['log'] = [];
        session_commit();
    }
    header(sprintf("Location: %s", $_SERVER['SCRIPT_NAME']));
    die;
}

if ($post) {
    try {
        $required = ['version', 'severity', 'html'];
        foreach ($required as $field) {
            if (!isset($_POST[$field]) || "" === $_POST[$field]) {
                throw new RuntimeException(sprintf("Missing required field '%s'", $field), 400);
            }
            if (strlen($_POST[$field]) > MAX_LENGTH) {
                throw new RuntimeException(
                    sprintf("Too long user agent header '%s' received", $_SERVER['HTTP_USER_AGENT']),
                    400
                );
            }
        }
        foreach ($required as $field) {
            $_SESSION['response'][$field] = $_POST[$field];
        }
        $_SESSION += ['log' => []];
        session_commit();
        header(sprintf("Location: %s", $_SERVER['SCRIPT_NAME']));
    } catch (RuntimeException $e) {
        $code = $e->getCode();
        http_response_code($code);
        echo $e->getMessage();
    }

    die;
}

require_once "templates/panel.php";
