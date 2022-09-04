import mongoose from "mongoose";
import { TicketUpdatedEvent } from "@srstickets/common";
import { TicketUpdatedListener } from "../ticket-updated-listener";
import { natsWrapper } from "../../../nats-wrapper";
import { Ticket } from "../../../models/ticket";
import { Message } from "node-nats-streaming";

const setup = async () => {
	const listener = new TicketUpdatedListener(natsWrapper.client);
	const ticket = new Ticket({
		title: "Concert",
		price: 20,
	});
	await ticket.save();
	const data: TicketUpdatedEvent["data"] = {
		id: ticket.id,
		version: ticket.__v + 1,
		title: "Movie",
		price: 100,
		userId: "hunterx",
	};

	// @ts-ignore
	const msg: Message = {
		ack: jest.fn(),
	};

	return { msg, data, listener, ticket };
};

it("finds, updates, saves a ticket", async () => {
	const { msg, data, ticket, listener } = await setup();
	await listener.onMessage(data, msg);

	const updatedTicket = await Ticket.findById(ticket.id);
	expect(updatedTicket!.title).toEqual(data.title);
	expect(updatedTicket!.price).toEqual(data.price);
});

it("acks the message", async () => {
	const { msg, listener, data } = await setup();

	await listener.onMessage(data, msg);
	expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version", async () => {
	const { msg, data, listener } = await setup();

	data.version = 10;
	try {
		await listener.onMessage(data, msg);
	} catch (err) {}
	expect(msg.ack).not.toHaveBeenCalled();
});
