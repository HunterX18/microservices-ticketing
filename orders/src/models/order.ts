import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";
import { OrderStatus } from "@srstickets/common";
import { Ticket } from "./ticket";

export { OrderStatus };

interface OrderAttrs {
	userId: string;
	status: OrderStatus;
	expiresAt: Date;
	ticket: Ticket["id"];
}

const orderSchema = new mongoose.Schema({
	userId: {
		type: String,
		required: true,
	},
	status: {
		type: String,
		required: true,
		enum: Object.values(OrderStatus),
		default: OrderStatus.Created,
	},
	expiresAt: {
		type: mongoose.Schema.Types.Date,
		required: true,
	},
	ticket: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Ticket",
	},
});

orderSchema.set("toJSON", {
	transform(doc, ret) {
		ret.id = ret._id;
		delete ret._id;
	},
});

orderSchema.plugin(updateIfCurrentPlugin);

const orderModel = mongoose.model("Order", orderSchema);

class Order extends orderModel {
	constructor(attrs: OrderAttrs) {
		super(attrs);
	}
	static async isReserved(ticket: mongoose.Document): Promise<boolean> {
		const existingOrder = await Order.findOne({
			ticket: ticket,
			status: {
				$in: [
					OrderStatus.Created,
					OrderStatus.AwaitingPayment,
					OrderStatus.Complete,
				],
			},
		});
		if (existingOrder) return true;
		return false;
	}
}

export { Order };
