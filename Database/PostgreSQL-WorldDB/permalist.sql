CREATE TABLE todo_list(
	id SERIAL PRIMARY KEY,
	task VARCHAR(50) NOT NULL UNIQUE
);

INSERT INTO todo_list(task) VALUES('Buy milk'), ('Finish homework');

SELECT * FROM todo_list;