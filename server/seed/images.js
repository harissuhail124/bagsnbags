/**
 * Bags'n'Bags Curated Image Catalog
 * Neutral backgrounds, warm light, 4:5 aspect ratio (?w=900&h=1125&fit=crop)
 */

module.exports = {
  hero: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&h=1125&fit=crop&q=80",
  about: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1125&fit=crop&q=80",
  editorial: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=900&h=1125&fit=crop&q=80",
  categories: {
    backpacks: {
      name: "Backpacks",
      slug: "backpacks",
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1125&fit=crop&q=80",
      description: "Structured rucksacks and daypacks tailored for daily carry, cycling, and travel."
    },
    handbags: {
      name: "Handbags",
      slug: "handbags",
      imageUrl: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&h=1125&fit=crop&q=80",
      description: "Sculpted shoulder and crossbody bags in tumbled and smooth vegetable-tanned leathers."
    },
    totes: {
      name: "Totes",
      slug: "totes",
      imageUrl: "https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&h=1125&fit=crop&q=80",
      description: "Open-top and zip-top carryalls crafted from heavy-weight duck canvas and harness leather."
    },
    "laptop-bags": {
      name: "Laptop Bags",
      slug: "laptop-bags",
      imageUrl: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&h=1125&fit=crop&q=80",
      description: "Padded tech briefcases and messenger folios holding devices up to 16 inches."
    },
    travel: {
      name: "Travel Bags",
      slug: "travel",
      imageUrl: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1125&fit=crop&q=80",
      description: "Weekender duffels, garment sleeves, and carry-ons sized for overhead bins."
    },
    accessories: {
      name: "Wallets & Small Goods",
      slug: "accessories",
      imageUrl: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&h=1125&fit=crop&q=80",
      description: "Bifold wallets, cardholders, passport sleeves, and zip pouches cut from bridle leather."
    }
  },

  products: [
    // BACKPACKS (5)
    {
      title: "Atelier Field Backpack",
      categoryKey: "backpacks",
      price: 245,
      material: "18oz dry waxed army duck canvas & bridle leather",
      color: "Oak Tan",
      dimensions: "44cm x 31cm x 14cm",
      capacity: "21 Litres",
      weight: "1.15 kg",
      stock: 14,
      featured: true,
      description: "A weatherproof daily pack constructed from paraffin-waxed cotton canvas. Finished with saddle-stitched harness straps and a padded interior sleeve for up to 15\" laptops.",
      details: ["Internal 15-inch laptop pocket", "Solid antiqued brass buckles", "Reinforced double-layer base", "YKK Excella metal zips"],
      careInstructions: "Spot clean with cold water. Re-wax canvas every two years using paraffin wax bar.",
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Garrison Roll-Top Rucksack",
      categoryKey: "backpacks",
      price: 285,
      material: "Full-grain pull-up cowhide leather",
      color: "Espresso Brown",
      dimensions: "48cm x 33cm x 15cm",
      capacity: "25 Litres",
      weight: "1.45 kg",
      stock: 9,
      featured: true,
      description: "An expandable roll-top silhouette built for bike commuting and weekend transit. The rich pull-up leather develops an amber patina with every voyage.",
      details: ["Expandable roll closure with roller buckle", "Luggage trolley sleeve on back panel", "Side access zip to main cavity", "Heavy nylon bonded thread"],
      careInstructions: "Condition with neutral beeswax leather balm once every six months.",
      images: [
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Charter Minimalist Daypack",
      categoryKey: "backpacks",
      price: 195,
      material: "Dense water-repellent canvas with vegetable-tanned trim",
      color: "Slate Charcoal",
      dimensions: "40cm x 29cm x 12cm",
      capacity: "16 Litres",
      weight: "0.85 kg",
      stock: 22,
      featured: false,
      description: "Clean geometry without extraneous straps or visible hardware. Form-fitted shoulder straps distribute load evenly across long city walks.",
      details: ["Discreet passport pocket against lower back", "Magnetic flap closure", "Dual interior pen and notebook slots", "Ultra-soft cotton twill lining"],
      careInstructions: "Wipe clean with a damp microfiber cloth.",
      images: [
        "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Alpine Heritage Pack",
      categoryKey: "backpacks",
      price: 260,
      material: "Heavyweight 20oz storm canvas & oiled nubuck",
      color: "Forest Olive",
      dimensions: "46cm x 32cm x 16cm",
      capacity: "23 Litres",
      weight: "1.25 kg",
      stock: 4,
      featured: false,
      description: "Inspired by vintage mountain guides. Features exterior gear loops, reinforced leather lash tabs, and thick felt-padded shoulder rests.",
      details: ["Wool-felt padded shoulder straps", "Dual side water bottle bellows", "Drawcord cinch collar", "Internal zip security pocket"],
      careInstructions: "Brush off dried mud with soft horsehair brush.",
      images: [
        "https://images.unsplash.com/photo-1546938576-6e6a64f317cc?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Meridian Commuter Pack",
      categoryKey: "backpacks",
      price: 220,
      material: "Tumbled Italian calf leather & ballistic cotton lining",
      color: "Cast Black",
      dimensions: "42cm x 30cm x 13cm",
      capacity: "18 Litres",
      weight: "1.05 kg",
      stock: 12,
      featured: false,
      description: "Sleek monochromatic lines tailored for professional transit. Fits flat under airplane seats while safeguarding sensitive electronics.",
      details: ["Reinforced top grab handle", "Padded 16-inch laptop pocket", "Key lanyard with solid brass swivel snap", "Waterproof zipper tape"],
      careInstructions: "Store in breathable dust bag away from direct sunlight.",
      images: [
        "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=900&h=1125&fit=crop&q=80"
      ]
    },

    // HANDBAGS (5)
    {
      title: "Palermo Flap Shoulder Bag",
      categoryKey: "handbags",
      price: 320,
      material: "Box-calf full-grain leather with lambskin lining",
      color: "Cognac Amber",
      dimensions: "26cm x 18cm x 7cm",
      capacity: "4.5 Litres",
      weight: "0.62 kg",
      stock: 8,
      featured: true,
      description: "A structured accordion shoulder bag fastened with a concealed German magnetic clasp. Hand-painted edge beveling in dark chocolate tone.",
      details: ["Three partitioned internal compartments", "Adjustable strap for shoulder or crossbody", "Concealed card sleeve under flap", "Gold-foil serial number stamped inside"],
      careInstructions: "Polish with gentle leather cream; avoid soaking rain.",
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Siena Half-Moon Crossbody",
      categoryKey: "handbags",
      price: 275,
      material: "Milled pebble-grain cowhide",
      color: "Burnt Sienna",
      dimensions: "24cm x 16cm x 6cm",
      capacity: "3.2 Litres",
      weight: "0.48 kg",
      stock: 15,
      featured: true,
      description: "Curved crescent body that nests comfortably against the hip. The pebble texture resists scratches from daily urban encounters.",
      details: ["Smooth continuous zip curve", "Solid brass D-rings", "Rear external slip pocket for quick phone access", "Lined in unbleached linen canvas"],
      careInstructions: "Wipe with soft cloth moistened with warm water.",
      images: [
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Kallio Saddle Bag",
      categoryKey: "handbags",
      price: 290,
      material: "Vegetable-tanned bridle hide & brass hardware",
      color: "Rich Chestnut",
      dimensions: "22cm x 20cm x 8cm",
      capacity: "4.0 Litres",
      weight: "0.58 kg",
      stock: 6,
      featured: false,
      description: "Equatorian saddle silhouette defined by perimeter saddle-stitching. Sturdy flap keeps contents secure while maintaining a relaxed, classic poise.",
      details: ["Tongue-in-loop buckle closure", "Interior key strap", "Adjustable pin-buckle strap", "Raw suede interior backing"],
      careInstructions: "Condition regularly with organic tallow or lanolin wax.",
      images: [
        "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Vesper Mini Top-Handle",
      categoryKey: "handbags",
      price: 340,
      material: "Smooth French calfskin & structured celastic board",
      color: "Raven Noir",
      dimensions: "21cm x 15cm x 8cm",
      capacity: "3.0 Litres",
      weight: "0.52 kg",
      stock: 11,
      featured: false,
      description: "Compact architectural proportions with a rigid molded arch handle. Comes with a removable thin strap for hands-free gallery days.",
      details: ["Architectural molded handle", "Detachable slim cross-body strap", "Four protective brass feet on base", "Internal mirror slip pocket"],
      careInstructions: "Buff gently with dry wool cloth to maintain satin sheen.",
      images: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Lucca Slouch Hobo",
      categoryKey: "handbags",
      price: 310,
      material: "Unlined butter-soft washed lambskin",
      color: "Muted Clay",
      dimensions: "32cm x 24cm x 10cm",
      capacity: "8.5 Litres",
      weight: "0.55 kg",
      stock: 5,
      featured: false,
      description: "Effortlessly drapes into a gentle crease when carried. Generous enough for a hardback book, thermal flask, and daily essentials.",
      details: ["Wide comfort shoulder band", "Magnetic bridge closure", "Detachable zippered interior pouch", "Seamless base construction"],
      careInstructions: "Keep stuffed with tissue paper when not in use to preserve posture.",
      images: [
        "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&h=1125&fit=crop&q=80"
      ]
    },

    // TOTES (5)
    {
      title: "Mercer Open-Top Utility Tote",
      categoryKey: "totes",
      price: 180,
      material: "24oz heavyweight cotton duck & 8oz bridle leather handles",
      color: "Natural Ecru / Saddle Brown",
      dimensions: "42cm x 36cm x 16cm",
      capacity: "24 Litres",
      weight: "0.90 kg",
      stock: 20,
      featured: true,
      description: "Constructed to stand upright on its own. Thick English bridle leather handles are copper-riveted directly through heavy brass washers.",
      details: ["Solid hand-hammered copper rivets", "Double reinforced bottom gusset", "Deep internal water-bottle sleeve", "Stout 10-inch handle drop fits easily over heavy coats"],
      careInstructions: "Spot clean canvas only. Do not immerse leather handles in water.",
      images: [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Bespoke Zip Leather Tote",
      categoryKey: "totes",
      price: 360,
      material: "Full-grain Tuscan vegetable-tanned shoulder leather",
      color: "Warm Russet",
      dimensions: "40cm x 33cm x 13cm",
      capacity: "19 Litres",
      weight: "1.20 kg",
      stock: 7,
      featured: true,
      description: "Full top zipper security meets spacious editorial presence. Accommodates a 15-inch laptop and folio with room to spare for evening plans.",
      details: ["Heavy gauge top brass zip closure", "Padded slip compartment for 15\" MacBook", "Dual exterior seam slip pockets", "Beveled and burnished edges"],
      careInstructions: "Apply leather conditioner twice a year to replenish natural oils.",
      images: [
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Market Foldaway Tote",
      categoryKey: "totes",
      price: 135,
      material: "Lightweight waxed poplin with bridle leather binding",
      color: "Dried Herb Green",
      dimensions: "38cm x 34cm x 12cm",
      capacity: "17 Litres",
      weight: "0.42 kg",
      stock: 25,
      featured: false,
      description: "Collapses flat for packing into luggage. Deploys into a resilient carryall for local produce markets and day excursions.",
      details: ["Folds into self-contained leather strap", "Water-resistant waxed cotton shell", "Interior zippered key stash", "Reinforced box-x handle stitching"],
      careInstructions: "Shake out debris and wipe with cool damp sponge.",
      images: [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "East-West Studio Shopper",
      categoryKey: "totes",
      price: 295,
      material: "Wax-treated nubuck leather with cotton drill lining",
      color: "Camel Tan",
      dimensions: "45cm x 30cm x 15cm",
      capacity: "22 Litres",
      weight: "1.05 kg",
      stock: 8,
      featured: false,
      description: "Horizontal orientation prevents taller items from tipping over. Wide leather straps sit softly on the shoulder even under dense loads.",
      details: ["Horizontal proportion easily fits art folios", "Central magnetic security bridge", "Solid brass key clip", "Two drop-in smartphone sleeves"],
      careInstructions: "Use nubuck foam cleaner for any stubborn marks.",
      images: [
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Harbor Waxed Daily Tote",
      categoryKey: "totes",
      price: 165,
      material: "Weatherproof maritime waxed canvas",
      color: "Deep Indigo",
      dimensions: "39cm x 35cm x 14cm",
      capacity: "19 Litres",
      weight: "0.75 kg",
      stock: 16,
      featured: false,
      description: "Treated with a petroleum-free vegetable wax blend for a soft matte texture that repels drizzle and coastal sea mist.",
      details: ["Storm-resistant top storm flap", "Heavy cotton webbing handles", "Interior zip pocket for cardholder", "Reinforced corner darts"],
      careInstructions: "Air dry at room temperature away from radiators.",
      images: [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1591561954557-26941169b49e?w=900&h=1125&fit=crop&q=80"
      ]
    },

    // LAPTOP BAGS (5)
    {
      title: "Archivist Leather Briefcase",
      categoryKey: "laptop-bags",
      price: 395,
      material: "Vegetable-tanned harness leather & dense foam padding",
      color: "Dark Havana",
      dimensions: "41cm x 30cm x 9cm",
      capacity: "12 Litres",
      weight: "1.35 kg",
      stock: 6,
      featured: true,
      description: "A tailored executive folio designed to endure decades of courtroom and boardroom service. Carries laptops up to 16 inches in high-density neoprene.",
      details: ["Quilted microfiber laptop compartment (up to 16\")", "Dual-directional brass two-way zipper", "Detachable leather shoulder strap with sliding pad", "Full-width rear newspaper/document magazine pocket"],
      careInstructions: "Buff edges with edge wax if drying occurs over time.",
      images: [
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Metropolitan Canvas Messenger",
      categoryKey: "laptop-bags",
      price: 230,
      material: "Weathered duck canvas with bridle accents",
      color: "Field Drab Khaki",
      dimensions: "38cm x 28cm x 10cm",
      capacity: "11 Litres",
      weight: "0.95 kg",
      stock: 14,
      featured: false,
      description: "Easy-access front flap with silent push-lock closures hidden underneath traditional leather straps. Built for subway commuters.",
      details: ["Concealed quick-release buckles under straps", "14-inch padded computer division", "Organizer panel for pens, charger, and cables", "Cross-body stabilizer strap"],
      careInstructions: "Wipe with damp cloth and mild castile soap.",
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Atelier Document Folio",
      categoryKey: "laptop-bags",
      price: 175,
      material: "Smooth saddlery leather & wool felt core",
      color: "Caramel Brown",
      dimensions: "36cm x 26cm x 3cm",
      capacity: "3.5 Litres",
      weight: "0.45 kg",
      stock: 18,
      featured: false,
      description: "Slim zippered envelope built specifically for 13\" and 14\" laptops plus a notepad and fountain pen.",
      details: ["Lined with 3mm virgin German wool felt", "Corner cutaways for easy device retrieval", "Solid brass zip pull", "Embossed measurement markings on spine"],
      careInstructions: "Treat leather exterior with neutral wax cream.",
      images: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Consul Commuter Brief",
      categoryKey: "laptop-bags",
      price: 345,
      material: "Matte milled calfskin & technical twill",
      color: "Obsidian Black",
      dimensions: "42cm x 31cm x 8cm",
      capacity: "13 Litres",
      weight: "1.15 kg",
      stock: 8,
      featured: false,
      description: "Low-profile silhouette engineered with dual compartments separating paperwork from electronic chargers and cables.",
      details: ["Dual independent zipped chambers", "Pass-through luggage band", "Padded 15.6-inch laptop divider", "Detachable woven webbing strap"],
      careInstructions: "Store flat in dust bag.",
      images: [
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Telegraph Tech Satchel",
      categoryKey: "laptop-bags",
      price: 215,
      material: "Waterproof ripstop canvas & saddle leather",
      color: "Ash Grey",
      dimensions: "37cm x 29cm x 9cm",
      capacity: "10 Litres",
      weight: "0.80 kg",
      stock: 16,
      featured: false,
      description: "Casual utility bag engineered for photographers and remote workers. Padded bottom absorbs shock when set down on stone pavement.",
      details: ["Shock-absorbing closed-cell bottom foam", "Removable padded camera/divider insert", "External zippered battery pouch", "Adjustable shoulder strap with leather pad"],
      careInstructions: "Hand wash canvas exterior with cold water.",
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&h=1125&fit=crop&q=80"
      ]
    },

    // TRAVEL BAGS (5)
    {
      title: "Wayfarer 48hr Weekender Duffel",
      categoryKey: "travel",
      price: 380,
      material: "Full-grain oil-tanned steerhide & 100% cotton canvas lining",
      color: "Antique Whiskey",
      dimensions: "52cm x 30cm x 28cm",
      capacity: "42 Litres",
      weight: "1.95 kg",
      stock: 5,
      featured: true,
      description: "The quintessential travel companion for short journeys. Sized to meet international cabin baggage regulations while offering vast internal clearance.",
      details: ["Reinforced wrap-around carry straps", "U-shaped heavy brass main opening", "Dedicated ventilated end pocket for extra shoes", "Removable wide shoulder strap with ergonomic pad"],
      careInstructions: "Condition after extended trips; air thoroughly before storage.",
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Overland Waxed Barrel Duffel",
      categoryKey: "travel",
      price: 240,
      material: "22oz waxed filter canvas with harness leather trim",
      color: "Ranger Tan",
      dimensions: "50cm x 28cm x 28cm",
      capacity: "38 Litres",
      weight: "1.30 kg",
      stock: 10,
      featured: false,
      description: "Cylindrical construction withstands being tossed into boat hulls, train racks, and car trunks. Repels rain and damp grass.",
      details: ["Solid cast brass hardware", "End haul handles for quick lift", "Interior zip pocket for travel toiletries", "Two-way brass zip with lock hole"],
      careInstructions: "Do not dry clean. Re-wax wear points with canvas wax.",
      images: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Expedition Garment Roll",
      categoryKey: "travel",
      price: 310,
      material: "Ballistic nylon with bridle leather piping",
      color: "Charcoal & Umber",
      dimensions: "54cm x 33cm x 22cm (rolled)",
      capacity: "35 Litres",
      weight: "1.65 kg",
      stock: 7,
      featured: false,
      description: "Rolls suits and shirts gently around an internal duffel chamber, completely eliminating hard folds and packing wrinkles upon arrival.",
      details: ["Wrinkle-free suit suspension frame", "Internal duffel core holds 3 days of clothing", "Trolley sleeve on rear panel", "Hanger hook for closet hanging upon arrival"],
      careInstructions: "Spot wipe outer fabric; hang unfolded to air dry.",
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Naval Kit Bag",
      categoryKey: "travel",
      price: 190,
      material: "Heavy 24oz unwashed cotton sailcloth & brass grommets",
      color: "Washed Sand",
      dimensions: "58cm x 30cm x 30cm",
      capacity: "45 Litres",
      weight: "1.10 kg",
      stock: 12,
      featured: false,
      description: "Rooted in classic maritime duffels. Top-loading with heavy rope cinch and a side zip providing direct midway access into the hull.",
      details: ["Heavy brass grommets and braided cord cinch", "Side vertical zipper for direct access", "Internal dry bag compartment", "Shoulder sling and hand strap"],
      careInstructions: "Machine wash cold on gentle cycle without spin; dry flat.",
      images: [
        "https://images.unsplash.com/photo-1544816155-12df9643f363?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Grand Tourer Leather Carry-On",
      categoryKey: "travel",
      price: 495,
      material: "Full-grain vegetable-tanned bovine leather",
      color: "Rich Mahogany",
      dimensions: "55cm x 35cm x 23cm",
      capacity: "40 Litres",
      weight: "2.35 kg",
      stock: 3,
      featured: false,
      description: "Our crowning travel piece. Built entirely of heavy vegetable-tanned hide that softens, deepens, and tells the story of every border crossed.",
      details: ["TSA-compliant brass padlock included", "Elastic shoe/laundry containment straps", "Structured side walls protect fragile items", "Monogram tag included"],
      careInstructions: "Condition with high-grade saddle leather balm quarterly.",
      images: [
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=900&h=1125&fit=crop&q=80"
      ]
    },

    // WALLETS & SMALL ACCESSORIES (5)
    {
      title: "Classic Saddle Bifold Wallet",
      categoryKey: "accessories",
      price: 85,
      material: "English bridle leather, hand-skived edges",
      color: "London Tan",
      dimensions: "11cm x 9cm x 1.2cm",
      capacity: "8-12 cards + currency",
      weight: "0.08 kg",
      stock: 30,
      featured: true,
      description: "Traditional six-pocket bifold with two hidden receipt compartments. Hand-burnished edges sealed with pure beeswax.",
      details: ["Six precision card slots", "Full-length bill section", "Two concealed receipt pockets", "Ultra-slim 1.2cm folded profile"],
      careInstructions: "The oils from your hands naturally condition this leather daily.",
      images: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Minimalist Fold Card Sleeve",
      categoryKey: "accessories",
      price: 55,
      material: "Vegetable-tanned Tuscan leather",
      color: "Natural Vachetta",
      dimensions: "10cm x 7cm x 0.5cm",
      capacity: "4-6 cards + folded cash",
      weight: "0.04 kg",
      stock: 45,
      featured: false,
      description: "Cut from a single pattern piece of 3oz leather folded and saddle-stitched by hand. Fits unnoticeably in front trouser pockets.",
      details: ["Center folded cash chamber", "Two quick-draw outer card pockets", "Raw unlined interior", "Tans into deep caramel over 6 months of daily carry"],
      careInstructions: "Avoid direct contact with water during initial patina period.",
      images: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Passport & Travel Wallet",
      categoryKey: "accessories",
      price: 110,
      material: "Milled calfskin with solid brass closure snap",
      color: "Deep Forest",
      dimensions: "14.5cm x 10.5cm x 1.5cm",
      capacity: "Passport, boarding cards, 4 credit cards",
      weight: "0.12 kg",
      stock: 18,
      featured: false,
      description: "Houses your international passport, customs declarations, boarding pass, and micro-pen in one calm, organized leather book.",
      details: ["Dedicated passport slip sleeve", "Boarding pass flap", "Four card pockets", "Includes mini brass twist ballpoint pen"],
      careInstructions: "Store in cool dry place when not traveling.",
      images: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "L-Zip Coin & Key Pouch",
      categoryKey: "accessories",
      price: 65,
      material: "Supple pebble-grain cowhide & YKK brass zip",
      color: "Cast Black",
      dimensions: "11cm x 8.5cm x 1.5cm",
      capacity: "Loose coins, keys, folded bills",
      weight: "0.07 kg",
      stock: 28,
      featured: false,
      description: "L-shaped perimeter zipper offers wide interior visibility. Features an attached solid brass key loop inside to secure apartment keys.",
      details: ["L-zip opening for wide access", "Internal solid brass key ring", "Divider partition for coins vs bills", "Smooth teeth glide without snagging"],
      careInstructions: "Wipe with damp cloth.",
      images: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&h=1125&fit=crop&q=80"
      ]
    },
    {
      title: "Atelier Brass Key Clasp",
      categoryKey: "accessories",
      price: 45,
      material: "Solid sand-cast brass & 10oz harness leather strap",
      color: "Antique Brass / Oak",
      dimensions: "13cm x 3cm x 1cm",
      capacity: "Holds up to 10 keys",
      weight: "0.09 kg",
      stock: 40,
      featured: false,
      description: "Heavy sand-cast brass snap clip that latches firmly onto belt loops or internal tote bag D-rings. Heavy-duty screw stud keeps keys secure.",
      details: ["Solid sand-cast Japanese brass clip", "Saddle-grade harness leather loop", "Hand-stamped atelier logo", "Threaded screw-lock shackle"],
      careInstructions: "Brass will naturally age and patina; buff with metal cloth if high shine is preferred.",
      images: [
        "https://images.unsplash.com/photo-1627123424574-724758594e93?w=900&h=1125&fit=crop&q=80",
        "https://images.unsplash.com/photo-1517256064527-09c73fc73e38?w=900&h=1125&fit=crop&q=80"
      ]
    }
  ]
};
