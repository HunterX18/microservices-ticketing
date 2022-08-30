import mongoose from "mongoose";

interface TicketAttrs {
	title: string;
	price: number;
}

const TicketSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
		min: 0,
	},
});

TicketSchema.set("toJSON", {
	transform(doc, ret) {
		ret.id = ret._id;
		delete ret._id;
	},
});


const ticketModel = mongoose.model("Ticket", TicketSchema);

class Ticket extends ticketModel {
	constructor(attrs: TicketAttrs) {
		super(attrs);
	}
}

export { Ticket };
