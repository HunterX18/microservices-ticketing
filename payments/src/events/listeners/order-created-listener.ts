import { Listener, OrderCreatedEvent, Subjects } from "@srstickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
	queueGroupName = queueGroupName;

	async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
		const order = new Order({
			price: data.ticket.price,
			status: data.status,
			userId: data.userId,
			// version: data.version,
		});
		order.set({ _id: data.id });
		await order.save();
		msg.ack();
	}
}