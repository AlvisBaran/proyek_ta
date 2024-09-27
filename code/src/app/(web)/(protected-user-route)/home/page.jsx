import UserPageLayout from '../_components/layout'
import CreatorSearchBox from '../_components/ui/CreatorSearchBox'

export default function UserHomePage() {
  return (
    <UserPageLayout appbarTitle='Home'>
      <CreatorSearchBox />
    </UserPageLayout>
  )
}
