import mongoose from "mongoose";

interface PaymentAttrs {
	orderId: string;
	stripeId: string;
}

const paymentSchema = new mongoose.Schema({
	orderId: {
		type: String,
		required: true,
	},
	stripeId: {
		type: String,
		required: true,
	},
});

paymentSchema.set("toJSON", {
	transform(doc, ret) {
		ret.id = ret._id;
		delete ret._id;
	},
});

const PaymentModel = mongoose.model("Payments", paymentSchema);

class Payment extends PaymentModel {
	constructor(attrs: PaymentAttrs) {
		super(attrs);
	}
}

export { Payment };
