import SEOHead from '../components/common/SEOHead'
import HeroBanner from '../components/common/HeroBanner'
import ArtisanHands from '../components/sections/ArtisanHands'
import ArtisanVideo from '../components/sections/ArtisanVideo'
import FeaturedProducts from '../components/sections/FeaturedProducts'
import StorySnippet from '../components/sections/StorySnippet'
import WorkshopPreview from '../components/sections/WorkshopPreview'

export default function HomePage() {
  return (
    <>
      <SEOHead />
      <HeroBanner />
      <ArtisanHands />
      <ArtisanVideo />
      <FeaturedProducts />
      <StorySnippet />
      <WorkshopPreview />
    </>
  )
}
