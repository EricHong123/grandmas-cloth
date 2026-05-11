import { Helmet } from 'react-helmet-async'

export default function SEOHead({ title, description, image, path }) {
  const site = "Grandma's Cloth — Chinese Cloth Mosaic"
  const fullTitle = title ? `${title} | ${site}` : site
  const desc = description || 'Handcrafted Chinese cloth mosaic paintings by a living heritage artisan. Each piece one of a kind.'
  const url = path ? `https://grandmascloth.com${path}` : 'https://grandmascloth.com'

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      {image && <meta property="og:image" content={image} />}
      <link rel="canonical" href={url} />
    </Helmet>
  )
}
