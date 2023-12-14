//This script is connected to DBobject which you can find in the hierarchy

using UnityEngine;
using UnityEngine.UI; // this line + Text dataText below + the dataText inside the while (reader.Read()) loop is a way to display code from the database
// Use the SQLite plugins
using Mono.Data.Sqlite;
using System.Data;
using System;
// remove System.Net.Mime and System.Diagnostics

public class CRUDforDB : MonoBehaviour
{
    public Text dataText; // Reference to the Text component in the UI (found inside the Canvas object(inside the hierarchy))
    private string connectionString;
    // Test values for inserting data
    private string direction;
    private int speed;

    // Start is called before the first frame update
    void Start()
    {
        // Create the database if it doesn't exist (Delete db file in assets folder if you get an error after adding a new table)
        connectionString = "URI=file:" + Application.dataPath + "/crane.db";
        // Test values for inserting data
        direction = "Right";
        speed = 10;

        // Create the database table if it doesn't exist (use this to create a new table)
        using (var connection = new SqliteConnection(connectionString))
        {
            connection.Open();

            var command = connection.CreateCommand();
            command.CommandText = "CREATE TABLE IF NOT EXISTS movement (Direction TEXT, Speed INT, Timestamp DATETIME)";
            command.ExecuteNonQuery();

            command.CommandText = "CREATE TABLE IF NOT EXISTS Spreader (Value TEXT)";
            command.ExecuteNonQuery();
        }
        // Insert the values into the database
        using (var connection = new SqliteConnection(connectionString))
        {
            connection.Open();

            var command = connection.CreateCommand();
            command.CommandText = "INSERT INTO movement (Direction, Speed, Timestamp) VALUES (@Direction, @Speed, @Timestamp)";
            command.Parameters.AddWithValue("@Direction", direction);
            command.Parameters.AddWithValue("@Speed", speed);
            command.Parameters.AddWithValue("@Timestamp", DateTime.Now);
            command.ExecuteNonQuery();
        }
        using (var connection = new SqliteConnection(connectionString))
        {
            connection.Open();

            using (var command = connection.CreateCommand())
            {
                // Select all the values from the database
                command.CommandText = "SELECT * FROM movement;";

                using (var reader = command.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        // Get the values from the database
                        string Direction = reader.GetString(0);
                        float Speed = reader.GetFloat(1);
                        DateTime timestamp = reader.GetDateTime(2);
                        // Print the value to the Unity console
                        Debug.Log("Direction: " + Direction + ", Speed: " + Speed + ", Timestamp: " + timestamp);
                        // Display the value in the UI (use void Update() to update the UI instead of only showing it once with Start())
                        dataText.text += "Direction: " + Direction;
                    }
                }
            }
        }
    }
    // Update is called once per frame
    void Update()
    {

    }
}