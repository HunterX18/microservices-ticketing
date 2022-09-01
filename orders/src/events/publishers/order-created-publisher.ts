import { Publisher, OrderCreatedEvent, Subjects } from "@srstickets/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
	readonly subject = Subjects.OrderCreated;
}
