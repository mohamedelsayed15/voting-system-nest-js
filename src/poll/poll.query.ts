export const pollQueries = {
    createPoll: `INSERT INTO vs.poll("pollName", "pollTotalRivals") 
    VALUES ($1, $2) RETURNING *`,

    insertRival: `INSERT INTO vs."pollRivals"
    ("rivalName", "pollPk") VALUES ($1, $2) RETURNING *`,

    updateRivalVotersCount: `UPDATE vs."pollRivals" 
    SET "votersNumber" = "votersNumber" + 1
    WHERE "pk" = $1
    AND "pollPk" = $2
    AND "rivalName" = $3
    `,

    updatePollVotersCount: `UPDATE vs."poll" 
    SET "pollTotalVoters" = "pollTotalVoters" + 1
    WHERE "pk" = $1
    `,


    insertIntoPollVoters: `
    INSERT INTO vs."pollVoters"
    ("rivalPk", "rivalName", "voterName", "voterPk", "pollPk")
    VALUES ($1, $2, $3, $4, $5) RETURNING *
    `,

    selectLogFromPollVoters: `
    SELECT *
    FROM vs."pollVoters"
    WHERE "pollPk" = $1
    AND  "voterPk" = $2
    `,

    paginatePollToVoter: `
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
    `

}