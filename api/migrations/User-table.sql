create table "User"
(
    "ID"      bigint generated always as identity
        primary key,
    name      varchar(255) not null,
    email     varchar(255) not null,
    phone     varchar(255) not null,
    birthdate varchar      not null
);

alter table "User"
    owner to postgres;