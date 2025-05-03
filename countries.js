const visitedMemories = {
    // full visitedMemories object you posted earlier
    "Norway": {
      title: "Norway.  🇳🇴",
      description: "Growing up in Bergen, I was shaped by a culture that values resilience, community, and a close connection to nature. Between football fields, home-cooked meals, and time spent with friends, I developed a grounded mindset and an appreciation for both structure and spontaneity.",
      images: [
        "image/hop-tur.jpg",
        "image/preikestolen.jpg", 
        "image/norge-nyttårs.jpg",
        "image/geilo-ski.jpg",
        "image/preikestolen2.jpg",
        "image/kristiansand-tømmeren.jpg",
        "image/geilo3.jpg",
      ]
    },
    
    "Spain": [
      { name: "Marbella 🇪🇸", description: "We spent our family vacation in Marbella, soaking up the sun and taking day trips to Puerto Banús. It was a mix of lazy beach days and window-shopping in luxury boutiques. The afternoons were slow and warm, and evenings meant good food and long conversations by the pool. ", 
      images: [
        "image/marbella.HEIC",
        "image/marbella2.HEIC",
        "image/marbella3.HEIC",
      
      ] },
      { name: "Nerja 🇪🇸", description: "Visiting my grandparents’ home in Nerja offered a slower pace. Life there revolved around local cafés, chatting with neighbors, and long dinners that stretched into the night. I played football with the neighborhood kids and got a glimpse of what everyday life in a Spanish coastal town feels like.. ", 
      images: [
      ] },
      { name: "Palma 🇪🇸", description: "A spontaneous boys’ trip to Palma turned into a great mix of adventure and downtime. We hiked through rugged mountains in the mornings and hit the beach or local bars at night. It was a few days of carefree laughter, group dinners, and shared stories under the stars..", 
      images: [
        "image/palma.heic",
        "image/palma2.heic",
        "image/palma3.jpg",
        "image/palma4.heic",
        "image/marbella4.PNG",
      ] }
    ],
    "France": [
      { name: "Paris 🇫🇷", description: "My first trip with my girlfriend took us to Paris. We spent hours wandering the streets, visiting every landmark we could find—the Eiffel Tower, the Louvre, Notre-Dame. In between, we had café stops and sat on benches, sharing pastries and soaking up the city’s beauty. It felt both grand and simple.", 
      images: [
        "image/paris-eiffel.jpg",
        "image/paris-iskrem.jpg",
        "image/paris-restaurant.jpg",
        "image/paris.jpg"
      ] },
      { name: "Cannes 🇫🇷", description: "I’ve been lucky to visit Cannes with my family a few times. It’s the kind of place that lingers in your memory—the warm sea breeze, the sound of clinking glasses at beach clubs, and boat days that stretch from morning into the golden hour. The Riviera has a laid-back charm that’s hard to forget.", 
      images: [
        "image/cannes-3.jpg",
        "image/cannes-5.jpg",
        "image/cannes-8.jpg",
        "image/cannes-aperol.jpg",
        "image/cannes4.jpg",
        "image/cannes6.jpg",
        "image/cannes7.jpg",
        "image/cannes9.jpg",
      ] },
      { name: "Nice 🇫🇷", description: "We took a few day trips to Nice, often just for the food and atmosphere. Shopping, trying local dishes, and strolling through the evening markets became our rhythm. The sunsets over the water had this calmness that made every visit feel like a pause from the world.", 
      images: [
        "image/nice-strand.jpg",
        "image/nice-.jpg",
        "image/nice-lunsj.jpg",
        "image/villefranche-sammen.jpg"
      ] },
      { name: "Lavender fields 🇫🇷", description: "Day trip to the amazing lavender fields in France", 
      images: [
        "image/lavendel.jpg", 
        "image/lavendelåker.jpg", 
        "image/frankrike-lavendel.jpg",
        "image/solsikke.jpg",
      ] },
      { name: "St.Tropez 🇫🇷", description: "Supercars, yaths, fancy restaurants, and windowshopping. What a crazy city!", 
      images: [
        "image/st_tropez.jpg",
        "image/st_tropes2.jpg",
      ] },
    ],
    "Sweden": {
      title: "Summer in Sweden 🇸🇪",
      description: "One summer, we set out on a road trip through Sweden, with Stockholm as our final stop. Along the way, we passed endless forests, stumbled upon quiet lakes hidden behind bends, and explored charming little towns we hadn’t meant to visit.",
      images: []
    },
    "Monaco": {
      title: "Summer in Monaco 🇲🇨", 
      description: "It was a quick summer visit, but Monaco was unlike anywhere else. We spent the day exploring the harbor, watching yachts bigger than houses, and finding quiet corners of the city to rest our feet. The mix of luxury and Mediterranean calm was surprisingly charming, and sharing it all with close friends made it feel more real than just a postcard..",
      images: ["image/monaco-hage.jpg", "image/monaco-hav"]
    },
    "Denmark": {
      title: "Copenhagen Cool 🇩🇰",
      description: "Copenhagen felt effortlessly cool. We rented bikes and rode everywhere—past canals, street art, and packed coffee spots. There was something comforting about the city’s pace, and the cozy cafés gave us shelter from the wind while we planned out our next stops. I left feeling inspired to bring some of that Danish calm back with me..",
      images: []
    },

    "Netherlands": [
      { name: "Amsterdam trip NE", description: "Heiniken museum, boat trip, shoping, great food", 
      images: [
        "image/amster-2.jpg",
        "image/amster-lookout.jpg",
        "image/amsterdam-1.jpg"
    ] },
    ],

    "United Arab Emirates": {
      title: "Desert and Skyscrapers 🇦🇪",
      description: "Dubai was a world apart. One moment we were standing at the top of the tallest building in the world, and the next we were bouncing through the desert on a safari, watching the sun disappear behind dunes. It was a trip full of contrasts—glass towers and golden sands, luxury malls and old souks—and somehow it all worked..",
      images: [
        "image/abudhabi-moske.jpg",
        "image/dubai-kamel.jpg",
        "image/dubai-solnedgang.jpg",
        "image/dubai-terasse.jpg",
        "image/dubai-ørken2.jpg",
        "image/dubai8.jpg",
        "image/dubai9.heic",
        "image/dubai10.heic",
        "image/dubai11.heic",
        "image/dubai12.heic",
        "image/dubai13.heic",
        "image/dubai14.heic",
        "image/dubai15.heic",
        "image/dubai16.heic",
        "image/dubai17.heic",
      ]
    },
    "Maldives": {
      title: "Tropical Paradise 🇲🇻",
      description: "The Maldives felt like a dream. Days blurred into each other—waking up to turquoise water, swimming with colorful fish, reading on the beach, and watching sunsets that looked painted. It was the kind of place where you forget about time completely and just exist, barefoot and happy..",
      images: ["image/maldives1.jpg"]
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
      ]
    },
    "Germany": {
      title: "Anniversary in Berlin 🇩🇪",
      description: "I visited Berlin with my girlfriend for our one-year anniversary. We explored museums, memorials, and local neighborhoods by day, and enjoyed good food and cocktail bars in the evenings. A simple local egg sandwich quickly became a favorite.",
      images: [
        "image/berlin-båt.jpg",
        "image/berlin-båt2.jpg",
        "image/berlin-doghnut.jpg",
        "image/berlin-iskrem.jpg",
        "image/berlin-slott.jpg",
        "image/berlin3.jpg",
      ]
    },
    "United States of America": [
      { name: "Chicago 🇺🇸", description: "Chicago welcomed us with wind, towering buildings, and the smell of pizza in the air. We tried deep dish (as thick and cheesy as promised), walked along the lakeshore, and explored the city’s architecture. It had that big city energy but with a slower rhythm than New York—easier to breathe in..", 
      images: [
        "image/chicago8.heic",
        "image/chicago.heic",
        "image/chicago2.heic",
        "image/chicago3.heic",
        "image/chicago4.heic",
        "image/chicago5.heic",
        "image/chicago6.heic",
        "image/chicago7.jpg",
        "image/chicago9.jpg",
        
      ] },
      { name: "Ann Arbor 🇺🇸", description: "Ann Arbor was a chapter of its own—my exchange semester at the University of Michigan. Between lectures, football games, late-night study sessions, and spontaneous yard parties, I found a second home. There was something special about the balance—serious academic energy mixed with genuine warmth and endless activity.", 
      images: [
        "image/annA.HEIC",
        "image/anna2.HEIC",
        "image/anna3.HEIC",
        "image/anna4.HEIC",
        "image/anna5.HEIC",
        "image/anna6.HEIC",
        "image/anna7.HEIC",
        "image/anna9.HEIC",
        "image/anna10.HEIC",
        "image/anna11.HEIC",
        "image/anna12.HEIC",
        "image/anna13.HEIC",
        "image/anna14.HEIC",
        "image/anna15.HEIC",
        "image/anna16.HEIC",
        "image/anna17.HEIC",
        "image/anna18.HEIC",
        "image/anna19.HEIC",
        "image/anna20.mp4",
      ] },
      { name: "Detroit 🇺🇸", description: "Detroit had a different feel. Some areas felt raw, even a little intimidating, but under that surface was a city rebuilding itself. We explored museums, saw a Red Wings hockey game, and noticed small signs of revival in once-forgotten neighborhoods. It wasn't polished—but it was real.", 
      images: [
        "image/detroit.heic",
        "image/detroit2.heic",
        "image/detroit3.heic",
        "image/detroit4.heic",
        "image/detroit5.heic",
      ] },
      { name: "New York 🇺🇸", description: "In New York, I did everything a tourist should. Times Square at night, biking through Central Park, bagels in the morning and street food in the afternoon. The city moved fast, but that just made the quiet moments—like sitting in Washington Square Park—feel even more vivid. Every corner felt like a scene from a movie.", 
      images: [
        "image/newyork.jpg",
        "image/statue-liberty.jpg",
        "image/newyork3.jpg",
        "image/newyourk2.jpg",
        "image/NYC.HEIC",
        "image/NYC2.HEIC",
        "image/NYC3.HEIC",
        "image/NYC4.HEIC",
        "image/NYC4.jpg",
        "image/NYC5.HEIC",
      ] },
      { name: "Miami 🇺🇸", description: "Miami was all about movement and color. Mornings began with long beach walks, afternoons meant biking through the art-filled streets of Wynwood, and evenings were reserved for watching the sky turn pink over the ocean. It was a family trip, but it still felt like an escape into summer.", 
      images: [
        "image/miami2.heic",
        "image/miami3.heic",
        "image/miami4.heic",
        "image/miami5.heic",
        "image/miami7.heic",
        "image/miami8.heic",
      ] }
    ],
    "Canada": [
      { name: "Niagara falls 🇨🇦", description: "We took a daytrip to the wonderful niagara falls. Truly amazing views!", 
      images: [
        "image/niagara.jpg",
        "image/niagara-2.jpg",
        "image/niagara4.jpg",
        "image/niagara5.jpg",
      ] },
      {name: "Toronto 🇨🇦",description: "When my girlfriend visited me during my exchange, we changed our plans last minute and went to Toronto for parts of the stay, since New York was facing extreme cold. Toronto was still freezing, with snow-covered streets and icy air, but we made the most of it, visiting the CN Tower, exploring Little Italy, and taking a day trip to Niagara Falls. Despite the weather, it was a great experience.",
      images: [
        "image/toronto.jpg",
        "image/toronto-tower.jpg",
        "image/toronto3.jpg",
        "image/toronto4.jpg"
      ] 
    }],
    "Hungary": {
      title: "Budapest Beauty 🇭🇺",
      description: "Budapest was an anniversary gift from my girlfriend, and it turned out to be one of our most memorable trips. We soaked in thermal baths, walked across the Chain Bridge, and explored the local food scene. One afternoon, we took a chimney cake baking class - fun, a bit chaotic, and a highlight of the trip",
      images: [
        "image/budapest-baking.jpg",
        "image/budapest-bar.jpg",
        "image/budapest-toppen.jpg",
        "image/budapest.jpg",
      ]
    },
    "Croatia": {
      title: "Adriatic Adventure 🇭🇷",
      description: "It was a boys' trip full of late mornings, sunny afternoons by the beach, and long nights at pool parties or clubs that blurred into sunrise. Somewhere in the middle of all that, I met my girlfriend—turning an unforgettable trip into the start of something even more meaningful.",
      images: ["images/croatia1.jpg"]
    },

    "Albania": {
      title: "Albanian Escape 🇦🇱",
      description: "Albania turned out to be the perfect summer destination for two students on a budget. Everything cost half as much as back home, and the beaches were stunning. We drove across the country—navigating chaotic roads from Tirana all the way down to Ksamil. Along the way we found hidden coves, ate fresh seafood by the sea, and watched unforgettable sunsets. It felt like discovering a secret Mediterranean gem.",
      images: ["images/albania1.jpg"]
    },
    
    "Dominican Republic": {
      title: "Caribbean All-Inclusive 🇩🇴",
      description: "Our family trip to the Dominican Republic was all about slowing down and soaking it all in. We stayed at the Hard Rock Hotel, a massive resort with over twenty pools and more restaurants than we could try. I spent hours barefoot on a grass field playing football, only taking breaks to cool off or catch a World Cup match on the big screen. It was easy to forget what day it was—the sun, the rhythm, the laughter kept it all flowing.",
      images: [
        "image/punta.jpg",
        "image/punta2.jpg",
        "image/punta3.jpg",
        "image/puntacana.jpg",
      ]
    },
   
    "Greece": [
      { name: "Athens 🇬🇷", description: "Athens was loud, warm, and full of history. The Acropolis towered above the city, and wandering through ruins while the modern city buzzed around us felt surreal. We balanced sightseeing with shopping and long meals where the food never stopped coming.", 
      images: [
        "image/athen9.jpg",
        "image/athen10.jpg",
        "image/athen11.jpg",
        "image/athen.heic",
        "image/athen2.heic",
        "image/athen3.heic",
        "image/athen4.heic",
        "image/athen5.heic",
        "image/athen6.heic",
        "image/athen7.heic",
        "image/athen8.heic",
      ] },
      { name: "Antiparos 🇬🇷", description: "I joined my girlfriend’s family for a trip to Antiparos, and the island became our shared little world. We rode quad bikes on dusty roads, jumped off boats into clear water, and spent entire days moving between pool and sea. It was peaceful and playful all at once.", 
      images: [
        "image/antiparos-1.jpg",
        "image/antiparos-6.jpg",
        "image/antiparos-strand.jpg",
        "image/antiparos-sunset3.jpg",
        "image/antiparos-therooster.jpg",
    ] },
      { name: "Santorini 🇬🇷", description: "Family vacation in Santorini was beautiful and chaotic. White-washed buildings, cobbled streets packed with tourists, and donkeys carrying people up the steep hills. We explored, shopped, and always ended our days with sunsets that made everyone stop talking.", 
      images: [
        "images/hellas2.heic",
        "images/hellas3.heic",
        "images/hellas4.heic",
      ] }
    ],
    "United Kingdom": [
      { name: "London 🇬🇧", description: "London was vibrant and full of energy, made even more memorable by having my girlfriend, who had lived there, as a guide. She introduced me to both the city’s iconic landmarks and its hidden gems. From West End performances to rainy strolls through local markets, it was a meaningful way to experience the city through her eyes.", 
      images: [
        "image/london-bigben.jpg",
        "image/london-eye.jpg",
        "image/london-park-natt.jpg",
        "image/london.jpg",
        "image/london4.jpg",
        "image/london5.jpg",
      ] },
      { name: "Edinburgh 🇬🇧", description: "Edinburgh was a city full of history and character. We visited my sister, who is currently studying there, and spent the days exploring castles, walking through the city, and enjoying traditional pubs.", 
      images: [
        "image/edinburgh.jpg",
        "image/edinburgh-2.jpg",
        "image/edinburgh-3.jpg",
        "image/edinburgh4.jpg",
      ] }
    ]
  };
  
  const map = L.map('map', {
    zoomControl: false,
    dragging: false,
    scrollWheelZoom: false,
    doubleClickZoom: false,
    boxZoom: false,
    touchZoom: false,
    keyboard: false
  }).setView([30, 0], 2);
  
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);
  
  let geojson; // define geojson at top so it can be referenced later
  
  function onEachFeature(feature, layer) {
    const name = feature.properties.name;
  
    layer.on('mouseover', function () {
      this.setStyle({ weight: 2, fillColor: '#06213f', fillOpacity: 1, color: '#06213f' });
      this.bringToFront();
    });
  
    layer.on('mouseout', function () {
      geojson.resetStyle(this);
    });
  
    if (visitedMemories[name]) {
      layer.on('click', () => {
        const memory = visitedMemories[name];
        const title = document.getElementById('modalTitle');
        const desc = document.getElementById('modalDescription');
        const imgContainer = document.getElementById('modalImages');
        const tripSelector = document.getElementById('tripSelector');
        const modal = document.getElementById('travelModal');
  
        if (!title || !desc || !imgContainer || !tripSelector || !modal) return;
  
        tripSelector.innerHTML = '';
        imgContainer.innerHTML = '';
  
        if (Array.isArray(memory)) {
          memory.forEach((trip, index) => {
            const btn = document.createElement('button');
            btn.textContent = trip.name;
            btn.addEventListener('click', () => {
              title.textContent = trip.name;
              desc.textContent = trip.description;
              imgContainer.innerHTML = '';
              trip.images.forEach(src => {
                const img = document.createElement('img');
                img.src = src;
                img.alt = trip.name;
                imgContainer.appendChild(img);
              });
            });
            tripSelector.appendChild(btn);
          });
          tripSelector.querySelector('button').click();
        } else {
          title.textContent = memory.title;
          desc.textContent = memory.description;
          memory.images.forEach(src => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = memory.title;
            imgContainer.appendChild(img);
          });
        }
  
        modal.style.display = 'block';
      });
    }
  }
  
  geojson = L.geoJSON(null, {
    style: feature => {
      const name = feature.properties.name;
      const visited = visitedMemories.hasOwnProperty(name);
      return {
        color: "#0a3d62",
        weight: 1,
        fillColor: visited ? "#0a3d62" : "#ccc",
        fillOpacity: visited ? 0.85 : 0.2
      };
    },
    onEachFeature: onEachFeature
  }).addTo(map);
  
  fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
    .then(res => res.json())
    .then(data => geojson.addData(data));
  
  document.getElementById('modalClose')?.addEventListener('click', () => {
    const modal = document.getElementById('travelModal');
    if (modal) modal.style.display = 'none';
  });
  
  document.getElementById('closeBanner')?.addEventListener('click', () => {
    const banner = document.getElementById('infoBanner');
    if (banner) banner.style.display = 'none';
  });

  // Close modal when clicking outside modal-content
document.getElementById('travelModal')?.addEventListener('click', function (event) {
  if (event.target === this) {
    this.style.display = 'none';
  }
});
