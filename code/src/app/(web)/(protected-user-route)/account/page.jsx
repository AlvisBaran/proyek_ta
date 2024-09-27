import { redirect } from 'next/navigation'

export default function UserAccountRedirectorPage() {
  return redirect('/account/profile')
}
