CREATE TABLE vs."voter" (
	"pk" SERIAL PRIMARY KEY,
	"firstName" VARCHAR(255) NOT NULL,
	"secondName" VARCHAR(255) NOT NULL,
    "nationalId" VARCHAR(255) NOT NULL UNIQUE,
	"password" TEXT NOT NULL,
	"token" TEXT DEFAULT NULL
);
CREATE INDEX voter_national_id ON vs."voter"("nationalId");


CREATE TABLE vs."admin" (
	"pk" SERIAL PRIMARY KEY,
	"firstName" VARCHAR(255) NOT NULL,
	"secondName" VARCHAR(255) NOT NULL,
	"loginName" VARCHAR(255) UNIQUE,
	"password" TEXT NOT NULL,
	"token" TEXT DEFAULT NULL
);
CREATE INDEX admin_login_name ON vs."admin"("loginName");


CREATE TABLE vs."poll" (
	"pk" SERIAL PRIMARY KEY,
	"pollName" VARCHAR(255) NOT NULL,
	"pollTotalVoters" INT DEFAULT 0,
    "pollTotalRivals" INT NOT NULL,
	"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE vs."pollRivals" (
	"pk" SERIAL PRIMARY KEY,
	"rivalName" VARCHAR(255) NOT NULL,
	"votersNumber" INT DEFAULT 0,
    "pollPk" INT REFERENCES vs."poll"("pk") ON DELETE CASCADE
);
CREATE INDEX poll_rival_poll_pk ON vs."pollRivals"("pollPk");




CREATE TABLE vs."pollVoters" (

    "rivalPk" INT REFERENCES vs."pollRivals"("pk") ON DELETE CASCADE,
	"rivalName" VARCHAR(255) NOT NULL,

	"voterName" VARCHAR(255) NOT NULL,
	"voterPk" INT REFERENCES vs."voter"("pk"),

	"pollPk" INT REFERENCES vs."poll"("pk") ON DELETE CASCADE,

	"createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX poll_voters_rival_pk ON vs."pollVoters"("rivalPk");

CREATE INDEX poll_voters_voter_pk ON vs."pollVoters"("voterPk");
CREATE INDEX poll_voters_poll_pk ON vs."pollVoters"("pollPk");

