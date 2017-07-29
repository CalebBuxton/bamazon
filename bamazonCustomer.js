var mysql = require("mysql");
var inquirer = require("inquirer");
require('console.table');

var items = []

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
  items = [];
  connection.query("SELECT item_id, product_name, price FROM products", function(error, data) {
    if (error) throw error
      for(var i = 0; i < data.length; i++){
        items.push(new newItem(data[i].item_id, data[i].product_name, data[i].price));
      }
      console.table("ALL ITEMS", items)
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
                  newOrder();    
                })
                
              }
              else {
                console.log("Nope, dont have that here")
                newOrder();
              }
        })

      })
  })
}

function newItem(id, name, price) {
    this.ITEM_ID = id;
    this.PRODUCT_NAME = name;
    this.PRICE = price;
}

function newOrder() {
  inquirer.prompt({
    name: "new",
    message: "Would you like to place another order (Y/N)?"
  })
  .then(function(answer){
    if (answer.new.toUpperCase() === "Y") {
      runApp();
    }
    else {
      console.log("Thank you for using Bamazon!");
      process.exit();
    }
  })
}