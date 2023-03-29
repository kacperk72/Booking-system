CREATE USER 'booking_system'@'localhost' IDENTIFIED BY '12345';

GRANT ALL ON booking_system.* To 'booking_system'@'localhost' WITH GRANT OPTION;

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
