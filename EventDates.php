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
} catch (PDOException $err) {
    echo "I'm sorry user Dave. I can't do that. Error:" . $err->getMessage();
    die("Error:" . $err->getMessage());
}

$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

if (!empty($_POST["eventName"]) && !empty($_POST["eventDescription"]) && !empty($_POST["eventDate"])) {
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
} else if (!empty($_POST["eventDate"]) && !empty($_POST["get"])) {
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
} else if (empty($_POST["eventDate"]) && (!empty($_POST["get"]) && $_POST["get"] === '2')) {
    try {

        $stmtSelectEvent = $dbh->prepare("SELECT eventDate
                                                    FROM ACCalendarEvents");

        $stmtSelectEvent->execute();

        $row = $stmtSelectEvent->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($row);
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
} else {
    echo "Sorry, an error occurred";
}
