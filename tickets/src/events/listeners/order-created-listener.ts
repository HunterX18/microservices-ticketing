import { Listener, OrderCreatedEvent, Subjects } from "@srstickets/common";
import { Message } from "node-nats-streaming";
import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
	queueGroupName = queueGroupName;
	async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
		const ticket = await Ticket.findById(data.ticket.id);

		if (!ticket) throw new Error("Ticket not found");

		ticket.set({ orderId: data.id });

		await ticket.save();
		new TicketUpdatedPublisher(this.client).publish({
			id: ticket.id,
			price: ticket.price,
			title: ticket.title,
			userId: ticket.userId,
			orderId: ticket.orderId,
			version: ticket.__v,
		});
		msg.ack();
	}
}
