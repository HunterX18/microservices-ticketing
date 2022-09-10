import { Message } from "node-nats-streaming";
import { Subjects, TicketUpdatedEvent, Listener } from "@srstickets/common";
import { Ticket } from "../../models/ticket";
import { queueGroupName } from "./queue-group-name";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
	queueGroupName = queueGroupName;

	async onMessage(data: TicketUpdatedEvent["data"], msg: Message) {
		const ticket = await Ticket.findByEvent({
			id: data.id,
			version: data.version,
		});
		if (!ticket) throw new Error("Ticket not found");
		const { title, price } = data;
		ticket.set({ title, price });
		await ticket.save();

		msg.ack();
	}
}
