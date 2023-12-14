  public function db()
    {
        try {

            $dsn = "mysql:host=$this->host;dbname=$this->dbname;charset=$this->charset";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];
            try {
                $this->db = new PDO($dsn, $this->user, $this->pass, $options);
            } catch (\PDOException $e) {
                throw new \PDOException($e->getMessage(), (int)$e->getCode());
            }

        } catch (\Connect $exception ) {

        }
    }

    public function myDb(){
        return $this->db;

    }
    
    public function insertData($voornaam,$achternaam,$straat,$postcode,$woonplaats,$email,$hash,$table){
          
     $sql = "INSERT INTO $table SET voornaam=:voornaam,achternaam=:achternaam,straat=:straat,postcode=:postcode,
     woonplaats=:woonplaats,email=:email,wachtwoord=:hash";
          
     $q = $this->db->prepare($sql);
          
     $q->execute(array(':voornaam'=>$voornaam,':achternaam'=>$achternaam,':straat'=>$straat,':postcode'=>$postcode,
     ':woonplaats'=>$woonplaats,':email'=>$email,':hash'=>$hash));
           
     return true;
           
    }  

    public function ReadEmployeeEmail($username,$table){
    $username = $_POST["username"];
    $wachtwoord = $_POST["wachtwoord"];

    $sql = "SELECT * FROM user WHERE name = ?";
    $stmt = $this->db->prepare($sql);
    $stmt->execute(array($username));
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    if($result){
    $wachtwoordDB = $result["password"];
    
    if(password_verify($wachtwoord,$wachtwoordDB)){
        echo "<br>succesvolle login!";
        echo "<br>";
        
        
        $_SESSION["ID"] = session_id();
        $_SESSION["USER_ID"] = $result["id"];
        // $_SESSION["PERM"] = "Customer";
        $_SESSION["USER_NAME"] = $result["name"];
        // $_SESSION["E-MAIL"] = $result["email"];
        $_SESSION["STATUS"] = "ACTIEF";
        $_SESSION["ROL"] = 1;
        header('Location: admin-dashboard.php');
    }else{
        echo "<br>Wachtwoord of Naam komt niet overeen";
    }
  }           
}
     
public function deleteData($id,$table){
        
    $sql="DELETE FROM $table WHERE id=:id";
    $q = $this->db->prepare($sql);
    $q->execute(array(':id'=>$id));
        
    return true;
        
}

public function updateStatus($ID,$table){
    $status = "Geaccepteerd" ;  
   
    $sql = "UPDATE $table SET Status = 'Geaccepteerd' WHERE afspraakID = :ID";
     $q = $this->db->prepare($sql);
     $q->execute(array(':ID'=>$ID));
     return true;
    
     }