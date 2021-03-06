function streetmixUserToAPI (userURL) { // eslint-disable-line no-unused-vars
  // this takes in a user facing Streetmix.net URL like https://streetmix.net/kfarr/3/a-frame-city-builder-street-only
  // and turns it into the API redirect URL like https://streetmix.net/api/v1/streets?namespacedId=3&creatorId=kfarr
  const pathArray = new URL(userURL).pathname.split('/')
  const creatorId = pathArray[1]
  const namespacedId = pathArray[2]
  if (creatorId === '-') {
    return location.host + '/api/v1/streets?namespacedId=' + namespacedId
  } else {
    return location.host + '/api/v1/streets?namespacedId=' + namespacedId + '&creatorId=' + creatorId
  }
}
module.exports.streetmixUserToAPI = streetmixUserToAPI

function pathStartsWithAPI (urlString) {
  // First, check the URL path to see if it starts with /api/
  const url = document.createElement('a')
  url.href = urlString
  const pathname = url.pathname
  const topDir = pathname.split('/')[1]
  return (topDir === 'api')
}
module.exports.pathStartsWithAPI = pathStartsWithAPI

function streetmixAPIToUser (APIURL) { // eslint-disable-line no-unused-vars
  // this takes in a Streetmix.net API redirect URL like https://streetmix.net/api/v1/streets?namespacedId=3&creatorId=kfarr
  // and turns it into the user facing friendly Streetmix.net URL like https://streetmix.net/kfarr/3/a-frame-city-builder-street-only

  // modified from: https://stackoverflow.com/questions/2090551/parse-query-string-in-javascript
  function getQueryVariable (queryString, variable) {
    const vars = queryString.split('&')
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=')
      if (decodeURIComponent(pair[0]) === variable) {
        return decodeURIComponent(pair[1])
      }
    }
    console.log('Query variable %s not found', variable)
  }
  const queryString = new URL(APIURL).search.substring(1)
  const namespacedId = getQueryVariable(queryString, 'namespacedId')
  let creatorId = getQueryVariable(queryString, 'creatorId')
  if (typeof creatorId === 'undefined') {
    creatorId = '-'
  }

  return 'https://streetmix.net/' + creatorId + '/' + namespacedId
}
module.exports.streetmixAPIToUser = streetmixAPIToUser

function calcStreetWidth (segments) { // eslint-disable-line no-unused-vars
  let cumulativeWidthInMeters = 0
  segments.forEach((currentSegment) => {
    const segmentWidthInFeet = currentSegment.width
    const segmentWidthInMeters = segmentWidthInFeet * 0.3048
    cumulativeWidthInMeters = cumulativeWidthInMeters + segmentWidthInMeters
  })
  return cumulativeWidthInMeters
}
module.exports.calcStreetWidth = calcStreetWidth
