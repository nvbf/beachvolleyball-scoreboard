export async function getScheduleBySlug(slug) {
  return fetch(`https://www.volleytv.no/ss/profixio2json.php?slug=${slug}`)
    .then(r => r.json())
}
