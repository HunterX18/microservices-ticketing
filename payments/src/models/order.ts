import { OrderStatus } from "@srstickets/common";
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface OrderAttrs {
	userId: string;
	price: number;
	status: OrderStatus;
	// version: number;
}

const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	status: {
		type: String,
		required: true,
	},
	// version: {
	// 	type: Number,
	// 	required: true,
	// },
});

orderSchema.set("toJSON", {
	transform(doc, ret) {
		ret.id = ret._id;
		delete ret._id;
	},
});

orderSchema.plugin(updateIfCurrentPlugin);

const OrderModel = mongoose.model("Orders", orderSchema);

class Order extends OrderModel {
	constructor(attrs: OrderAttrs) {
		super(attrs);
	}
}

export { Order };
