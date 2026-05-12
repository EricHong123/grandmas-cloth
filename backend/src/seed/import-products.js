const { getDb } = require('../config/database')
const db = getDb()

// Delete old demo products (keep categories)
db.prepare('DELETE FROM products WHERE id IN (1,2,3,4)').run()

const products = [
  // ── Framed Wall Art ──
  {
    category_id: 1,
    title_en: 'Majestic Peacock Pair — Chinese Fabric Applique Wall Art',
    title_zh: '孔雀双栖',
    slug: 'majestic-peacock-pair-chinese-fabric-applique-wall-art',
    description_en: `<p>A breathtaking pair of peacocks rendered in layered silk and cotton fabrics. Each feather is individually cut, shaped, and stitched — creating a rich tapestry of iridescent blues, emerald greens, and gold accents that shift as light moves across the piece.</p>
<p>The peacock symbolizes beauty, dignity, and prosperity in Chinese culture. This piece brings that auspicious energy into any room.</p>
<p><strong>SEO Keywords:</strong> Chinese fabric applique wall art, handmade cloth mosaic painting, traditional Chinese textile art, peacock wall decor, Asian wall hanging, Bu Tie Hua cloth picture</p>`,
    description_zh: `<p>一对气势恢宏的孔雀，以层层丝绸和棉布精心拼贴而成。每一片羽毛都经过单独剪裁、塑形和缝制，在光线下呈现出蓝绿金的流光溢彩。</p><p>孔雀在中国文化中象征美丽、高贵与吉祥。</p>`,
    price: '$389', size: '70cm × 55cm',
    materials_en: 'Silk, cotton, linen on canvas board',
    materials_zh: '丝绸、棉布、麻布于画板',
    making_time: '3-4 weeks',
    images: ['/uploads/01-handmade-peacock-pair-fabric-applique-wall-art.png'],
    is_featured: 1,
  },
  {
    category_id: 1,
    title_en: 'Vintage Brass Telescope — Handmade Fabric Applique Art',
    title_zh: '古铜望远镜',
    slug: 'vintage-brass-telescope-handmade-fabric-applique-art',
    description_en: `<p>A meticulously crafted fabric mosaic of an antique brass telescope, built from layered textiles that capture the gleam of polished metal and the warmth of aged wood. The fabric selection — rich ochres, deep browns, and burnished golds — gives this piece a museum-quality antique feel.</p>
<p>Perfect for a study, library, or gentleman's office. A conversation piece that bridges nautical history and Chinese craft tradition.</p>
<p><strong>SEO Keywords:</strong> handmade fabric applique wall art, Chinese textile mosaic, vintage nautical decor, traditional Chinese craft, cloth mosaic picture, Asian folk art</p>`,
    description_zh: `<p>一件精心制作的布贴画，描绘了一架古董黄铜望远镜。层层织物捕捉了抛光金属的光泽和老木的温润质感。</p><p>适合书房、图书室或办公室，连接航海历史与中国手工传统。</p>`,
    price: '$329', size: '60cm × 45cm',
    materials_en: 'Cotton, linen, silk-accent on canvas board',
    materials_zh: '棉布、麻布、丝质点缀于画板',
    making_time: '2-3 weeks',
    images: ['/uploads/02-vintage-brass-telescope-handmade-fabric-applique-art.png'],
    is_featured: 1,
  },
  {
    category_id: 1,
    title_en: 'Antique Spyglass — Handmade Fabric Applique Wall Art',
    title_zh: '古董瞭望镜',
    slug: 'antique-spyglass-handmade-fabric-applique-wall-art',
    description_en: `<p>An antique spyglass brought to life through the ancient Chinese craft of cloth mosaic. Layers of fabric build depth and shadow, creating the illusion of brass, leather, and glass — all from cotton, linen, and silk.</p>
<p>A stunning piece for collectors of nautical antiques and lovers of traditional handicraft.</p>
<p><strong>SEO Keywords:</strong> Chinese fabric applique wall decor, handmade textile art, vintage spyglass decor, Bu Tie Hua cloth mosaic, traditional Asian wall hanging</p>`,
    description_zh: `<p>一件古董瞭望镜，通过中国古老的布贴画工艺赋予生命。层层布料营造出黄铜、皮革和玻璃的质感。</p><p>航海古董收藏家和手工艺术爱好者的绝佳之选。</p>`,
    price: '$299', size: '55cm × 42cm',
    materials_en: 'Cotton, linen, silk on canvas',
    materials_zh: '棉布、麻布、丝绸于画布',
    making_time: '2-3 weeks',
    images: ['/uploads/04-antique-spyglass-handmade-fabric-applique-wall-art.png'],
    is_featured: 0,
  },
  {
    category_id: 1,
    title_en: 'Classic Naval Telescope — Handmade Chinese Fabric Applique Art',
    title_zh: '经典航海望远镜',
    slug: 'classic-naval-telescope-handmade-fabric-applique-art',
    description_en: `<p>A classic naval telescope rendered in exquisite fabric applique. The artist's mastery shows in the subtle gradations of color — from deep mahogany to polished brass — all achieved through precise fabric selection and layering.</p>
<p>This piece celebrates both maritime heritage and Chinese intangible cultural heritage.</p>
<p><strong>SEO Keywords:</strong> Chinese fabric applique wall art, handmade cloth mosaic, naval telescope decor, traditional textile painting, Bu Tie Hua, Asian folk art wall hanging</p>`,
    description_zh: `<p>经典航海望远镜，以精美布贴画呈现。色彩渐变展现了匠人的精湛技艺。</p><p>致敬航海传统与中国非遗文化。</p>`,
    price: '$319', size: '58cm × 44cm',
    materials_en: 'Cotton, linen, brocade on canvas board',
    materials_zh: '棉布、麻布、织锦于画板',
    making_time: '2-3 weeks',
    images: ['/uploads/05-classic-naval-telescope-handmade-fabric-applique-art.png'],
    is_featured: 0,
  },
  {
    category_id: 1,
    title_en: 'Traditional Chinese Kite — Handmade Fabric Applique Art',
    title_zh: '传统纸鸢风筝',
    slug: 'traditional-chinese-kite-handmade-fabric-applique-art',
    description_en: `<p>A vibrant traditional Chinese kite soars across this fabric mosaic, its tail ribbons dancing in an imagined breeze. Bright reds, yellows, and blues evoke the joy of a spring festival sky.</p>
<p>Kites were invented in China over 2,000 years ago — this piece honors that legacy through another ancient Chinese craft.</p>
<p><strong>SEO Keywords:</strong> Chinese kite fabric art, handmade textile wall decor, traditional Chinese craft, folk art cloth painting, Asian wall hanging, intangible cultural heritage</p>`,
    description_zh: `<p>一只色彩斑斓的传统中国风筝在布贴画中翱翔。明亮的红黄蓝唤起春日节庆天空的喜悦。</p><p>风筝在中国有两千多年历史——这件作品用另一种古老手艺向其致敬。</p>`,
    price: '$279', size: '50cm × 40cm',
    materials_en: 'Cotton, silk, linen on canvas',
    materials_zh: '棉布、丝绸、麻布于画布',
    making_time: '2-3 weeks',
    images: ['/uploads/06-traditional-chinese-kite-handmade-fabric-applique-art.png'],
    is_featured: 1,
  },
  {
    category_id: 1,
    title_en: 'Antique Observatory Telescope — Fabric Applique Wall Art',
    title_zh: '古观象台望远镜',
    slug: 'antique-observatory-telescope-fabric-applique-wall-art',
    description_en: `<p>A grand observatory telescope reimagined in fabric — the intricate brass mechanics and polished lenses rendered through countless tiny fabric pieces. This is one of Grandma's most technically ambitious works.</p>
<p>A majestic statement piece for those who appreciate both science and traditional craftsmanship.</p>
<p><strong>SEO Keywords:</strong> Chinese fabric applique wall art, handmade textile mosaic, antique telescope decor, traditional craft wall hanging, Bu Tie Hua cloth art</p>`,
    description_zh: `<p>一架宏伟的观象台望远镜，以布贴画重新演绎。复杂的黄铜结构和抛光镜面由无数细小的布片构成，是奶奶最具技术难度的作品之一。</p>`,
    price: '$449', size: '75cm × 55cm',
    materials_en: 'Silk, cotton, linen, brocade on canvas board',
    materials_zh: '丝绸、棉布、麻布、织锦于画板',
    making_time: '4-5 weeks',
    images: ['/uploads/07-antique-observatory-telescope-fabric-applique-wall-art.png'],
    is_featured: 1,
  },
  {
    category_id: 1,
    title_en: 'Ancient Chinese Sailing Junk — Fabric Applique Wall Art',
    title_zh: '古帆船',
    slug: 'ancient-chinese-sailing-junk-fabric-applique-wall-art',
    description_en: `<p>An ancient Chinese sailing junk rides the waves in richly textured fabrics. The billowing sails catch golden light while the hull cuts through indigo waters — a scene that evokes the maritime Silk Road and centuries of Chinese seafaring history.</p>
<p>One of our most popular themes, beloved by collectors of nautical and Asian art alike.</p>
<p><strong>SEO Keywords:</strong> Chinese sailing junk fabric art, handmade textile wall decor, maritime silk road art, Asian nautical wall hanging, Bu Tie Hua cloth mosaic, traditional Chinese craft</p>`,
    description_zh: `<p>一艘中国古帆船在质感丰富的布料中破浪前行。鼓起的船帆映着金光，船体切开靛蓝海水——唤起海上丝绸之路的记忆。</p>`,
    price: '$369', size: '65cm × 48cm',
    materials_en: 'Cotton, linen, silk on canvas board',
    materials_zh: '棉布、麻布、丝绸于画板',
    making_time: '3-4 weeks',
    images: ['/uploads/08-ancient-chinese-sailing-junk-fabric-applique-wall-art.png'],
    is_featured: 1,
  },
  {
    category_id: 1,
    title_en: 'Storybook Rider & Floral Horse — Handmade Fabric Applique Art',
    title_zh: '童话骑士与花马',
    slug: 'storybook-rider-floral-horse-fabric-applique-wall-art',
    description_en: `<p>A whimsical scene straight from a storybook: a rider on a horse adorned with floral patterns, crafted in vibrant cotton and silk fabrics. The horse's mane blooms with embroidered flowers while the rider's garments ripple with texture.</p>
<p>Brings warmth, imagination, and folk-art charm to a child's room, nursery, or any space that needs a touch of wonder.</p>
<p><strong>SEO Keywords:</strong> handmade fabric horse wall art, Chinese folk art children decor, cloth applique nursery art, Bu Tie Hua textile picture, Asian whimsical wall hanging</p>`,
    description_zh: `<p>一个童话般的场景：骑手骑着装饰花卉图案的马，以鲜艳的棉布和丝绸制成。马鬃绽放刺绣花朵，骑手的衣裳纹理丰富。</p>`,
    price: '$299', size: '55cm × 42cm',
    materials_en: 'Cotton, silk, linen on canvas board',
    materials_zh: '棉布、丝绸、麻布于画板',
    making_time: '2-3 weeks',
    images: ['/uploads/09-storybook-rider-floral-horse-fabric-applique-wall-art.png'],
    is_featured: 0,
  },
  {
    category_id: 1,
    title_en: 'Lucky New Year Boy on Horse — Chinese Fabric Applique Wall Art',
    title_zh: '新春骑马福娃',
    slug: 'lucky-new-year-boy-horse-fabric-applique-wall-art',
    description_en: `<p>A joyful scene of celebration: a child riding a festively decorated horse, rendered in the bold reds and golds of Chinese New Year. Every fabric piece pulses with celebratory energy — from the horse's ornate saddle to the child's embroidered festival clothes.</p>
<p>Perfect for Chinese New Year decor, children's rooms, or as a meaningful housewarming gift symbolizing good fortune and new beginnings.</p>
<p><strong>SEO Keywords:</strong> Chinese New Year fabric wall art, handmade festival decor, lucky horse cloth mosaic, Asian celebration wall hanging, Bu Tie Hua, traditional folk art gift</p>`,
    description_zh: `<p>喜庆的新春场景：孩童骑着节日盛装的马，以中国新年的红金配色呈现。每块布料都洋溢着节日气息。</p><p>适合春节装饰、儿童房或作为象征好运的乔迁礼物。</p>`,
    price: '$349', size: '60cm × 50cm',
    materials_en: 'Cotton, silk, brocade on canvas board',
    materials_zh: '棉布、丝绸、织锦于画板',
    making_time: '3-4 weeks',
    images: ['/uploads/11-lucky-new-year-boy-on-horse-fabric-applique-wall-art.png'],
    is_featured: 1,
  },
  {
    category_id: 1,
    title_en: 'Dragon and Lion Dance — Chinese Fabric Applique Wall Art',
    title_zh: '舞龙舞狮',
    slug: 'dragon-and-lion-dance-fabric-applique-wall-art',
    description_en: `<p>Festive energy explodes across this fabric mosaic — a traditional dragon and lion dance captured in vivid silks and cottons. The dragon's golden scales shimmer while the lion's expressive face leaps from the frame. Red, gold, green, and cobalt blue create a visual celebration.</p>
<p>This piece embodies the spirit of Chinese festivals: joy, community, and the triumph of good over evil.</p>
<p><strong>SEO Keywords:</strong> Chinese dragon fabric wall art, lion dance handmade textile, festival decor Asian wall hanging, Bu Tie Hua cloth mosaic, traditional Chinese folk art, intangible cultural heritage craft</p>`,
    description_zh: `<p>节日气氛在这幅布贴画中迸发——传统的舞龙舞狮以鲜艳的丝绸和棉布呈现。金鳞闪烁，狮面灵动。红金绿蓝交织成一场视觉盛宴。</p>`,
    price: '$429', size: '70cm × 55cm',
    materials_en: 'Silk, cotton, brocade, linen on canvas board',
    materials_zh: '丝绸、棉布、织锦、麻布于画板',
    making_time: '4-5 weeks',
    images: ['/uploads/14-dragon-and-lion-dance-fabric-applique-wall-art.png'],
    is_featured: 1,
  },
  {
    category_id: 1,
    title_en: 'Rice Harvest Family — Handmade Fabric Applique Wall Art',
    title_zh: '丰收之家',
    slug: 'rice-harvest-family-fabric-applique-wall-art',
    description_en: `<p>A warm pastoral scene of a family working together in the rice fields — rendered in earthy tones of golden straw, deep green paddies, and sun-bleached cotton. This piece captures the soul of rural Chinese life: hard work, family bonds, and harmony with nature.</p>
<p>A deeply meaningful piece that resonates with anyone who values family, tradition, and the beauty of simple living.</p>
<p><strong>SEO Keywords:</strong> Chinese rural life fabric art, handmade harvest scene wall decor, traditional Asian textile painting, Bu Tie Hua cloth mosaic, folk art family wall hanging, Chinese countryside decor</p>`,
    description_zh: `<p>一幅温暖的田园场景：一家人在稻田里劳作。金黄稻草、翠绿稻田、日晒棉布的色调，捕捉了中国乡村生活的灵魂——勤劳、亲情、与自然的和谐。</p>`,
    price: '$349', size: '60cm × 45cm',
    materials_en: 'Cotton, linen, silk-accent on canvas board',
    materials_zh: '棉布、麻布、丝质点缀于画板',
    making_time: '3-4 weeks',
    images: ['/uploads/15-rice-harvest-family-handmade-fabric-applique-art.png'],
    is_featured: 0,
  },
  {
    category_id: 1,
    title_en: 'Countryside Music Gathering — Fabric Applique Wall Art',
    title_zh: '乡间音乐会',
    slug: 'countryside-music-gathering-fabric-applique-wall-art',
    description_en: `<p>Under a dappled tree, musicians gather with traditional instruments — the erhu's silk strings seem to vibrate even in fabric form. Soft greens, warm browns, and touches of instrument-lacquer red create a scene of timeless rural leisure.</p>
<p>A piece that speaks of community, music, and the simple pleasures of countryside life. Brings warmth and storytelling to any wall.</p>
<p><strong>SEO Keywords:</strong> Chinese music scene fabric art, handmade folk art wall hanging, traditional countryside textile decor, Bu Tie Hua cloth mosaic painting, Asian cultural wall art, Chinese heritage craft</p>`,
    description_zh: `<p>斑驳树影下，乐手们聚集演奏传统乐器。柔和的绿、温暖的棕、漆器红交织成永恒的乡村闲趣。</p><p>关于社群、音乐和田园生活之美的作品。</p>`,
    price: '$369', size: '65cm × 48cm',
    materials_en: 'Cotton, linen, silk on canvas board',
    materials_zh: '棉布、麻布、丝绸于画板',
    making_time: '3-4 weeks',
    images: ['/uploads/16-countryside-music-gathering-fabric-applique-wall-art.png'],
    is_featured: 1,
  },
  {
    category_id: 1,
    title_en: 'Traditional Weaving Loom — Fabric Applique Wall Art',
    title_zh: '传统织布机',
    slug: 'traditional-weaving-loom-fabric-applique-wall-art',
    description_en: `<p>A traditional Chinese wooden loom captured in exquisite fabric detail — every beam, thread, and shuttle rendered through precise fabric cutting and layering. The warm wood tones and vertical warp threads create a rhythmic composition that honors the craft of weaving itself.</p>
<p>A meta-tribute: one ancient craft (cloth mosaic) depicting another (weaving). Deeply meaningful for anyone who values handmade traditions.</p>
<p><strong>SEO Keywords:</strong> Chinese weaving loom fabric art, handmade textile craft wall decor, traditional loom painting cloth mosaic, Bu Tie Hua heritage art, Asian handicraft wall hanging, intangible cultural heritage</p>`,
    description_zh: `<p>一架传统中国木织布机以精美的布贴画呈现。每根横梁、丝线和梭子都经过精准的布料剪裁和层叠。温暖的木色和垂直经线构成富有节奏感的画面。</p><p>一件手工艺致敬另一件手工艺。</p>`,
    price: '$389', size: '70cm × 50cm',
    materials_en: 'Cotton, linen, silk, brocade on canvas board',
    materials_zh: '棉布、麻布、丝绸、织锦于画板',
    making_time: '3-4 weeks',
    images: ['/uploads/17-traditional-weaving-loom-fabric-applique-wall-art.png'],
    is_featured: 1,
  },
  // ── Table Decor ──
  {
    category_id: 2,
    title_en: 'Whimsical Bunny Doll — Handmade Fabric Applique Art',
    title_zh: '梦幻小兔布偶',
    slug: 'whimsical-bunny-doll-handmade-fabric-applique-art',
    description_en: `<p>An utterly charming bunny doll crafted from soft pastel fabrics. Floppy ears, a stitched-on smile, and a little fabric heart on its chest — every detail is handmade with love. Perfect as a nursery decoration, Easter display piece, or a one-of-a-kind gift for a child.</p>
<p>No two bunnies are ever exactly alike — each has its own personality stitched in.</p>
<p><strong>SEO Keywords:</strong> handmade fabric bunny doll, Chinese cloth art toy, children's nursery decor, Bu Tie Hua soft toy, Asian handmade doll, fabric applique gift</p>`,
    description_zh: `<p>一只用柔和粉彩布料制作的可爱兔子布偶。垂耳朵、缝制的微笑、胸前的小布心——每一处细节都手工打造。适合作为儿童房装饰、复活节摆件或独一无二的礼物。</p>`,
    price: '$79', size: '25cm × 18cm',
    materials_en: 'Cotton, felt, linen',
    materials_zh: '棉布、毛毡、麻布',
    making_time: '1-2 weeks',
    images: ['/uploads/03-whimsical-bunny-doll-handmade-fabric-applique-art.png'],
    is_featured: 0,
  },
  {
    category_id: 2,
    title_en: 'Colorful Bunny Doll — Handmade Fabric Applique Art',
    title_zh: '七彩小兔布偶',
    slug: 'colorful-bunny-doll-handmade-fabric-applique-art',
    description_en: `<p>A vibrant rainbow bunny that brings instant joy. Made from bright cotton fabrics in every color of the spectrum, this little companion sits beautifully on a desk, shelf, or bedside table. The hand-stitched details give it an heirloom quality that mass-produced toys can never match.</p>
<p>A cheerful gift for children, collectors of handmade dolls, or anyone who needs a pop of color in their life.</p>
<p><strong>SEO Keywords:</strong> handmade colorful bunny doll, Chinese fabric applique toy, children's gift cloth art, Bu Tie Hua soft sculpture, rainbow bunny decor, Asian handmade collectible</p>`,
    description_zh: `<p>一只充满活力的彩虹小兔。用七彩棉布制成，适合放在书桌、架子或床头柜上。手工缝制的细节赋予了批量玩具无法比拟的传家品质。</p>`,
    price: '$89', size: '28cm × 20cm',
    materials_en: 'Cotton, felt, linen',
    materials_zh: '棉布、毛毡、麻布',
    making_time: '1-2 weeks',
    images: ['/uploads/10-colorful-bunny-doll-handmade-fabric-applique-art.png'],
    is_featured: 0,
  },
  // ── Small Gifts ──
  {
    category_id: 4,
    title_en: 'Chinese New Year Festival Train — Fabric Applique Art',
    title_zh: '新春喜乐火车',
    slug: 'chinese-new-year-festival-train-fabric-applique-art',
    description_en: `<p>A charming festival train chugs through a landscape of celebration — each carriage carries a different lucky symbol: lanterns, firecrackers, golden ingots, and the Chinese character for fortune (福). Bright red and gold dominate, making this perfect for Chinese New Year gifting.</p>
<p>Small enough to display anywhere, meaningful enough to treasure forever. Makes a wonderful 春节 (Spring Festival) gift or housewarming present.</p>
<p><strong>SEO Keywords:</strong> Chinese New Year fabric train art, festival gift handmade cloth decor, lucky symbol textile wall art, Bu Tie Hua small gift, Asian celebration decor, traditional Chinese New Year craft</p>`,
    description_zh: `<p>一列喜气洋洋的节日小火车穿越庆典风景——每节车厢载着不同的幸运符号：灯笼、鞭炮、金元宝和福字。红金主调，适合春节送礼。</p>`,
    price: '$99', size: '35cm × 25cm',
    materials_en: 'Cotton, silk, brocade on board',
    materials_zh: '棉布、丝绸、织锦于木板',
    making_time: '1-2 weeks',
    images: ['/uploads/12-chinese-new-year-festival-train-fabric-applique-art.png'],
    is_featured: 0,
  },
  {
    category_id: 4,
    title_en: 'My Happy Family — Handmade Fabric Applique Wall Art',
    title_zh: '幸福一家人',
    slug: 'my-happy-family-handmade-fabric-applique-wall-art',
    description_en: `<p>A heartwarming family portrait in fabric — parents and children standing together under a warm sun, surrounded by flowers and butterflies. The soft, warm palette of rose, cream, and sky blue creates an atmosphere of love and togetherness.</p>
<p>A deeply personal piece that celebrates what matters most. Makes an unforgettable gift for parents, grandparents, or a new family home.</p>
<p><strong>SEO Keywords:</strong> family portrait fabric art, handmade Chinese cloth mosaic, personalized family wall decor, Bu Tie Hua textile painting, Asian family gift, traditional handmade home decor</p>`,
    description_zh: `<p>一幅温馨的布贴画全家福——父母和孩子站在暖阳下，周围环绕着花朵和蝴蝶。柔和的玫瑰色、奶油色和天蓝色营造出爱与团聚的氛围。</p>`,
    price: '$299', size: '50cm × 40cm',
    materials_en: 'Cotton, silk, linen on canvas board',
    materials_zh: '棉布、丝绸、麻布于画板',
    making_time: '2-3 weeks',
    images: ['/uploads/13-my-happy-family-handmade-fabric-applique-wall-art.png'],
    is_featured: 1,
  },
]

const insert = db.prepare(
  `INSERT INTO products (category_id, title_en, title_zh, slug, description_en, description_zh,
   price, size, materials_en, materials_zh, making_time, is_one_of_a_kind, images, is_featured, is_published)
   VALUES (@category_id, @title_en, @title_zh, @slug, @description_en, @description_zh,
   @price, @size, @materials_en, @materials_zh, @making_time, 1, @images, @is_featured, 1)`
)

const tx = db.transaction(() => {
  for (const p of products) {
    insert.run({
      ...p,
      images: JSON.stringify(p.images),
      category_id: p.category_id || null,
      making_time: p.making_time || '',
    })
  }
})
tx()

console.log(`Imported ${products.length} products.`)
process.exit(0)
