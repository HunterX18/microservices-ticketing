// import mongoose, { version } from "mongoose";
// import { updateIfCurrentPlugin } from "mongoose-update-if-current";

// interface ticketAttrs {
// 	title: string;
// 	price: number;
// 	userId: string;
// }

// const ticketSchema = new mongoose.Schema({
// 	title: {
// 		type: String,
// 		required: true,
// 	},
// 	price: {
// 		type: Number,
// 		required: true,
// 	},
// 	userId: {
// 		type: String,
// 		required: true,
// 	},
// 	orderId: {
// 		type: String,
// 		required: false,
// 	},
// });

// ticketSchema.set("toJSON", {
// 	transform(doc, ret) {
// 		ret.id = ret._id;
// 		delete ret._id;
// 	},
// });

// ticketSchema.plugin(updateIfCurrentPlugin);

// const TicketModel = mongoose.model("Ticket", ticketSchema);

// class Ticket extends TicketModel {
// 	constructor(attrs: ticketAttrs) {
// 		super(attrs);
// 	}
// }

// export { Ticket };
import mongoose from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface TicketAttrs {
	title: string;
	price: number;
	userId: string;
}

interface TicketDoc extends mongoose.Document {
	title: string;
	price: number;
	userId: string;
	orderId?: string;
	version: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
	build(attrs: TicketAttrs): TicketDoc;
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
	orderId: {
		type: String,
		required: false,
	},
});

ticketSchema.set("toJSON", {
	transform(doc, ret) {
		ret.id = ret._id;
		delete ret._id;
	},
});

ticketSchema.statics.build = (attrs: TicketAttrs) => {
	return new Ticket(attrs);
};

ticketSchema.set("versionKey", "version");
ticketSchema.plugin(updateIfCurrentPlugin);

const Ticket = mongoose.model<TicketDoc, TicketModel>("Ticket", ticketSchema);

export { Ticket };
