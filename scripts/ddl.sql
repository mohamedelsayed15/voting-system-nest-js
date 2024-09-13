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



CREATE TABLE vs."pollRivals" (
	"pk" SERIAL PRIMARY KEY,
	"rivalName" VARCHAR(255) NOT NULL,
	"votersNumber" INT DEFAULT 0,
    "pollPk" INT REFERENCES vs."poll"("pk") ON DELETE CASCADE
);
CREATE INDEX poll_rival_poll_pk ON vs."pollRivals"("pollPk");



SELECT json_build_object(
        'pollPk', p.pk,
		'pollName', p."pollName",
		'pollTotalVoters', p."pollTotalVoters",
		'pollTotalRivals', p."pollTotalRivals",
		'pollCreatedAt', p."createdAt",

        'rivals',(
            SELECT jsonb_agg(
                jsonb_build_object(
                    'rivalPk', pr."pk",
                    'rivalName', pr."rivalName",
                    'votersNumber', pr."votersNumber"
                )
            )
            FROM vs."pollRivals" pr
            WHERE "pollPk" = p.pk
        ),
        'voterDetails', (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'voterName', pv."voterName",
                    'voterPk', pv."voterPk",
                    'rivalPk', pv."rivalPk",
                    'rivalName', pv."rivalName"
                )
            )
            FROM vs."pollVoters" pv
            WHERE pv."pollPk" = p.pk
            AND pv."voterPk" = $1  
        )
    )

    FROM vs.poll p

ORDER BY p."createdAt" DESC

LIMIT $2
OFFSET $3



SELECT 
    p."pk" AS "pollPk",
    p."pollName",
    p."pollTotalVoters",
    p."pollTotalRivals",
    p."createdAt",
    JSON_AGG(json_build_object(  -- Aggregate rivals into a JSON array
        'rivalPk', r."pk",
        'rivalName', r."rivalName",
        'votersNumber', r."votersNumber"
    )) AS "rivals",
    COALESCE(
        JSON_AGG(json_build_object(  -- Aggregate voter details into a JSON array
            'voterName', v."voterName",
            'voterPk', v."voterPk",
            'rivalPk', v."rivalPk"
        )) FILTER (WHERE v."voterPk" IS NOT NULL), 
        '[]'::json  -- Default to an empty JSON array if no voter details
    ) AS "voterDetails"
FROM 
    vs."poll" p
LEFT JOIN 
    vs."pollRivals" r ON p."pk" = r."pollPk"  -- Join pollRivals on pollPk
LEFT JOIN 
    vs."pollVoters" v ON p."pk" = v."pollPk" AND v."voterPk" = $1  -- Join pollVoters on pollPk and filter by a specific voter ID
GROUP BY 
    p."pk"
ORDER BY 
    p."createdAt" DESC
LIMIT $2 OFFSET $3; 
