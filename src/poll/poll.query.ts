export const pollQueries = {

    updateRivalVotersCount: `UPDATE vs."pollRivals" 
    SET "votersNumber" = "votersNumber" + 1
    WHERE "pk" = $1
    AND "pollPk" = $2
    AND "rivalName" = $3
    `,
    findPollByPk: `
    
SELECT 
p."pk" AS "pollPk",
p."pollName",
p."pollTotalVoters",
p."pollTotalRivals",
p."createdAt",
JSON_AGG(json_build_object( 
    'rivalPk', r."pk",
    'rivalName', r."rivalName",
    'votersNumber', r."votersNumber"
)) AS "rivals",
COALESCE(
    JSON_AGG(json_build_object( 
        'voterName', v."voterName",
        'voterPk', v."voterPk",
        'rivalPk', v."rivalPk"
    )) FILTER (WHERE v."voterPk" IS NOT NULL), 
    '[]'::json  
) AS "voterDetails"
FROM 
vs."poll" p
LEFT JOIN 
vs."pollRivals" r ON p."pk" = r."pollPk" 
LEFT JOIN 
vs."pollVoters" v ON p."pk" = v."pollPk" AND v."voterPk" = $1  
GROUP BY 
p."pk"
ORDER BY 
p."createdAt" DESC

WHERE p.pk = $2

    `,
    paginatePollToVoter: `
   
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
    `

}