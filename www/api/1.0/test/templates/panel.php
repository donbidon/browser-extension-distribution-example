<?php
declare(strict_types=1);

require_once sprintf("%s/../code/_.php", __DIR__);

?>
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Self Distributed Example - Control Panel</title>

  <link rel="icon" type="image/png" href="assets/images/icon.png" />

  <link
    rel="stylesheet"
    href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
    integrity="sha384-JcKb8q3iqJ61gNV9KGb8thSsNjpSL0n8PARn9HuZOnIxN0hoP+VmmDGMN5t9UJ0Z"
    crossorigin="anonymous"
  />
  <link rel="stylesheet" href="assets/css/styles.css" />
</head>
<body>

<div>

  <div style="float: left; width:25%;">
    <form method="post" action="" style="margin-right: 12px;">
      <div class="form-group row">
        <div class="col-sm-12">
          <select
            class="form-control"
            name="severity"
            required
          >
            <option value="" disabled selected>Severity</option>
            <option value="trivial">Trivial</option>
            <option value="major">Major</option>
            <option value="critical">Critical</option>
          </select>
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-12">
          <input
            type="text"
            class="form-control"
            name="version"
            value="<?php echo htmlspecialchars($scope['response']['version']); ?>"
            placeholder="Version"
            required
          >
        </div>
      </div>
      <div class="form-group row">
        <div class="col-sm-12">
          <textarea
            class="form-control"
            name="html"
            rows="10"
            placeholder="HTML"
            maxlength="<?php echo MAX_LENGTH; ?>"
            required
          ><?php echo htmlentities($scope['response']['html']); ?></textarea>
        </div>
      </div>

      <button type="submit" class="btn btn-primary">Apply</button>
    </form>
  </div>

  <div style="float: right; width: 75%;">
    <div class="form-group row">
      <form method="get" action="" class="col-sm-12">
        <input type="hidden" name="cleanup" value="1">
        <table cellpadding="2" cellspacing="2" border="2">
          <thead>
            <th>Time</th>
            <th>IP</th>
            <th>Event</th>
            <th>Version</th>
            <th>Previous version</th>
          </thead>
          <tbody>
          <?php foreach ($scope['log'] as $row): ?>
            <tr>
              <td data-id="ts"><?php echo $row['ts']; ?></td>
              <td><?php echo $row['ip']; ?></td>
              <td><?php echo $row['event']; ?></td>
              <td><?php echo $row['version']; ?></td>
              <td><?php echo $row['previousVersion'] ?? ""; ?></td>
            </tr>
          <?php endforeach; ?>
          </tbody>
        </table>
        <input type="submit" class="btn btn-warning" style="float: right;" value="Clean up">
      </form>
    </div>
  </div>

</div>

<script
  src="https://code.jquery.com/jquery-3.5.1.min.js"
  integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0="
  crossorigin="anonymous">
</script>
<script
  src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"
  integrity="sha384-B4gt1jrGC7Jh4AgTPSdUtOBvfO8shuf57BaghqFfPlYxofvL8/KUEfYiJOMMV+rV"
  crossorigin="anonymous">
</script>

<script type="text/javascript">
  $(document).ready(() => {
    <?php if ("" !== $scope['response']['severity']): ?>
    $('[name="severity"]').val("<?php echo $scope['response']['severity']; ?>");
    <?php endif; ?>
    $('[data-id="ts"]').each((i, node) => {
      const date = new Date($(node).html() * 1000);
      $(node).html(date.toLocaleString());
    });
  });
</script>

</body>
</html>
