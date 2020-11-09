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

    if(!empty($_POST["adding"])){
        try{
            if(!empty($_POST["itemName"]) && !empty($_POST["donatorName"]) &&
                !empty($_POST["dateDonated"]) && !empty($_POST["itemType"]) &&
                (preg_match('/^[a-zA-Z\s]+$/', $_POST["itemName"]))){
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
            } else if (preg_match('/^[a-zA-Z\s]+$/', $_POST["itemName"])){
                echo "Please enter a valid item name";
            } else if (empty($_POST["donatorName"])) {
                echo "Please make sure you're signed in";
            } else if (empty($_POST["itemName"])) {
                echo "Please enter an item into the field";
            } else {
                echo "An error occurred when inserting your record";
            }

        } catch(PDOException $e)
    {
        echo "Error: " . $e->getMessage();
    }
} else {
    try{
        if(!empty($_POST["itemName"])){
            $stmtSelectItems = $dbh->prepare("SELECT * FROM ACMuseumRecords WHERE itemName LIKE CONCAT('%', :itemName, '%') ");

            $itemName = $_POST["itemName"];

            $stmtSelectItems->bindParam(":itemName", $itemName);

            $stmtSelectItems->execute();

        $row = $stmtSelectItems->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode($row);
        }
    } catch(PDOException $e)
    {
        echo "Error: " . $e->getMessage();
    }
}
