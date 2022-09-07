import { OrderStatus } from "@srstickets/common";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { Order } from "../../models/order";
import { Payment } from "../../models/payment";
import { stripe } from "../../stripe";

it("returns 404 when purchasing order does not exist", async () => {
	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin())
		.send({
			orderId: new mongoose.Types.ObjectId().toHexString(),
			token: "tok_visa",
		})
		.expect(404);
});

it("returns a 401 when purchasing order does not belong to user", async () => {
	const order = new Order({
		userId: new mongoose.Types.ObjectId().toHexString(),
		price: 20,
		status: OrderStatus.Created,
	});
	await order.save();
	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin())
		.send({
			orderId: order.id,
			token: "tok_visa",
		})
		.expect(401);
});

it("return 400 when purchasing cancelled order", async () => {
	const userId = new mongoose.Types.ObjectId().toHexString();

	const order = new Order({
		userId,
		price: 20,
		status: OrderStatus.Cancelled,
	});
	await order.save();
	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin(userId))
		.send({
			orderId: order.id,
			token: "tok_visa",
		})
		.expect(400);
});

it("returns a 201 with valid inputs", async () => {
	const userId = new mongoose.Types.ObjectId().toHexString();
	const price = Math.floor(Math.random() * 100000);
	const order = new Order({
		userId,
		price,
		status: OrderStatus.Created,
	});
	await order.save();

	await request(app)
		.post("/api/payments")
		.set("Cookie", global.signin(userId))
		.send({
			orderId: order.id,
			token: "tok_visa",
		})
		.expect(201);
	const stripeCharges = await stripe.charges.list({ limit: 10 });
	const stripeCharge = stripeCharges.data.find((charge) => {
		return charge.amount === price * 100;
	});
	expect(stripeCharge).toBeDefined();

	const payment = await Payment.findOne({
		stripeId: stripeCharge?.id,
		orderId: order.id,
	});
	expect(payment).not.toBeNull();
});
