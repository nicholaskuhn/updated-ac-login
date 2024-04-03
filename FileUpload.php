<?php

/**
 * Created by PhpStorm.
 * User: Dante
 * Date: 9/25/2017
 * Time: 7:57 AM
 * 
 * @package acPackage
 */

/** Connection between the PHP and the database server */
$dbh;

/** 
 * Setup database for FileUpload.php
 * 
 * @return void
 */
function setupDbFileUpload()
{
    global $dbh;
    // Usage for MySql
    $username = "xsolbadguy_NickK"; // "W01160019";
    $password = "DrFry2020"; // "Nicholascs!";
    $host = "localhost"; //db.cooldomain.com
    $dbname = "xsolbadguy_AnimalCrossingDB"; // "W01160019";

    try {
        $dbh = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    } catch (PDOException $err) {
        echo "I'm sorry user Dave. I can't do that. Error:" . $err->getMessage();
        die("Error:" . $err->getMessage());
    }

    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}

/**
 * Checks if the file the user is trying to upload is appropriate and able or,
 * if no file is provided, calls function to download the latest file
 *
 * @param File fileToUpload is the file selected by the user
 * 
 * @return void
 */
function determineUploadOrDownload()
{
    if (isset($_FILES['fileToUpload'])) {
        $uploadOk = 1;

        $target_file = basename($_FILES["fileToUpload"]["name"]);
        $fileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        // TODO: This portion doesn't seem to work
        if ($fileType != "gci") {
            echo "Sorry, only GCI files are allowed.";
            $uploadOk = 0;
        }

        if ($_FILES["fileToUpload"]["size"] > 700000) {
            echo "Sorry, your file is too large.";
            $uploadOk = 0;
        }

        if (isset($_FILES['fileToUpload']) && $_FILES['fileToUpload']['size'] > 0 && $uploadOk === 1) {
            uploadFile();
        }
    } else {
        downloadFile();
    }
}

/**
 * Uploads the BLOB file to the database with the date of the upload
 * 
 * @param File fileToUpload is the file selected by the user
 * 
 * @return String Returns success string to notify the user of the successful upload
 */
function uploadFile()
{
    global $dbh;
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

/**
 * Downloads the latest BLOB file from the database
 * 
 * @return BLOB Returns the BLOB file to the HTML form for the user to download
 */
function downloadFile()
{
    global $dbh;
    try {
        $stmtDownloadFile = $dbh->prepare("SELECT fileData 
                                            FROM ACFile 
                                            WHERE fileId=(SELECT max(fileId) FROM ACFile)");

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

setupDbFileUpload();
determineUploadOrDownload();
