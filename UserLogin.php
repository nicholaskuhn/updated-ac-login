<?php

/**
 * Run command to build PHPDoc:
 * phpDocumentor.phar -d . -t docs/api
 */

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
 * Setup database for UserLogin.php
 * 
 * @return void
 */
function setupDbUserLogin()
{
    global $dbh;
    // Usage for MySql
    $username = "nearizpe_NickA"; // "W01160019";
    $password = "DrFry2020"; // "Nicholascs!";
    $host = "localhost"; //db.cooldomain.com
    $dbname = "nearizpe_AnimalCrossingDB"; // "W01160019";

    try {
        $dbh = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    } catch (PDOException $err) {
        echo "I'm sorry user Dave. I can't do that. Error:" . $err->getMessage();
        die("Error:" . $err->getMessage());
    }

    $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
}

/**
 * Checks to see if you're trying to login as a new user or if somebody is already logged in.
 *
 * @param String username is the username clicked on
 * @param String loggedOut is for if the user is logging in or out
 * @param Date loginTime is for the date the user logged in/out
 * 
 * @return String Returns an error if the arguments aren't in an appropriate state
 *
 */
function determineSignIn()
{
    global $dbh;
    if (!empty($_POST["username"]) && !empty($_POST["loginTime"]) && ($_POST["loggedOut"] === '0' || !empty($_POST["loggedOut"]))) {
        logUserInOrOut();
    } else if (!empty($_POST["loggedOut"] === '3')) {
        initialLoginLoad();
    } else {
        echo "An error occurred";
    }
}

/**
 * 
 * If the no one is logged in (value = 0), inserts a record into the ACUserLogin table to "log" them in.
 * If they are logging out (value = 1), then it updates the record in ACUserLogin with the logged out value.
 * 
 * @param String username is the username clicked on
 * @param String loggedOut is for if the user is logging in or out
 * @param Date loginTime is for the date the user logged in/out
 * 
 * @return String Returns the status of the user, logged in or logged out
 */
function logUserInOrOut()
{
    global $dbh;

    try {
        if ($_POST["loggedOut"] === '0') {
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
        } else if ($_POST["loggedOut"] === '1') {
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
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}

/**
 * If loggedOut is (value = 3), this is the page loading up and getting the current login state.
 * 
 * @param String loggedOut is for if the user is logging in or out
 * 
 * @return String Returns the logged in person's username if someone is logged in
 */
function initialLoginLoad()
{
    global $dbh;

    try {
        $stmtSelectUserLoggedCount = $dbh->prepare("SELECT username
                                                        FROM ACUserLogin
                                                        WHERE loggedOut = :loggedOut");

        $loggedOut = 0;

        $stmtSelectUserLoggedCount->bindParam(":loggedOut", $loggedOut);
        $stmtSelectUserLoggedCount->setFetchMode(PDO::FETCH_ASSOC);
        $stmtSelectUserLoggedCount->execute();

        $rows = array_reverse($stmtSelectUserLoggedCount->fetchAll());

        if (!empty($rows)) {
            echo $rows[0]['username'];
        } else {
            echo "";
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}

setupDbUserLogin();
determineSignIn();
