import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

declare global {
	var signin: (id?: string) => string[];
}

jest.mock("../nats-wrapper");
process.env.STRIPE_KEY = "sk_test_51LfEGrK4iadHBUqAuSm1lQ2kZ83jl6gx11S44QKWSxRJ9ckplamVqRm4I4mEo43PYuljpdhv7fw3r7ZjTXQYgJtr009ZKS0d8d"
jest.setTimeout(60000)
let mongo: any;

beforeAll(async () => {
	process.env.JWT_KEY = "asdfa";
	mongo = await MongoMemoryServer.create();
	const mongoUri = mongo.getUri();
	await mongoose.connect(mongoUri);
});

beforeEach(async () => {
	jest.clearAllMocks();
	const collections = await mongoose.connection.db.collections();
	for (let collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	await mongo.stop();
	await mongoose.connection.close();
});

global.signin = (id?: string) => {
	const payload = {
		id: id || new mongoose.Types.ObjectId().toHexString(),
		email: "test@test.com",
	};
	const token = jwt.sign(payload, process.env.JWT_KEY!);
	const session = { jwt: token };
	const sessionJSON = JSON.stringify(session);
	const base64 = Buffer.from(sessionJSON).toString("base64");

	return [`session=${base64}`];
};
