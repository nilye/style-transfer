import * as xml2js from 'xml2js';

export async function parseXml(data) {
  const parser = new xml2js.Parser();
  try {
    let json = await parser.parseStringPromise(data);
    if (json.xml) {
      json = json.xml;
    }
    Object.keys(json).forEach(key => {
      if (Array.isArray(json[key]) && json[key].length === 1) {
        json[key] = json[key][0];
      }
    });
    return json;
  } catch (err) {
    return null;
  }
}
