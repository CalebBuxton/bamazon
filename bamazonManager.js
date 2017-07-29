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
  inquirer
    .prompt({
      name: "command",
      type: "rawlist",
      message: "Would you like to:",
      choices: ["VIEW PRODUCTS", "VIEW LOW INVENTORY", "ADD TO INVENTORY", "ADD NEW PRODUCT"]
    })
    .then(function(answer) {
      var command = answer.command.toUpperCase()
      if (command === "VIEW PRODUCTS") {
        viewProducts();
      }
      else if (command === "VIEW LOW INVENTORY") {
        lowInv();
      }
      else if (command === "ADD TO INVENTORY") {
      	addInv();
      }
      else {
      	addProduct();
      }
    });
};

function viewProducts() {
  connection.query("SELECT * FROM products", function(error, data) {
    if (error) throw error
    	items = [];
      for(var i = 0; i < data.length; i++){
      	items.push(new newItem(data[i].item_id, data[i].product_name, data[i].department_name, data[i].price, data[i].stock_quantity))     	
      }
      console.table("ALL ITEMS",items);
      runMore();
  })

}

function lowInv() {
  connection.query("SELECT * FROM products WHERE stock_quantity < 5", function(error, data) {
    if (error) throw error
    	items = [];
      for(var i = 0; i < data.length; i++){
        items.push(new newItem(data[i].item_id, data[i].product_name, data[i].department_name, data[i].price, data[i].stock_quantity));
      }
      console.table("LOW INVENTORY ITEMS",items);
      runMore();
  })

}

function addInv() {
  connection.query("SELECT * FROM products", function(error, data) {
    if (error) throw error
    	items = [];
      for(var i = 0; i < data.length; i++){
        items.push(new newItem(data[i].item_id, data[i].product_name));
      }
      console.table(items)
      inquirer.prompt([{
      	name: "id",
      	message: "Enter the Item ID of the item we are adding stock for"
      },
      {
      	name: "quantity",
      	message: "Enter the ammount of stock added"
      }]
      )
      .then(function(answers){
      	var item = parseInt(answers.id);
      	var quantity = parseInt(answers.quantity);
      	connection.query("UPDATE products SET stock_quantity = (stock_quantity + " + quantity + ") WHERE item_id = " + item, function(error){
      		if (error) throw error;
      		runMore();
      	})
      })
  })

}

function addProduct() {
	inquirer.prompt([
	{
		name: "name",
		message: "Product Name"
	},
	{
		name: "department",
		message: "What department is it for?"
	},
	{
		name: "price",
		message: "What is the cost? (Do NOT include the '$')"
	},
	{
		name: "stock",
		message: "How much stock are we adding?"
	}
	])
	.then(function(answers){
		var name = answers.name;
		var dept = answers.department;
		var price = answers.price;
		var stock = parseInt(answers.stock);
		connection.query("INSERT INTO products SET ?",
		{
			product_name: name,
			department_name: dept,
			price: price,
			stock_quantity: stock
		},
		function(error){
			if (error) throw error;
			console.log("New item added");
			runMore();
		})
	})
}

function runMore() {
	inquirer.prompt({
		name: "more",
		message: "Would you like to run another command (Y/N)?"
	})
	.then(function(answer){
		if (answer.more.toUpperCase() === "Y") {
			runApp();
		}
		else {
			console.log("Goodbye!");
			process.exit();
		}
	})
}

function newItem(id, name, dept, price, stock) {
   	this.ITEM_ID = id;
    this.PRODUCT_NAME = name;
    this.DEPARTMENT = dept;
    this.PRICE = price;
    this.IN_STOCK= stock;
}