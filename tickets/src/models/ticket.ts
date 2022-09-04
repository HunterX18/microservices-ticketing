import mongoose, { version } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface ticketAttrs {
	title: string;
	price: number;
	userId: string;
}

const ticketSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
	},
	price: {
		type: Number,
		required: true,
	},
	userId: {
		type: String,
		required: true,
	},
});

ticketSchema.set("toJSON", {
	transform(doc, ret) {
		ret.id = ret._id;
		delete ret._id;
	},
});

// ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

const TicketModel = mongoose.model("Ticket", ticketSchema);

class Ticket extends TicketModel {
	constructor(attrs: ticketAttrs) {
		super(attrs);
	}
}

export { Ticket };
