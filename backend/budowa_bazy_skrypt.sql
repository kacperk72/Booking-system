USE booking_system;

CREATE TABLE IF NOT EXISTS sale(
    SalaID int NOT NULL,
    IloscMiejsc int NOT NULL,
    NazwaSali text,
    PRIMARY KEY (SalaID)
);


CREATE TABLE IF NOT EXISTS rezerwacje(
    UserID int NOT NULL,
    SALA_ID int NOT NULL,
    Mail text,
    Data datetime,
    Potwierdzenie text,
    PRIMARY KEY (UserID),
    FOREIGN KEY (SALA_ID) REFERENCES sale(SalaID)
);
