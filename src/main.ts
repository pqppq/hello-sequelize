import { Sequelize, Op } from "sequelize"
import { UserSchema } from "./schema.js";

const sequelize = new Sequelize({
	dialect: "sqlite",
	storage: "./example.db",
	define: {
		// freezeTableName: true,
	}
})

// check db connection
try {
	await sequelize.authenticate()
	console.log("connection established");
} catch (error) {
	console.error("unable to connect to the database:", error);
}

const User = await UserSchema(sequelize)

// create a new user(same as build/save)
const john = await User.create({
	name: "John Do",
	age: 30
})

// delete user
// await john.destroy()

// rename
john.set("name", "John Dooooooooooooo")
await john.save()


const jane = await User.create({
	name: "Jane Do",
	age: 30,
	friendId: john.get("id")
})

// bulk creation
// by default, bulkCreate does not run validations on each object that is going to be created
await User.bulkCreate([
	{ name: "Jack Sparrow", age: 42 },
	{ name: "Will Turner", age: 28 },
	{ name: "Davy Jones", age: 120 }
])

// simple select query
// https://sequelize.org/docs/v6/core-concepts/model-querying-basics/#operators
const users = await User.findAll({
	attributes: ["id", "name", "age"],
	where: {
		id: {
			[Op.gt]: 4
		}
	},
	order: [
		["name", "ASC"]
	]
})
console.log("users:", users.map(user => {
	const id = user.get("id")
	const name = user.get("name")
	return `${id}: ${name}`
}));

// pagination
// await User.findAll({
// 	offset: 5,
// 	limit: 10,
// })

// simple update query
await User.update({ name: "Carlos" }, {
	where: {
		id: 5
	}
})

// row query
console.log(await sequelize.query("SELECT name, age from Users"));

// utility methods
console.log(`${await User.count()} users`);
console.log(`max age: ${await User.max("age")}`);

// simple delete query
await User.destroy({
	where: {
		id: {
			[Op.lt]: 3
		}
	}
})

// truncate the table
await User.destroy({
	truncate: true
})
