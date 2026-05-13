import { Helmet } from 'react-helmet-async'

export function JsonLd({ data }) {
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(data)}
      </script>
    </Helmet>
  )
}

/* ── Organization schema (site-wide) ── */
export const orgSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: "Grandma's Cloth",
  alternateName: 'Cloth Mosaic Art Studio',
  description: '4th-generation Chinese intangible cultural heritage cloth mosaic (Bu Tie Hua) art studio in Humen, Guangdong. Handcrafted fabric applique wall art by artisan Luo Yifang.',
  url: 'https://grandmascloth.com',
  logo: 'https://grandmascloth.com/images/logo.webp',
  image: 'https://grandmascloth.com/images/logo.webp',
  email: 'hello@grandmascloth.com',
  telephone: '+8613532328175',
  foundingDate: '1980',
  founder: {
    '@type': 'Person',
    name: 'Luo Yifang',
    alternateName: '罗燕芳',
    jobTitle: '4th-generation Cloth Mosaic Artisan',
  },
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Humen',
    addressRegion: 'Guangdong',
    addressCountry: 'CN',
  },
  sameAs: [
    'https://grandmascloth.com',
  ],
  knowsAbout: [
    'Chinese Cloth Mosaic Art',
    'Bu Tie Hua',
    'Fabric Applique Wall Art',
    'Intangible Cultural Heritage',
    '布贴画',
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    contactType: 'Sales',
    telephone: '+8613532328175',
    availableLanguage: ['English', 'Chinese'],
  },
}

/* ── Person schema (Luo Yifang) ── */
export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Luo Yifang',
  alternateName: ['罗燕芳', '罗姨', 'Grandma Luo'],
  description: '4th-generation Chinese cloth mosaic (Bu Tie Hua) artisan from Humen, Guangdong. Over 40 years of experience creating handmade fabric applique wall art. Featured by Guangzhou News, Humen News, and Humen Daily.',
  jobTitle: 'Cloth Mosaic Artisan',
  birthPlace: { '@type': 'Place', name: 'Humen, Guangdong, China' },
  knowsAbout: [
    'Bu Tie Hua',
    'Chinese Cloth Mosaic',
    'Fabric Applique Art',
    'Intangible Cultural Heritage',
    'Traditional Chinese Crafts',
  ],
  image: 'https://grandmascloth.com/images/grandma-at-work.webp',
  url: 'https://grandmascloth.com/our-story',
  sameAs: [],
  worksFor: {
    '@type': 'Organization',
    name: "Grandma's Cloth",
    url: 'https://grandmascloth.com',
  },
}

/* ── BreadcrumbList ── */
export function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map(({ name, url }, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name,
      item: url,
    })),
  }
}

/* ── Product schema ── */
export function productSchema(product) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title_en,
    description: (product.description_en || '').replace(/<[^>]*>/g, '').substring(0, 300),
    sku: `GC-${product.id}`,
    image: product.images || [],
    url: `https://grandmascloth.com/collection/${product.slug}`,
    brand: {
      '@type': 'Brand',
      name: "Grandma's Cloth",
    },
    offers: {
      '@type': 'Offer',
      price: (product.price || '0').replace(/[^0-9.]/g, ''),
      priceCurrency: 'USD',
      availability: product.is_published ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: {
        '@type': 'Person',
        name: 'Luo Yifang',
      },
    },
    productionDate: product.created_at?.substring(0, 4),
    material: (product.materials_en || '').split(',').map(s => s.trim()).filter(Boolean),
  }
}

/* ── Article schema ── */
export function articleSchema(post) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title_en,
    description: post.excerpt || '',
    image: post.cover_image || undefined,
    url: `https://grandmascloth.com/blog/${post.slug}`,
    datePublished: post.created_at,
    author: {
      '@type': 'Person',
      name: "Grandma's Cloth",
    },
    publisher: {
      '@type': 'Organization',
      name: "Grandma's Cloth",
      logo: { '@type': 'ImageObject', url: 'https://grandmascloth.com/images/logo.webp' },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://grandmascloth.com/blog/${post.slug}`,
    },
  }
}

/* ── FAQ schema ── */
export function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question_en,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer_en,
      },
    })),
  }
}
