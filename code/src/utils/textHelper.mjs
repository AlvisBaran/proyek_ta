import { round } from "./mathHelper"

export const copyToClipboard = (text, consoleIt = false) => {
  try {
    var textField = document.createElement('textarea')
    textField.innerText = text
    document.body.appendChild(textField)
    textField.select()
    document.execCommand('copy')
    textField.remove()
    if (consoleIt) window.alert(`Text copied! ${text}`)
    return true;
  }
  catch (e) {
    console.error(e)
    if (consoleIt) window.alert('Text failed to be copied!')
    return false;
  }
}

const htmlTagsIndexes = [
  "<div>", "</div>", "<p>", "</p>", "<a>", "</a>", "<br>", "<br/>", "<br />", "<h1>", "</h1>",
  "<h2>", "</h2>", "<h3>", "</h3>", "<h4>", "</h4>", "<h5>", "</h5>", "<h6>", "</h6>",
  "<b>", "</b>", "<i>", "</i>", "<u>", "</u>", "<strong>", "</strong>", "<em>", "</em>",
  "<abbr>", "</abbr>", "<address>", "</address>", "<blockquote>", "</blockquote>",
  "<bdo>", "</bdo>", "<pre>", "</pre>", "<ul>", "</ul>", "<ol>", "</ol>", "<li>", "</li>",
  "<table>", "</table>", "<thead>", "</thead>", "<tbody>", "</tbody>", "<tr>", "</tr>",
  "<th>", "</th>", "<td>", "</td>",
];
export function cleanHTMLFromTextV1(text) {
  htmlTagsIndexes.forEach((tag) => { text = text.replaceAll(tag, " ") });
  return text.trim();
}

export const getShortenNumber = (value) => {
  let result = value.toString();
  // if (value >= 1000 && value < 10000) result = String(value/1000) + "K"
  if (value >= 1000 && value < 10000) result = (value%1000>=100?round(value/1000, 1).toFixed(1):round(value/1000, 0).toFixed(0)) + "K"
  return result;
}

export const getWhatsappShareLink = (text, title) => {
  return "https://web.whatsapp.com/send?text=" 
  + (title ?? "Lihat apa yang saya share!%0a")
  + text;
}

export const getWhatsappDirectLink = (phone, text, title) => {
  const numberOnly = /^\d+$/.test(phone);
  if (!numberOnly) return undefined;
  if (phone.charAt(0)==="0") phone = phone.replace("0", "62")
  return `https://web.whatsapp.com/send?phone=${phone}&text=`
  + (title ?? "Halo, saya pengunjung pada web anda!%0a")
  + text;
}

export const getTwitterShareLink = (link) => {
  return "https://twitter.com/share?url="
  + link;
}

export const getForumEmailShareLink = (title, link) => {
  return `mailto:?subject=${title}&body=Baca ${title} di Forum GKT Pondok Indah - ${link}`;
}

// %3A = :
// %2F = /
// %0a = enter

// https://twitter.com/share?url=https://www.kaskus.co.id/thread/633526e5011f9e307b34435f/massage-panggilan-jakarta-terpercaya---aurelspamassagecom

// https://web.whatsapp.com/send?text=https://www.kaskus.co.id/thread/633526e5011f9e307b34435f/massage-panggilan-jakarta-terpercaya---aurelspamassagecom/

// mailto:?subject=MAN%20CITY%20VS%20MU%3A%20MAU%20BIKIN%20BERAPA%20GOL%2C%20HAALAND%3F&body=MAN%20CITY%20VS%20MU%3A%20MAU%20BIKIN%20BERAPA%20GOL%2C%20HAALAND%3F - https%3A%2F%2Fwww.kaskus.co.id%2Fthread%2F6335c78e91885010d547d46c%2Fman-city-vs-mu-mau-bikin-berapa-gol-haaland%2F%3Futm_source%3Demail%26utm_medium%3Dsocial%26utm_content%3D%26utm_campaign%3Dorganic-share
