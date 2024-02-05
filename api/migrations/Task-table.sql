create table tasks
(
    "ID"        serial
        primary key,
    title       varchar(255) not null,
    description varchar(255) not null,
    due_date    varchar(255) not null,
    "Task Lead" varchar(255) not null,
    "Support 1" varchar(255) not null,
    "Trainee"   varchar(255) not null,
    priority    varchar(255) not null,
    status      varchar(255) not null,
    created_at  timestamp    not null,
    updated_at  timestamp    not null
);

alter table tasks
    owner to postgres;