const visitedMemories = {
  "Norway": {
    title: "Norway 🇳🇴",
    description: "Growing up in Bergen, I was shaped by a culture that values resilience, community, and a close connection to nature. Between football fields, home-cooked meals, and time spent with friends, I developed a grounded mindset and an appreciation for both structure and spontaneity.",
    images: [
      "image/norge.jpg",
      "image/norge2.jpg",
      "image/norge3.jpg",
      "image/norge4.jpg",
      "image/norge5.jpg",
      "image/norge6.jpg",
      "image/norge7.jpg",
    ]
  },
  
  "Spain": [
    { name: "Marbella 🇪🇸", description: "We spent our family vacation in Marbella, soaking up the sun and taking day trips to Puerto Banús. It was a mix of lazy beach days and window-shopping in luxury boutiques. The afternoons were slow and warm, and evenings meant good food and long conversations by the pool. ", 
    images: [
      "image/marbella.jpg",
      "image/marbella2.jpg",
      "image/marbella3.jpg",
    ] },
    { name: "Nerja 🇪🇸", description: "Visiting my grandparents' home in Nerja offered a slower pace. Life there revolved around local cafés, chatting with neighbors, and long dinners that stretched into the night. I played football with the neighborhood kids and got a glimpse of what everyday life in a Spanish coastal town feels like.. ", 
    images: [] },
    { name: "Palma 🇪🇸", description: "A spontaneous boys' trip to Palma turned into a great mix of adventure and downtime. We hiked through rugged mountains in the mornings and hit the beach or local bars at night. It was a few days of carefree laughter, group dinners, and shared stories under the stars..", 
    images: [
      "image/palma.jpg",
      "image/palma2.jpg",
      "image/palma3.jpg",
      "image/palma4.jpg",
      "image/marbella4.jpg",
    ] }
  ],
  "France": [
    { name: "Paris 🇫🇷", description: "My first trip with my girlfriend took us to Paris. We spent hours wandering the streets, visiting every landmark we could find—the Eiffel Tower, the Louvre, Notre-Dame. In between, we had café stops and sat on benches, sharing pastries and soaking up the city's beauty. It felt both grand and simple.", 
    images: [
      "image/paris.jpg",
      "image/paris2.jpg",
      "image/paris3.jpg",
      "image/paris4.jpg",
      "image/paris5.jpg",
      "image/paris6.jpg",
    ] },
    { name: "Cannes 🇫🇷", description: "I've been lucky to visit Cannes with my family a few times. It's the kind of place that lingers in your memory—the warm sea breeze, the sound of clinking glasses at beach clubs, and boat days that stretch from morning into the golden hour. The Riviera has a laid-back charm that's hard to forget.", 
    images: [
      "image/cannes.jpg",
      "image/cannes2.jpg",
      "image/cannes3.jpg",
      "image/cannes4.jpg",
      "image/cannes5.jpg",
      "image/cannes6.jpg",
      "image/cannes7.jpg",
      "image/cannes8.jpg",
      "image/cannes9.jpg",
      "image/cannes10.jpg",
      "image/cannes11.jpg",
      "image/cannes12.jpg",
    ] },
    { name: "Nice 🇫🇷", description: "We took a few day trips to Nice, often just for the food and atmosphere. Shopping, trying local dishes, and strolling through the evening markets became our rhythm. The sunsets over the water had this calmness that made every visit feel like a pause from the world.", 
    images: [
      "image/nice.jpg",
      "image/nice2.jpg",
      "image/nice3.jpg",
      "image/nice4.jpg",
      "image/frankrike.jpg",
      "image/frankrike2.jpg",
    ] },
    { name: "Lavender fields 🇫🇷", description: "Day trip to the amazing lavender fields in France", 
    images: [
      "image/lavendel.jpg",
      "image/lavendel2.jpg",
      "image/lavendel3.jpg",
      "image/solsikke.jpg",
    ] },
    { name: "St.Tropez 🇫🇷", description: "Supercars, yaths, fancy restaurants, and windowshopping. What a crazy city!", 
    images: [
      "image/sttropez.jpg",
      "image/sttropez2.jpg",
    ] },
  ],
  "Sweden": {
    title: "Summer in Sweden 🇸🇪",
    description: "One summer, we set out on a road trip through Sweden, with Stockholm as our final stop. Along the way, we passed endless forests, stumbled upon quiet lakes hidden behind bends, and explored charming little towns we hadn't meant to visit.",
    images: []
  },
  "Monaco": {
    title: "Summer in Monaco 🇲🇨", 
    description: "It was a quick summer visit, but Monaco was unlike anywhere else. We spent the day exploring the harbor, watching yachts bigger than houses, and finding quiet corners of the city to rest our feet. The mix of luxury and Mediterranean calm was surprisingly charming, and sharing it all with close friends made it feel more real than just a postcard..",
    images: [
      "image/monaco.jpg", 
      "image/monaco2.jpg",
    ]
  },
  "Denmark": {
    title: "Copenhagen Cool 🇩🇰",
    description: "Copenhagen felt effortlessly cool. We rented bikes and rode everywhere—past canals, street art, and packed coffee spots. There was something comforting about the city's pace, and the cozy cafés gave us shelter from the wind while we planned out our next stops. I left feeling inspired to bring some of that Danish calm back with me..",
    images: []
  },
  "Netherlands": [
    { name: "Amsterdam trip NE", description: "Heiniken museum, boat trip, shoping, great food", 
    images: [
      "image/amster.jpg",
      "image/amster1.jpg",
      "image/amster2.jpg",
      "image/amster3.jpg",
      "image/amster4.jpg",
      "image/amster5.jpg",
      "image/amster6.jpg",
      "image/amster7.jpg",
      "image/amster8.jpg",
  ] },
  ],
  "United Arab Emirates": {
    title: "Desert and Skyscrapers 🇦🇪",
    description: "Dubai was a world apart. One moment we were standing at the top of the tallest building in the world, and the next we were bouncing through the desert on a safari, watching the sun disappear behind dunes. It was a trip full of contrasts—glass towers and golden sands, luxury malls and old souks—and somehow it all worked..",
    images: [
      "image/dubai.jpg",
      "image/dubai2.jpg",
      "image/dubai3.jpg",
      "image/dubai4.jpg",
      "image/dubai5.jpg",
      "image/dubai8.jpg",
      "image/dubai9.jpg",
      "image/dubai10.jpg",
      "image/dubai11.jpg",
      "image/dubai12.jpg",
      "image/dubai13.jpg",
      "image/dubai14.jpg",
      "image/dubai15.jpg",
      "image/dubai16.jpg",
      "image/dubai17.jpg",
    ]
  },
  "Maldives": {
    title: "Tropical Paradise 🇲🇻",
    description: "The Maldives felt like a dream. Days blurred into each other—waking up to turquoise water, swimming with colorful fish, reading on the beach, and watching sunsets that looked painted. It was the kind of place where you forget about time completely and just exist, barefoot and happy..",
    images: [
      "image/maldivene.jpg",
      "image/maldivene2.jpg",
      "image/maldivene3.jpg",
      "image/maldivene4.jpg",
      "image/maldivene5.jpg",
      "image/maldivene6.jpg",
      "image/maldivene7.jpg",
      "image/maldivene8.jpg",
      "image/maldivene9.jpg",
      "image/maldivene10.jpg",
    ]
  },
  "Poland": {
    title: "Historic Poland 🇵🇱",
    description: "After our final exams, we headed to Gdańsk for a well-earned break. We spent the days walking through the historic old town, taking in the architecture, and enjoying traditional Polish food. It was a relaxing and refreshing way to end a busy semester.",
    images: [
      "image/polen.jpg",
      "image/polen3.jpg",
      "image/polen4.jpg",
      "image/polen5.jpg",
      "image/polen6.jpg",
      "image/polen7.jpg",
      "image/polen8.jpg",
      "image/polen9.jpg",
      "image/polen10.jpg",
    ]
  },
  "Germany": {
    title: "Anniversary in Berlin 🇩🇪",
    description: "I visited Berlin with my girlfriend for our one-year anniversary. We explored museums, memorials, and local neighborhoods by day, and enjoyed good food and cocktail bars in the evenings. A simple local egg sandwich quickly became a favorite.",
    images: [
      "image/berlin.jpg",
      "image/berlin1.jpg",
      "image/berlin2.jpg",
      "image/berlin3.jpg",
      "image/berlin4.jpg",
      "image/berlin5.jpg",
      "image/berlin6.jpg",
    ]
  },
  "United States": [
    { name: "Chicago 🇺🇸", description: "Chicago welcomed us with wind, towering buildings, and the smell of pizza in the air. We tried deep dish (as thick and cheesy as promised), walked along the lakeshore, and explored the city's architecture. It had that big city energy but with a slower rhythm than New York—easier to breathe in..", 
    images: [
      "image/chicago8.jpg",
      "image/chicago.jpg",
      "image/chicago2.jpg",
      "image/chicago3.jpg",
      "image/chicago4.jpg",
      "image/chicago5.jpg",
      "image/chicago6.jpg",
      "image/chicago7.jpg",
      "image/chicago9.jpg",
    ] },
    { name: "Ann Arbor 🇺🇸", description: "Ann Arbor was a chapter of its own—my exchange semester at the University of Michigan. Between lectures, football games, late-night study sessions, and spontaneous yard parties, I found a second home. There was something special about the balance—serious academic energy mixed with genuine warmth and endless activity.", 
    images: [
      "image/annA.jpg",
      "image/anna2.jpg",
      "image/anna3.jpg",
      "image/anna4.jpg",
      "image/anna5.jpg",
      "image/anna6.jpg",
      "image/anna7.jpg",
      "image/anna9.jpg",
      "image/anna10.jpg",
      "image/anna11.jpg",
      "image/anna12.jpg",
      "image/anna13.jpg",
      "image/anna14.jpg",
      "image/anna15.jpg",
      "image/anna16.jpg",
      "image/anna17.jpg",
      "image/anna18.jpg",
      "image/anna19.jpg",
      "image/anna20.mp4",
    ] },
    { name: "Detroit 🇺🇸", description: "Detroit had a different feel. Some areas felt raw, even a little intimidating, but under that surface was a city rebuilding itself. We explored museums, saw a Red Wings hockey game, and noticed small signs of revival in once-forgotten neighborhoods. It wasn't polished—but it was real.", 
    images: [
      "image/detroit.jpg",
      "image/detroit2.jpg",
      "image/detroit3.jpg",
      "image/detroit4.jpg",
      "image/detroit5.jpg",
    ] },
    { name: "New York 🇺🇸", description: "In New York, I did everything a tourist should. Times Square at night, biking through Central Park, bagels in the morning and street food in the afternoon. The city moved fast, but that just made the quiet moments—like sitting in Washington Square Park—feel even more vivid. Every corner felt like a scene from a movie.", 
    images: [
      "image/newyork2.jpg",
      "image/newyork3.jpg",
      "image/newyork4.jpg",
      "image/newyork5.jpg",
      "image/newyork6.jpg",
      "image/newyork7.jpg",
      "image/newyork8.jpg",
      "image/newyork9.jpg",
      "image/newyork10.jpg",
    ] },
    { name: "Miami 🇺🇸", description: "Miami was all about movement and color. Mornings began with long beach walks, afternoons meant biking through the art-filled streets of Wynwood, and evenings were reserved for watching the sky turn pink over the ocean. It was a family trip, but it still felt like an escape into summer.", 
    images: [
      "image/miami2.jpg",
      "image/miami3.jpg",
      "image/miami4.jpg",
      "image/miami5.jpg",
      "image/miami7.jpg",
      "image/miami8.jpg",
    ] }
  ],
  "Canada": [
    { name: "Niagara falls 🇨🇦", description: "We took a daytrip to the wonderful niagara falls. Truly amazing views!", 
    images: [
      "image/niagara.jpg",
      "image/niagara2.jpg",
      "image/niagara3.jpg",
      "image/niagara4.jpg",
    ] },
    {name: "Toronto 🇨🇦",description: "When my girlfriend visited me during my exchange, we changed our plans last minute and went to Toronto for parts of the stay, since New York was facing extreme cold. Toronto was still freezing, with snow-covered streets and icy air, but we made the most of it, visiting the CN Tower, exploring Little Italy, and taking a day trip to Niagara Falls. Despite the weather, it was a great experience.",
    images: [
      "image/toronto.jpg",
      "image/toronto2.jpg",
      "image/toronto3.jpg",
      "image/toronto4.jpg",
      "image/toronto5.jpg",
    ] 
  }],
  "Hungary": {
    title: "Budapest Beauty 🇭🇺",
    description: "Budapest was an anniversary gift from my girlfriend, and it turned out to be one of our most memorable trips. We soaked in thermal baths, walked across the Chain Bridge, and explored the local food scene. One afternoon, we took a chimney cake baking class - fun, a bit chaotic, and a highlight of the trip",
    images: [
      "image/buda.jpg",
      "image/buda2.jpg",
      "image/buda3.jpg",
      "image/buda4.jpg",
      "image/buda5.jpg",
      "image/buda6.jpg",
      "image/buda7.jpg",
      "image/buda8.jpg",
      "image/buda9.jpg",
      "image/buda10.jpg",
      "image/buda11.jpg",
      "image/buda12.jpg",
    ]
  },
  "Croatia": {
    title: "Adriatic Adventure 🇭🇷",
    description: "It was a boys' trip full of late mornings, sunny afternoons by the beach, and long nights at pool parties or clubs that blurred into sunrise. Somewhere in the middle of all that, I met my girlfriend—turning an unforgettable trip into the start of something even more meaningful.",
    images: [
      "image/split2.jpg",
      "image/split1.jpg",
      "image/split3.mp4",
  ]
  },
  "Albania": {
    title: "Albanian Escape 🇦🇱",
    description: "Albania turned out to be the perfect summer destination for two students on a budget. Everything cost half as much as back home, and the beaches were stunning. We drove across the country—navigating chaotic roads from Tirana all the way down to Ksamil. Along the way we found hidden coves, ate fresh seafood by the sea, and watched unforgettable sunsets. It felt like discovering a secret Mediterranean gem.",
    images: [
      "image/albania.jpg",
      "image/albania2.jpg",
      "image/albania3.MP4",
      "image/albania4.jpg",
      "image/albania5.jpg",
      "image/albania6.jpg",
      "image/albania7.jpg",
      "image/albania8.jpg",
      "image/albania9.jpg",
      "image/albania10.jpg",
    ]
  },
  "Dominican Republic": {
    title: "Caribbean All-Inclusive 🇩🇴",
    description: "Our family trip to the Dominican Republic was all about slowing down and soaking it all in. We stayed at the Hard Rock Hotel, a massive resort with over twenty pools and more restaurants than we could try. I spent hours barefoot on a grass field playing football, only taking breaks to cool off or catch a World Cup match on the big screen. It was easy to forget what day it was—the sun, the rhythm, the laughter kept it all flowing.",
    images: [
      "image/punta.jpg",
      "image/punta2.jpg",
      "image/punta3.jpg",
      "image/punta4.jpg",
    ]
  },
  "Greece": [
    { name: "Athens 🇬🇷", description: "Athens was loud, warm, and full of history. The Acropolis towered above the city, and wandering through ruins while the modern city buzzed around us felt surreal. We balanced sightseeing with shopping and long meals where the food never stopped coming.", 
    images: [
      "image/athen.jpg",
      "image/athen2.jpg",
      "image/athen3.jpg",
      "image/athen4.jpg",
      "image/athen5.jpg",
      "image/athen6.jpg",
      "image/athen7.jpg",
      "image/athen8.jpg",
      "image/athen9.jpg",
      "image/athen10.jpg",
      "image/athen11.jpg",
    ] },
    { name: "Antiparos 🇬🇷", description: "I joined my girlfriend's family for a trip to Antiparos, and the island became our shared little world. We rode quad bikes on dusty roads, jumped off boats into clear water, and spent entire days moving between pool and sea. It was peaceful and playful all at once.", 
    images: [
      "image/antiparos.jpg",
      "image/antiparos2.jpg",
      "image/antiparos3.jpg",
      "image/antiparos4.jpg",
      "image/antiparos5.jpg",
      "image/antiparos6.jpg",
      "image/antiparos7.jpg",
  ] },
    { name: "Santorini 🇬🇷", description: "Family vacation in Santorini was beautiful and chaotic. White-washed buildings, cobbled streets packed with tourists, and donkeys carrying people up the steep hills. We explored, shopped, and always ended our days with sunsets that made everyone stop talking.", 
    images: [
      "image/hellas2.jpg",
      "image/hellas3.jpg",
      "image/hellas4.jpg",
    ] }
  ],
  "United Kingdom": [
    { name: "London 🇬🇧", description: "London was vibrant and full of energy, made even more memorable by having my girlfriend, who had lived there, as a guide. She introduced me to both the city's iconic landmarks and its hidden gems. From West End performances to rainy strolls through local markets, it was a meaningful way to experience the city through her eyes.", 
    images: [
      "image/london.jpg",
      "image/london2.jpg",
      "image/london3.jpg",
      "image/london4.jpg",
      "image/london5.jpg",
      "image/london6.jpg",
    ] },
    { name: "Edinburgh 🇬🇧", description: "Edinburgh was a city full of history and character. We visited my sister, who is currently studying there, and spent the days exploring castles, walking through the city, and enjoying traditional pubs.", 
    images: [
      "image/edinburgh.jpg",
      "image/edinburgh2.jpg",
      "image/edinburgh3.jpg",
      "image/edinburgh4.jpg",
    ] }
  ]
};
// ---- Utility: is video file?
function isVideo(src = "") {
  return /\.mp4($|\?)/i.test(src);
}

// ---- Utility: create media element (img or video)
function createMediaEl(src, alt) {
  if (isVideo(src)) {
    const v = document.createElement('video');
    v.src = src;
    v.controls = true;
    v.playsInline = true;
    v.style.maxWidth = '280px';
    v.style.maxHeight = '500px';
    v.style.borderRadius = '8px';
    return v;
  } else {
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt || '';
    return img;
  }
}

// ---- When DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // ——— Banner: close on X or any click
  document.getElementById('infoBanner')?.addEventListener('click', (e) => {
    if (e.target.id !== 'closeBanner') e.currentTarget.style.display = 'none';
  });
  document.getElementById('closeBanner')?.addEventListener('click', () => {
    const b = document.getElementById('infoBanner');
    if (b) b.style.display = 'none';
  });

  // ——— Modal close buttons/behavior
  const travelModal = document.getElementById('travelModal');
  const modalClose = document.getElementById('modalClose');
  modalClose?.addEventListener('click', () => { if (travelModal) travelModal.style.display = 'none'; });
  travelModal?.addEventListener('click', (evt) => {
    if (evt.target === travelModal) travelModal.style.display = 'none';
  });

  // ——— Leaflet Map init
  const map = L.map('map', {
    zoomControl: false,
    // Allow dragging by default so it doesn't feel "dead".
    // If you want a static map, set dragging:false and also disable others.
    dragging: true,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false,
    keyboard: false
  }).setView([30, 0], 2);

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  let geojson;

  // Normalize/resolve a display name for a Feature
  function featureName(fProps = {}) {
    // Common properties across datasets
    return (
      fProps.name ||
      fProps.ADMIN ||
      fProps.NAME ||
      fProps.Country ||
      fProps.country ||
      fProps.admin ||
      fProps.sovereignt ||
      fProps.SOVEREIGNT ||
      fProps.sov_a3 ||
      ''
    );
  }

  function onEachFeature(feature, layer) {
    const name = featureName(feature.properties || {});
    // Hover style
    layer.on('mouseover', function () {
      this.setStyle({ weight: 2, fillColor: '#06213f', fillOpacity: 1, color: '#06213f' });
      this.bringToFront();
    });
    layer.on('mouseout', function () {
      geojson.resetStyle(this);
    });

    // Click opens modal if we have memories
    if (visitedMemories && Object.prototype.hasOwnProperty.call(visitedMemories, name)) {
      layer.on('click', () => {
        const memory = visitedMemories[name];

        const countryTitleEl = document.getElementById('modalCountry');
        const titleEl = document.getElementById('modalTitle');
        const descEl = document.getElementById('modalDescription');
        const imgContainer = document.getElementById('modalImages');
        const tripSelector = document.getElementById('tripSelector');

        if (!titleEl || !descEl || !imgContainer || !tripSelector || !travelModal) return;

        // Set country title (new h2)
        if (countryTitleEl) countryTitleEl.textContent = name;

        // Reset containers
        tripSelector.innerHTML = '';
        imgContainer.innerHTML = '';

        // If multiple trips (array), build buttons
        if (Array.isArray(memory)) {
          memory.forEach((trip, idx) => {
            const btn = document.createElement('button');
            btn.textContent = trip.name || `Trip ${idx + 1}`;
            btn.addEventListener('click', () => {
              titleEl.textContent = trip.name || name;
              descEl.textContent = trip.description || '';
              imgContainer.innerHTML = '';
              (trip.images || []).forEach(src => {
                imgContainer.appendChild(createMediaEl(src, trip.name));
              });
            });
            tripSelector.appendChild(btn);
          });
          // Auto-select first
          tripSelector.querySelector('button')?.click();
        } else {
          // Single memory object
          titleEl.textContent = memory.title || name;
          descEl.textContent = memory.description || '';
          (memory.images || []).forEach(src => {
            imgContainer.appendChild(createMediaEl(src, memory.title));
          });
        }

        travelModal.style.display = 'block';
      });
    }
  }

  // Style countries: highlight visited
  geojson = L.geoJSON(null, {
    style: (feature) => {
      const name = featureName(feature?.properties || {});
      const visited = visitedMemories && Object.prototype.hasOwnProperty.call(visitedMemories, name);
      return {
        color: '#0a3d62',
        weight: 1,
        fillColor: visited ? '#0a3d62' : '#ccc',
        fillOpacity: visited ? 0.85 : 0.2
      };
    },
    onEachFeature
  }).addTo(map);

  // Load world countries GeoJSON from multiple sources (robust)
  (async function loadWorldGeoJSON() {
    const sources = [
      // Stable mirror (Natural Earth via geojson.xyz)
      'https://geojson.xyz/world/ne_110m_admin_0_countries.geojson',
      // Original (can be throttled sometimes)
      'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'
    ];

    for (const url of sources) {
      try {
        console.log('Loading countries from:', url);
        const res = await fetch(url, { mode: 'cors' });
        if (!res.ok) {
          console.warn('Non-OK response:', res.status, url);
          continue;
        }
        const data = await res.json();

        // Ensure FeatureCollection shape
        const fc = data.features ? data : { type: 'FeatureCollection', features: data };

        // Normalize properties so "name" exists
        fc.features = fc.features.map(f => {
          f.properties = f.properties || {};
          f.properties.name = featureName(f.properties);
          return f;
        });

        geojson.addData(fc);
        console.log('Loaded countries from:', url);
        return;
      } catch (err) {
        console.warn('Failed to load:', url, err);
      }
    }

    console.error('All GeoJSON sources failed to load.');
  })();
});