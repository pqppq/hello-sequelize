import { DataTypes, Sequelize, Model } from "sequelize"

interface UserSchemaAttributes {
	id: number
	name: string
	age: number
}

// define model
// validators: https://sequelize.org/docs/v6/core-concepts/validations-and-constraints/#per-attribute-validations
export const UserSchema = async (sequelize: Sequelize) => {
	const User = sequelize.define<Model<UserSchemaAttributes>>("User", {
		id: {
			type: DataTypes.INTEGER,
			autoIncrement: true,
			primaryKey: true
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true
		},
		age: {
			type: DataTypes.NUMBER,
			allowNull: false
		},
	}, {
		// https://sequelize.org/docs/v6/core-concepts/paranoid/
		paranoid: true,
	})

	// sync model with db
	await User.sync()

	return User
}
