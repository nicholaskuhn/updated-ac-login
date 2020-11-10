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
 * Setup database for MuseumDb
 * 
 * @return void
 */
function setupDbMuseumDb()
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
 * Determines whether to add an item to the museum's database or query from it.
 * 
 * @param boolean adding is used to tell the PHP which SQL to run
 * 
 * @return void
 */
function addItemOrQueryMuseumDb()
{
    if (!empty($_POST["adding"])) {
        addItemToMuseumDb();
    } else {
        returnItemsFromDb();
    }
}

/**
 * Enters an item into the museum's database based on the user's input.
 * 
 * @param String itemNameParam is the item name
 * @param String donatorNameParam is the user currently signed in
 * @param Date dateDonatedParam is the current date
 * @param String itemTypeParam is the radio button item type selected
 * 
 * @return String Returns a string informing the user of whether or not the item was added successfully to the database
 */
function addItemToMuseumDb()
{
    global $dbh;
    try {
        if (
            !empty($_POST["itemName"]) && !empty($_POST["donatorName"]) &&
            !empty($_POST["dateDonated"]) && !empty($_POST["itemType"]) &&
            (preg_match('/^[a-zA-Z\s]+$/', $_POST["itemName"]))
        ) {
            $stmtInsertItem = $dbh->prepare("INSERT INTO ACMuseumRecords(itemName, donatorName, dateDonated, itemType) 
                                                VALUES(:itemName, :donatorName, :dateDonated, :itemType)");
            $itemName = $_POST["itemName"];
            $donatorName = $_POST["donatorName"];
            $dateDonated = $_POST["dateDonated"];
            $itemType = $_POST["itemType"];

            $stmtInsertItem->bindParam(":itemName", $itemName);
            $stmtInsertItem->bindParam(":donatorName", $donatorName);
            $stmtInsertItem->bindParam(":dateDonated", $dateDonated);
            $stmtInsertItem->bindParam(":itemType", $itemType);
            $stmtInsertItem->execute();

            echo "Record inserted successfully!";
        } else if (preg_match('/^[a-zA-Z\s]+$/', $_POST["itemName"])) {
            echo "Please enter a valid item name";
        } else if (empty($_POST["donatorName"])) {
            echo "Please make sure you're signed in";
        } else if (empty($_POST["itemName"])) {
            echo "Please enter an item into the field";
        } else {
            echo "An error occurred when inserting your record";
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}

/**
 * Takes the user's input and returns info related to the data that matches
 * the user's input.
 * 
 * @return JSON returns a JSON with the data for the item searched
 */
function returnItemsFromDb()
{
    global $dbh;
    try {
        if (!empty($_POST["itemName"])) {
            $stmtSelectItems = $dbh->prepare("SELECT * 
                                                FROM ACMuseumRecords 
                                                WHERE itemName LIKE CONCAT('%', :itemName, '%') ");

            $itemName = $_POST["itemName"];

            $stmtSelectItems->bindParam(":itemName", $itemName);

            $stmtSelectItems->execute();

            $row = $stmtSelectItems->fetchAll(PDO::FETCH_ASSOC);
            echo json_encode($row);
        }
    } catch (PDOException $e) {
        echo "Error: " . $e->getMessage();
    }
}

setupDbMuseumDb();
addItemOrQueryMuseumDb();
