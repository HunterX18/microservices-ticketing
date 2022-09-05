import {
	Subjects,
	Publisher,
	ExpirationCompleteEvent,
} from "@srstickets/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
	readonly subject = Subjects.ExpirationComplete;
}
