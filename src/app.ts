import express from 'express';

const app = express();

app.use(express.json());

app.get('/test', (req, res) => {
	res.status(200).json({
		tests: [{ id: 1, name: 'Some test' }],
	});
});

export default app;
