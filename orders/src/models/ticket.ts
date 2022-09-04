import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

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

TicketSchema.plugin(updateIfCurrentPlugin);

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
	static findByEvent(event: { id: string; version: number }) {
		return Ticket.findOne({
			_id: event.id,
			__v: event.version - 1,
		});
	}
}

export { Ticket };
