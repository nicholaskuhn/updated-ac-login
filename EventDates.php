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
 * If eventName, eventDescription, and eventDate are all provided, will insert an event into the database.
 * If eventDate and get are provided, this will return the event from the database in a JSON.
 * If eventDate is null and get is (value = 2), this is the initial load, which loads the calendar and provides
 * date highlighting on said calendar.
 * 
 * @param String eventName is the event name entered by the user
 * @param String eventDescription is the event description entered by the user
 * @param String eventDate is the date the user specified
 * @param boolean get is just so the PHP knows which function to call
 * 
 * @return String Returns an error to notify the user if something unexpected happened
 */
function determineEventProcess()
{
    if (!empty($_POST["eventName"]) && !empty($_POST["eventDescription"]) && !empty($_POST["eventDate"])) {
        insertEventIntoCalendar();
    } else if (!empty($_POST["eventDate"]) && !empty($_POST["get"])) {
        returnDayEventData();
    } else if (empty($_POST["eventDate"]) && (!empty($_POST["get"]) && $_POST["get"] === '2')) {
        initialEventLoadIntoCalendar();
    } else {
        echo "Sorry, an error occurred";
    }
}

/**
 * Inserts an event into the database based on user input
 * 
 * @param String eventName is the event name entered by the user
 * @param String eventDescription is the event description entered by the user
 * @param String eventDate is the date the user specified
 * 
 * @return String Returns a notification to let the user know the event was inserted successfully
 */
function insertEventIntoCalendar()
{
    global $dbh;
    try {

        $stmtInsertEvent = $dbh->prepare("INSERT INTO ACCalendarEvents(eventName, eventDescription, eventDate) 
                                            VALUES(:eventName, :eventDescription, :eventDate)");
        $eventName = $_POST["eventName"];
        $eventDescription = $_POST["eventDescription"];
        $eventDate = $_POST["eventDate"];

        $stmtInsertEvent->bindParam(":eventName", $eventName);
        $stmtInsertEvent->bindParam(":eventDescription", $eventDescription);
        $stmtInsertEvent->bindParam(":eventDate", $eventDate);
        $stmtInsertEvent->execute();

        echo "Event inserted successfully!";
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}

/**
 * Returns the information of an event for the given date
 * 
 * @param String eventDate is the date to get event info from
 * 
 * @return JSON Returns a json with the event info
 */
function returnDayEventData()
{
    global $dbh;
    try {

        $stmtSelectEvent = $dbh->prepare("SELECT *
                                            FROM ACCalendarEvents
                                            WHERE eventDate = :eventDate");
        $eventDate = $_POST["eventDate"];

        $stmtSelectEvent->bindParam(":eventDate", $eventDate);
        $stmtSelectEvent->execute();

        $row = $stmtSelectEvent->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($row);
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}

/**
 * This is called for the initial load of the application. This function will provide highlighting
 * for the calendar on the front end
 * 
 * @return JSON Returns a JSON with the dates in which events exist to highlight on the calendar
 */
function initialEventLoadIntoCalendar()
{
    global $dbh;
    try {

        $stmtSelectEvent = $dbh->prepare("SELECT eventDate
                                            FROM ACCalendarEvents");

        $stmtSelectEvent->execute();

        $row = $stmtSelectEvent->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($row);
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}

setupDbUserLogin();
determineEventProcess();
