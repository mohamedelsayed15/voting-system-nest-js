export const voterQueries = {

    createVoter: `
    INSERT INTO vs.voter("firstName", "secondName", "nationalId", "password")
    VALUES ($1, $2, $3, $4) RETURNING *
    `
}
