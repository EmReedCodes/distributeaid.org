import { FunctionComponent, PropsWithChildren, ReactNode } from 'react'
import { Helmet } from 'react-helmet'
import Favicon from '@components/Favicon'
import Footer from '@components/Footer'
import MainMenu from '@components/nav/MainMenu/MainMenu'

interface Props {
  pageTitle: string
  pageDescription?: string
  className?: string
  footer?: ReactNode
}

const SimpleLayout: FunctionComponent<PropsWithChildren<Props>> = ({
  pageTitle,
  pageDescription,
  footer,
  children,
  className,
}) => (
  <>
    <Helmet
      title={`${pageTitle} - Distribute Aid`}
      htmlAttributes={{
        lang: 'en',
      }}
    >
      <meta
        name="description"
        content={
          pageDescription ??
          'Humanitarian aid delivery reimagined. By supporting a huge network of grassroots organisations, we ensure that donations get to where they are needed most.'
        }
      ></meta>
    </Helmet>
    <Favicon />
    <header>
      <MainMenu />
    </header>
    <main className={className}>{children}</main>
    {footer ? footer : <Footer />}
  </>
)

export default SimpleLayout
