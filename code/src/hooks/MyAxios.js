import axios from 'axios'
import { headers } from 'next/headers'

export default axios.create({
  baseURL: `/service/`,
  headers: headers()
})
