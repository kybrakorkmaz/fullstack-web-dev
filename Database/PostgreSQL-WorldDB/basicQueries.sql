Select rice from food where country = 'United States';
Select country from food where wheat > 20;
Select country from food where country like 'U' || '%';
Select country from food where country like '%a';
Select country from food where country like 'U%';
Select country from food where country like '%' || 'a';
Insert Into food(country, rice, wheat) Values('Italy', 1.46, 7.3);
Select id, country, rice, wheat from food where country = 'Italy';

CREATE TABLE countries(
	id SERIAL PRIMARY KEY,
	country_code CHAR(2) NOT NULL UNIQUE,
	country_name VARCHAR(100) NOT NULL
);
