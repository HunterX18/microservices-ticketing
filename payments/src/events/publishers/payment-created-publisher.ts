import { Subjects, Publisher, PaymentCreatedEvent } from "@srstickets/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
	readonly subject = Subjects.PaymentCreated;
}
