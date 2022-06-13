create database contact_app;

drop table if exists contacts;
drop table if exists categories;

create table contacts (
	contact_id serial not null primary key,
	contactname character varying(50) not null,
	phoneNamber character varying(25) not null,
	category_id smallint not null,
	deleted boolean default false
);
create table categories (
	category_id serial not null primary key,
	category_name character varying(50) not null
);
insert into contacts (contactname, phoneNamber, category_id,deleted) values
('ali','+998991234567', 4,true),
('umar','+998915071010', 2,false),
('oybek aka','+998997777777', 3,false),
('aziz','+998990000001', 4,false),
('ali','+998991234567', 4,true),
('umar','+998915071010', 2,false),
('oybek aka','+998997777777', 3,false),
('aziz','+998990000001', 4,false);
insert into categories (category_name) values
('Kursdoshlar'),
('Oila a`zosi'),
('Do`st'),
('Hamkasb'),
('Tanishim');
