var _sqlPackage = require("mssql");  
var connect = function()
{
    /*var conn= new _sqlPackage.ConnectionPool({
            
        server: "localhost\\SQLEXPRESS",  
        database: "shivkaalconstruction" , 
        user: "saadmin",  
        password: "Sba18430@", 
        options:{
            enableArithAbort:true
        }         
    
    }); */
	
	 var conn= new _sqlPackage.ConnectionPool({
            
        server: "shivkaal.cxs41pqanm57.us-east-2.rds.amazonaws.com",  
        database: "shivkaalconstruction" , 
        user: "admin",  
        password: "Sba18430", 
        options:{
            enableArithAbort:true
        }         
    
    });
    return conn;
}




module.exports=connect;

