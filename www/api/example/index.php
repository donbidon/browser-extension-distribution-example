<?php
/**
 * Distribution API example entry point.
 *
 * @author  [donbidon](http://donbidon.rf.gd/)
 * @license [MIT](https://opensource.org/licenses/mit-license.php)
 */

declare(strict_types=1);

define('ENTRY_POINT', true);
define('LOG_MAX_COUNT', 15);
define('VERSION_MAX_LENGTH', 20);
define('USER_AGENT_MAX_LENGTH', 255);

$ts = time();

require_once "./code/bootstrap.php";

header('Content-Type: application/json');

try {
    // Validate request {

    if (empty($_SERVER['HTTP_USER_AGENT'])) {
        throw new RuntimeException("Missing user agent", 400);
    }
    if (strlen($_SERVER['HTTP_USER_AGENT']) > USER_AGENT_MAX_LENGTH) {
        throw new RuntimeException(
            sprintf("Too long user agent header '%s' received", $_SERVER['HTTP_USER_AGENT']),
            400
        );
    }

    $required = ['id', 'version', 'event', 'sign'];
    if (isset($_POST['event']) && "updated" === $_POST['event']) {
        $required[] = "previousVersion";
    }
    foreach ($required as $field) {
        if (!isset($_POST[$field]) || "" === $_POST[$field]) {
            throw new RuntimeException(
                sprintf("Missing required field '%s'", $field),
                400
            );
        }
    }
    if (!in_array($_POST['event'], ["started", "updated", "installed"])) {
        throw new RuntimeException(
            sprintf("Invalid event '%s' received", $_POST['event']),
            400
        );
    }
    if (strlen($_POST['version']) > VERSION_MAX_LENGTH) {
        throw new RuntimeException(
            sprintf("Too long version value '%s' received", $_POST['version']),
            400
        );
    }
    if ("updated" === $_POST['event'] && strlen($_POST['previousVersion']) > VERSION_MAX_LENGTH) {
        throw new RuntimeException(
            sprintf("Too long previous version value '%s' received", $_POST['previousVersion']),
            400
        );
    }

    $sign = $_POST['sign'];
    $request = $_POST;
    unset($request['sign']);
    if (strlen(json_encode($request)) != $sign) {
        throw new RuntimeException("Invalid sign", 400);
    }

    // } Validate request

    // Ok
    session_name(SESSION_NAME);
    session_start();

    if (empty($_SESSION['response'])) {
        throw new RuntimeException("Response not set", 500);
    }

    $request = array_intersect_key($request, [
        'event' => null,
        'version' => null,
        'previousVersion' => null,
    ]);

    // Log request
    $_SESSION['log'][] = [
        'ts' => $ts,
        'ip' => $_SERVER["REMOTE_ADDR"],
        // 'userAgent' => strlen($_SERVER["HTTP_USER_AGENT"]) < 256
        //    ? $_SERVER["HTTP_USER_AGENT"] : substr($_SERVER["HTTP_USER_AGENT"], 0, 255),
    ] + $request;
    if (sizeof($_SESSION['log']) > LOG_MAX_COUNT) {
        array_shift($_SESSION['log']);
    }

    $response = [
        'updates' => [
            $_SESSION['response'],
        ],
    ];
    echo json_encode($response);

} catch (RuntimeException $e) {
    $code = $e->getCode();
    http_response_code($code);
    echo json_encode([
        'message' => $e->getMessage(),
        // 'sessionId' => session_id(),
    ]);
}
