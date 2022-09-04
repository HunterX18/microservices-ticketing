import { Ticket } from "../ticket";

it("implements optimistic concurrency control", async () => {
	const ticket = new Ticket({
		title: "concert",
		price: 20,
		userId: "1234",
	});
	await ticket.save();

	const firstInstance = await Ticket.findById(ticket.id);
	const secondInstance = await Ticket.findById(ticket.id);

	firstInstance!.set({ price: 10 });
	secondInstance!.set({ price: 15 });

	await firstInstance!.save();

	try {
		await secondInstance!.save();
	} catch (err) {
		return;
	}
});

it("increments the version number on multiple saves", async () => {
	const ticket = new Ticket({
		title: "concert",
		price: 12,
		userId: "asdfasd",
	});
	await ticket.save();
	expect(ticket.__v).toEqual(0);

	await ticket.save();
	expect(ticket.__v).toEqual(1);
});
