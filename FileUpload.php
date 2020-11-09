<?php

/**
 * Created by PhpStorm.
 * User: Dante
 * Date: 9/25/2017
 * Time: 7:57 AM
 */

$username = "W01160019";
$password = "Nicholascs!";
$host = "localhost"; //db.cooldomain.com
$dbname = "W01160019";

/**
 * Setup database
 */
try {
    $dbh = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
} catch (PDOException $err) {
    echo "I'm sorry user Dave. I can't do that. Error:" . $err->getMessage();
    die("Error:" . $err->getMessage());
}

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if (isset($_FILES['fileToUpload'])) {
    $uploadOk = 1;

    $target_file = basename($_FILES["fileToUpload"]["name"]);
    $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

    if ($fileType != "gci") {
        echo "Sorry, only GCI files are allowed.";
        $uploadOk = 0;
    }

    if ($_FILES["fileToUpload"]["size"] > 700000) {
        echo "Sorry, your file is too large.";
        $uploadOk = 0;
    }

    if (isset($_FILES['fileToUpload']) && $_FILES['fileToUpload']['size'] > 0 && $uploadOk === 1) {
        $tmpName  = $_FILES['fileToUpload']['tmp_name'];

        $fp = fopen($tmpName, 'rb'); // read binary

        try {
            $stmtInsertFile = $dbh->prepare("INSERT INTO ACFile(fileData, dateUpload) 
                                                           VALUES(:fileData, :dateUpload)");

            $dateFormat = date('Y-m-d');
            $stmtInsertFile->bindParam(":fileData", $fp, PDO::PARAM_LOB);
            $stmtInsertFile->bindParam(":dateUpload", $dateFormat);

            $stmtInsertFile->execute();

            echo "success";
        } catch (PDOException $e) {
            echo 'Error: ' . $e->getMessage();
        }
    }
} else {
    try {
        $stmtDownloadFile = $dbh->prepare("SELECT fileData 
                                                         FROM ACFile 
                                                         WHERE fileId=(
                                                              SELECT max(fileId) FROM ACFile
                                                              )");

        $stmtDownloadFile->execute();

        $results = $stmtDownloadFile->fetch();
        list($content) = $results;
        header("Content-Type: application/octet-stream");
        header("Content-Disposition: attachment; filename=01-GAFE-DobutsunomoriP_MURA.gci");
        echo $content;
        exit;
    } catch (PDOException $e) {
        echo 'Error: ' . $e->getMessage();
    }
}
