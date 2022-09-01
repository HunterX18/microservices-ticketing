import { Subjects, Publisher, OrderCancelledEvent } from "@srstickets/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
	readonly subject = Subjects.OrderCancelled;
}
