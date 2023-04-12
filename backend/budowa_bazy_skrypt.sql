CREATE USER 'booking_system'@'localhost' IDENTIFIED BY '12345';
GRANT ALL ON booking_system.* To 'booking_system'@'localhost' WITH GRANT OPTION;
CREATE SCHEMA IF NOT EXISTS booking_system DEFAULT CHARACTER SET utf8 ;
USE booking_system ;

CREATE TABLE IF NOT EXISTS booking_system.sale (
  SalaID INT NOT NULL,
  IloscMiejsc INT NOT NULL,
  NazwaSali TEXT NOT NULL,
  TypSali TEXT NOT NULL,
  PRIMARY KEY (SalaID));

CREATE TABLE IF NOT EXISTS booking_system.rezerwacje (
  UserID INT NOT NULL,
  SALA_ID INT NOT NULL,
  Mail TEXT NULL,
  NazwaPrzedmiotu TEXT NULL,
  DataStartu DATETIME NOT NULL,
  DataKonca DATETIME NOT NULL,
  Potwierdzenie TEXT NOT NULL,
  PRIMARY KEY (UserID),
  INDEX (SALA_ID ASC) VISIBLE,
  CONSTRAINT fk_rezerwacje_sala
    FOREIGN KEY (SALA_ID)
    REFERENCES booking_system.sale (SalaID));
