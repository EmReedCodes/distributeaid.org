import { FC } from 'react'
import SimpleLayout from '@layouts/Simple'
import { graphql } from 'gatsby'
import '../stylesheets/donate.css'
import Footer from '@components/Footer'
import { WaysToDonate } from './donate'
import { summarizeFundraisers } from 'data/summarizeFundraisers'
import { FundraisersOverview } from '@components/fundraiser/FundraisersOverview'
import { FundraiserProgress } from '@components/fundraiser/FundraiserProgress'
import { Fundraiser } from '@components/fundraiser/Fundraiser'

const DonatePage: FC<{
  data: {
    markdownRemark: {
      frontmatter: {
        title: string
        pageTitle: string
        currencyConversionsToEUR: {
          currency: string
          conversionRate: number
        }[]
      }
    }
    allDaFundraiser: {
      nodes: Fundraiser[]
    }
    thumbnails350px: {
      nodes: {
        parent: {
          absolutePath: string
        }
        gatsbyImageData: any
      }[]
    }
  }
}> = ({
  data: {
    markdownRemark: {
      frontmatter: { title, pageTitle, currencyConversionsToEUR },
    },
    allDaFundraiser: { nodes: fundraisers },
    thumbnails350px: { nodes: thumbnails350px },
  },
}) => {
  fundraisers.forEach((fundraiser) => {
    fundraiser.gallery = fundraiser.gallery.map((photo) => {
      const gatsbyImageData = thumbnails350px.find(
        ({ parent: { absolutePath } }) => absolutePath.endsWith(photo.url),
      )?.gatsbyImageData
      if (gatsbyImageData === undefined) {
        console.error(`Could not find gatsbyImageData for ${photo.url}`)
      }
      return {
        ...photo,
        gatsbyImageData,
      }
    })
  })

  return (
    <SimpleLayout
      pageTitle={pageTitle}
      pageDescription={title}
      className={'donate'}
      footer={<Footer showDonateButton={false} />}
    >
      <div className="bg" />
      <header>
        <h1>{title}</h1>
      </header>
      {fundraisers.length > 0 && (
        <>
          <FundraiserProgress
            title={'Overall campaign progress'}
            fundraiser={{
              currency: 'EUR',
              ...summarizeFundraisers(fundraisers, currencyConversionsToEUR),
            }}
            converted={true}
          />
          <FundraisersOverview fundraisers={fundraisers} />
        </>
      )}
      <section className="ways-to-donate">
        <WaysToDonate />
      </section>
    </SimpleLayout>
  )
}

export default DonatePage

export const pageQuery = graphql`
  query DonateQuery {
    markdownRemark(fileAbsolutePath: { glob: "**/content/pages/donate.md" }) {
      frontmatter {
        title
        pageTitle
        currencyConversionsToEUR {
          currency
          conversionRate
        }
      }
    }
    allDaFundraiser {
      nodes {
        id
        name
        title
        target
        raised
        currency
        abstract
        gallery {
          url
          alt
        }
      }
    }
    thumbnails350px: allImageSharp(
      filter: { original: { src: { glob: "/static/**" } } }
    ) {
      nodes {
        parent {
          ... on File {
            absolutePath
          }
        }
        gatsbyImageData(width: 350)
      }
    }
  }
`
