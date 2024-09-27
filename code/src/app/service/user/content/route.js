import { responseString } from '@/backend/helpers/serverResponseString'
import Content from '@/backend/models/content'

// ** User > Content > Get / Search Content
export async function GET() {
  // TODO: Tambahin algoritma, syarat, membersip, dll serta pagination
  let contents = []
  return await Content.findAll()
    .then((resp = []) => {
      resp?.map(datum =>
        contents.push({
          ...datum?.dataValues
        })
      )

      return Response.json(contents, { status: 200 })
    })
    .catch(err => {
      return Response.json({ message: responseString.SERVER.SERVER_ERROR }, { status: 500 })
    })
}
