export async function getScheduleBySlug(slug) {

  return new Promise((resolve, reject) => {
    /*
    resolve([
      {
        matchId: "3672365633332131",
        court: "1",
        stage: 'Group A'
      }
    ])
     */
    fetch(`https://www.volleytv.no/ss/profixio2json.php?slug=${slug}`)
      .then(r => r.json())
      .then(json => resolve(json))
  })
}
