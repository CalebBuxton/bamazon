var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "bamazon"
});

connection.connect(function(error) {
  if (error) throw error;
  runApp();
});

function runApp(){
  connection.query("SELECT item_id, product_name, price FROM products", function(error, data) {
    if (error) throw error
      console.log('ITEM ID  |  PRODUCT NAME  |  PRICE');
      console.log('===================================')
      for(var i = 0; i < data.length; i++){
        console.log(data[i].item_id +' | ' + data[i].product_name + ' | ' + data[i].price);
      }

      inquirer.prompt([{
        name: "id",
        message: 'Which Item ID Would You Like?'
      },
      {
        name: "quantity",
        message: "How Many Would You Like?"
      }
      ]).then(function(answers){
        connection.query("SELECT stock_quantity FROM products WHERE item_id = " + answers.id, function(error, stock){
          if (error) throw error
            var stock = stock[0].stock_quantity
            var quantity = parseInt(answers.quantity)
              if (stock >= quantity) {
                console.log("We have that")
                connection.query("UPDATE products SET stock_quantity = (stock_quantity - " + quantity + ") WHERE item_id = " + answers.id),
                connection.query("SELECT price FROM products WHERE item_id = " + answers.id, function(error, price){
                  if (error) throw error;
                  var price = price[0].price;
                  var total = (price * answers.quantity).toFixed(2);
                  console.log("Your Order Total is: $" + total)    
                })
                
              }
              else {
                console.log("Nope, dont have that here")
              }
        })

      })
  })
}


//update sql db
//show customer total cost of their order