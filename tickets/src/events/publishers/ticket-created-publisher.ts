import { Publisher, Subjects, TicketCreatedEvent } from "@srstickets/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
	readonly subject = Subjects.TicketCreated;
}
