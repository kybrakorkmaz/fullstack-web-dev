CREATE TABLE family_members(
	id SERIAL PRIMARY KEY,
	member_name VARCHAR(15)
);

CREATE TABLE visited_countries(
	id SERIAL PRIMARY KEY,
	country_code CHAR(2) NOT NULL UNIQUE
);
CREATE TABLE member_visited_country(
	member_id INTEGER REFERENCES family_memberS(id),
	country_id INTEGER REFERENCES visited_countries(id),
	PRIMARY KEY(member_id, country_id)
);

INSERT INTO family_members(member_name) VALUES('Kübra');
INSERT INTO visited_countries(country_code) VALUES('TR'), ('LT'), ('LV');
INSERT INTO member_visited_country(member_id, country_id) VALUES(1,1), (1,2), (1,3);

INSERT INTO family_members(member_name) VALUES('ÖZLEM');
INSERT INTO visited_countries(country_code) VALUES('ES');
INSERT INTO member_visited_country(member_id, country_id) VALUES(2, 1), (2, 4);

SELECT member_name, country_code
FROM member_visited_country AS mem_vis
JOIN family_members AS mem ON mem.id=mem_vis.member_id
JOIN visited_countries AS vis ON vis.id = mem_vis.country_id;

UPDATE family_members
SET member_name = 'Özlem'
WHERE member_name = 'ÖZLEM';

ALTER TABLE family_members
ADD COLUMN colors VARCHAR(15);

UPDATE  family_members
SET colors = 'yellow'
WHERE member_name = 'Kübra';

UPDATE  family_members
SET colors = 'violet'
WHERE member_name = 'Özlem';

UPDATE  family_members
SET colors = 'olive'
WHERE member_name = 'Ferhat';

ALTER TABLE family_members
ALTER COLUMN colors SET NOT NULL;

INSERT INTO member_visited_country(member_id, country_id)
VALUES(3, 6);

-- prevent dublication pairs --
ALTER TABLE member_visited_country
ADD UNIQUE (member_id, country_id);
