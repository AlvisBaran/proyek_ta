import NextAuthClientSessionProvider from '@/components/NextAuthClientSessionProvider'
import AppWrapper from '@/app/(web)/_components/appWrapper'
import '@/styles/globals.css'

export const metadata = {
  title: 'Panthreon',
  description: 'App for you as a creator to share your content with others'
}

export default async function RootLayout({ children }) {
  return (
    <html lang='en'>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='anonymous' />
        <link
          rel='stylesheet'
          href='https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap'
        />
        <link rel='stylesheet' href='https://fonts.googleapis.com/icon?family=Material+Icons' />
        <link rel='icon' href='/favicon.ico' />
      </head>
      <body style={{ minHeight: '100vh' }}>
        <NextAuthClientSessionProvider>
          <AppWrapper>{children}</AppWrapper>
        </NextAuthClientSessionProvider>
      </body>
    </html>
  )
}
