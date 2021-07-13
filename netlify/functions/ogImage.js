const fetch = require("node-fetch")
exports.handler = async function (event,context) {

  const dateTimeFormatDefaults = {
    locale: 'en-US',
    timeZone: 'America/New_York',
    day: 'numeric',
    month: 'long',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric'
  }

  const formatter = Intl.DateTimeFormat('en-US', dateTimeFormatDefaults)

  // Find the next occurence of any day of the week based upon the date
  // If we are on the day of the week we're looking for, it should land on the same day
  function nextOccurrence(date, dayOfWeek) {
    const currentDate = date ? new Date(date) : new Date();
    const nextDate = new Date(currentDate);
    // debugger
    nextDate.setDate(currentDate.getDate() + (7 + dayOfWeek - currentDate.getDay()) % 7)
    
    // Set the time we want for UTC. 6:30PM EDT is 10:30PM UTC 
    nextDate.setUTCHours(22)
    nextDate.setUTCMinutes(30)
    nextDate.setUTCSeconds(0)
    nextDate.setUTCMilliseconds(0)
    return nextDate
  }

  const date = formatter.format(nextOccurrence(undefined, 2)).toLocaleString(dateTimeFormatDefaults)
  const text = "Next Stream on " + encodeURIComponent(date.replace(/,/g, ""))

  const ogImageUrl = `https://res.cloudinary.com/maxcell/image/upload/w_1289,h_676/w_700,x_100,y_425,c_fit,g_south_west,l_text:Roboto_50_bold:${text}/large_stream_thumbnail_nzimbu.png`

  let image;
  const result = await fetch(ogImageUrl);
  image = await result.buffer()

  return {
    statusCode: 200,
    headers: {
      'Content-type': 'image/jpeg'
    },
    body: image.toString('base64'),
    isBase64Encoded: true
  }
}