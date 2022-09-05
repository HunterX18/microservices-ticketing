import {
	ExpirationCompleteEvent,
	Listener,
	OrderStatus,
	Subjects,
} from "@srstickets/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import { OrderCancelledPublisher } from "../publishers/order-cancelled-publisher";
import { queueGroupName } from "./queue-group-name";

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete;
	queueGroupName = queueGroupName;

	async onMessage(data: ExpirationCompleteEvent["data"], msg: Message) {
		const order = await Order.findById(data.orderId).populate("ticket");
		if (!order) throw new Error("Order not found");
		order.set({ status: OrderStatus.Cancelled });
		await order.save();
		new OrderCancelledPublisher(this.client).publish({
			id: order.id,
			version: order.__v,
			ticket: {
				id: order.ticket!.id.toString(),
			},
		});

		msg.ack();
	}
}
