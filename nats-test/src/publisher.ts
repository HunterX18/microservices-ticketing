import nats from "node-nats-streaming";

const stan = nats.connect("ticketing", "abc", {
	url: "http://localhost:4222",
});

console.clear();

stan.on("connect", () => {
	console.log("Publisher connected to nats");
	const data = JSON.stringify({
		id: "213",
		title: "concert",
		price: 20,
	});
	stan.publish("ticket:created", data, () => {
		console.log("event published");
	});
});
