import { Publisher, Subjects, TicketUpdatedEvent } from "@srstickets/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
	readonly subject = Subjects.TicketUpdated;
}
