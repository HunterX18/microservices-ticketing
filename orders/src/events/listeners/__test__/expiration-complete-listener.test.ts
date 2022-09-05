import { natsWrapper } from "../../../nats-wrapper";
import { ExpirationCompleteListener } from "../expiration-complete-listener";
import { Ticket } from "../../../models/ticket";
import { Order, OrderStatus } from "../../../models/order";
import { ExpirationCompleteEvent } from "@srstickets/common";
import { Message } from "node-nats-streaming";

const setup = async () => {
	const listener = new ExpirationCompleteListener(natsWrapper.client);
	const ticket = new Ticket({
		title: "concert",
		price: 20,
	});
	await ticket.save();

	const order = new Order({
		status: OrderStatus.Created,
		userId: "sdgasg",
		expiresAt: new Date(),
		ticket,
	});
	await order.save();

	const data: ExpirationCompleteEvent["data"] = {
		orderId: order.id,
	};
	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};
	return { listener, order, ticket, data, msg };
};

it("updates the order status to cancelled", async () => {
	const { listener, order, data, msg } = await setup();
	await listener.onMessage(data, msg);

	const updatedOrder = await Order.findById(order.id);
	expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it("emits an OrderCancelled event", async () => {
	const { listener, order, data, msg } = await setup();
	await listener.onMessage(data, msg);
	expect(natsWrapper.client.publish).toHaveBeenCalled();
	const eventData = JSON.parse(
		(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]
	);
	expect(eventData.id).toEqual(order.id);
});

it("ack the message", async () => {
	const { listener, data, msg } = await setup();
	await listener.onMessage(data, msg);

	expect(msg.ack).toHaveBeenCalled();
});
