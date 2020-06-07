<!DOCTYPE html>
<html lang="en">
<head>
    <!-- meta stuff -->
    <meta charset="UTF-8">

    <!-- bootstrap implementation -->
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
    <title>Donor Page</title>
</head>
<body>
    <div class="container">
        <h1> Donor </h1>
    </div>
    <form action="login.inc.php" method="post">
        <div class="form-group">
            <label for="nameInput">Full Name</label>
            <input type="text" class="form-control" id="nameInput" placeholder="John Doe">
        </div>
        <div class="form-group">
            <label for="emailInput">Email</label>
            <input type="email" class="form-control" id="emailInput" placeholder="johndoe@xyz.com">
        </div>
        <div class="form-group">
            <label for="orgInput">Name of Charitable Organization</label>
            <input type="text" class="form-control" id="orgInput" placeholder="World Health Organization">
        </div>
        <div class="form-group">
            <label for="emailInput">Link to Donation Portal</label>
            <input type="link" class="form-control" id="emailInput" placeholder="Password">
        </div>
        <div class="form-group">
            <label for="reasonInput">Reason for donating</label>
            <textarea class="form-control" id="reasonInput" placeholder="Password" rows="3">Limit to 150 characters</textarea>
        </div>
        <button type="submit" class="btn btn-primary">Next</button>
    </form>

    <script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
</body>
</html>