import mongoose from "mongoose";
import { Password } from "../services/password";

interface UserAttrs {
	email: string;
	password: string;
}

const userSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
});

userSchema.set("toJSON", {
	transform(doc, ret) {
		ret.id = ret._id;
		delete ret._id;
		delete ret.password;
		delete ret.__v;
	},
});

userSchema.pre("save", async function (done) {
	if (this.isModified("password")) {
		const hashed = await Password.toHash(this.get("password"));
		this.set("password", hashed);
	}
	done();
});

const UserModel = mongoose.model("User", userSchema);

class User extends UserModel {
	constructor(attrs: UserAttrs) {
		super(attrs);
	}
}

export { User };
