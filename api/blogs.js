// import { connectToDatabase } from "../lib/database.js";
import mongodb from "mongodb";

export default async function handler(req, res) {
	try {
		if (req.method === "GET") {
			return res.send("Hello");
			const db = await connectToDatabase();
			const blogs = db.collection("blogs");

			if (req.query.preview === "true") {
				console.log("getting preview");
				let blogsResult = await blogs.find({}).toArray();
				console.log(typeof blogsResult[0]);
				const previewResults = blogsResult.map((blog) => {
					delete blog["content"];
					return blog;
				});
				res.status(200).send(previewResults);
			} else if (isNaN(req.query.timestamp)) {
				const blogResult = await blogs.find({}).toArray(); // get all blogs from database here
				res.status(200).send(blogResult);
			} else {
				const blog = await blogs.findOne({
					timestamp: parseInt(req.query.timestamp),
				}); // add getting blog based on timestamp from database
				res.status(200).send(blog);
			}
		} else {
			res.status(501).send("only GET method is available");
		}
	} catch (err) {
		console.log(err);
		res.status(500).send("error occured when getting blog(s)");
	}
}

async function connectToDatabase() {
	const mongoClient = mongodb.MongoClient;

	const mongoURI = process.env.MONGODB_URI || "mongodb://localhost/blogg";

	console.log(mongoURI);

	const client = await mongoClient.connect(mongoURI);

	console.log(client);

	return client.db();
}
