import mongoose from "mongoose";
import { OrderStatus } from "@srstickets/common";
import { Ticket } from "./ticket";

// export enum OrderStatus {
// 	Created = "created",
// 	Cancelled = "cancelled",
// 	AwaitingPayment = "awaiting:payment",
// 	Complete = "complete",
// }

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

const orderModel = mongoose.model("Order", orderSchema);

class Order extends orderModel {
	constructor(attrs: OrderAttrs) {
		super(attrs);
	}
}

export { Order };
