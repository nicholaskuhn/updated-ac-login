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

//Setup database
try {
    $dbh = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
} catch (PDOException $err){
    echo "I'm sorry user Dave. I can't do that. Error:" . $err->getMessage();
    die("Error:". $err->getMessage());
}

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if(!empty($_POST["username"]) && !empty($_POST["loginTime"]) && ($_POST["loggedOut"] === '0' || !empty($_POST["loggedOut"]))){
        try{
                if($_POST["loggedOut"] === '0'){
                    $stmtInsertUserRec = $dbh->prepare("INSERT INTO ACUserLogin(username, loginTime, loggedOut) 
                                                                  VALUES(:username, :loginTime, :loggedOut)");
                    $username = $_POST["username"];
                    $loginTime = $_POST["loginTime"];
                    $loggedOut = $_POST["loggedOut"];

                    $stmtInsertUserRec->bindParam(":username", $username);
                    $stmtInsertUserRec->bindParam(":loginTime", $loginTime);
                    $stmtInsertUserRec->bindParam(":loggedOut", $loggedOut);

                    $stmtInsertUserRec->execute();
                    echo "loggedUserIn";
                } else if($_POST["loggedOut"] === '1'){
                    $stmtInsertUserRec = $dbh->prepare("UPDATE ACUserLogin
                                                                  SET loggedOut = :loggedOut
                                                                  WHERE username = :username");
                    $username = $_POST["username"];
                    $loggedOut = $_POST["loggedOut"];

                    $stmtInsertUserRec->bindParam(":username", $username);
                    $stmtInsertUserRec->bindParam(":loggedOut", $loggedOut);

                    $stmtInsertUserRec->execute();
                    echo "loggedUserOut";
                }
        } catch(PDOException $e)
        {
            echo "Error: " . $e->getMessage();
        }
    } else if(!empty($_POST["loggedOut"] === '3')) {
    try{
        $stmtSelectUserLoggedCount = $dbh->prepare("SELECT username
                                                              FROM ACUserLogin
                                                              WHERE loggedOut = :loggedOut");

        $loggedOut = 0;

        $stmtSelectUserLoggedCount->bindParam(":loggedOut", $loggedOut);
        $stmtSelectUserLoggedCount->setFetchMode(PDO::FETCH_ASSOC);
        $stmtSelectUserLoggedCount->execute();

        $rows = array_reverse($stmtSelectUserLoggedCount->fetchAll());

        if(count($rows) > 0){
            echo $rows[0]['username'];
        } else {
            echo "";
        }

    } catch(PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
} else {
    echo "An error occurred";
}