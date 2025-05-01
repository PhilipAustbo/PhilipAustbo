const visitedMemories = {
    // full visitedMemories object you posted earlier
    "Norway": {
      title: "Norway.  🇳🇴",
      description: "Living in Norway is a blend of routines and moments that feel just right. My days are filled with lectures, football matches with friends, home-cooked meals, and quiet evenings. It’s the backdrop of my everyday life. ",
      images: ["images/norway1.jpg"]
    },
    
    "Spain": [
      { name: "Marbella 🇪🇸", description: "We spent our family vacation in Marbella, soaking up the sun and taking day trips to Puerto Banús. It was a mix of lazy beach days and window-shopping in luxury boutiques. The afternoons were slow and warm, and evenings meant good food and long conversations by the pool. ", images: ["images/paris1.jpg"] },
      { name: "Nerja 🇪🇸", description: "Visiting my grandparents’ home in Nerja offered a slower pace. Life there revolved around local cafés, chatting with neighbors, and long dinners that stretched into the night. I played football with the neighborhood kids and got a glimpse of what everyday life in a Spanish coastal town feels like.. ", images: ["images/cannes1.jpg"] },
      { name: "Palma 🇪🇸", description: "A spontaneous boys’ trip to Palma turned into a great mix of adventure and downtime. We hiked through rugged mountains in the mornings and hit the beach or local bars at night. It was a few days of carefree laughter, group dinners, and shared stories under the stars..", images: ["images/cannes1.jpg"] }
    ],
    "France": [
      { name: "Paris 🇫🇷", description: "My first trip with my girlfriend took us to Paris. We spent hours wandering the streets, visiting every landmark we could find—the Eiffel Tower, the Louvre, Notre-Dame. In between, we had café stops and sat on benches, sharing pastries and soaking up the city’s beauty. It felt both grand and simple.", images: ["images/paris1.jpg"] },
      { name: "Cannes 🇫🇷", description: "I’ve been lucky to visit Cannes with my family a few times. It’s the kind of place that lingers in your memory—the warm sea breeze, the sound of clinking glasses at beach clubs, and boat days that stretch from morning into the golden hour. The Riviera has a laid-back charm that’s hard to forget.", images: ["images/cannes1.jpg"] },
      { name: "Nice 🇫🇷", description: "We took a few day trips to Nice, often just for the food and atmosphere. Shopping, trying local dishes, and strolling through the evening markets became our rhythm. The sunsets over the water had this calmness that made every visit feel like a pause from the world.", images: ["images/cannes1.jpg"] },
      { name: "Champagne 🇫🇷", description: "A visit to Champagne meant vineyard tours and tasting glasses of sparkling wine in serene countryside settings. It was peaceful and a bit surreal, standing in fields that stretch on forever while learning how something as delicate as champagne is made..", images: ["images/champagne1.jpg"] }
    ],
    "Sweden": {
      title: "Summer in Sweden 🇸🇪",
      description: "We drove through Sweden one summer, eventually making our way to Stockholm. The road trip itself was half the experience—endless forests, lakes that appeared out of nowhere, and quaint little towns we hadn’t planned to stop in.",
      images: ["images/sweden1.jpg"]
    },
    "Monaco": {
      title: "Monaco",
      description: "It was a quick summer visit, but Monaco was unlike anywhere else. We spent the day exploring the harbor, watching yachts bigger than houses, and finding quiet corners of the city to rest our feet. The mix of luxury and Mediterranean calm was surprisingly charming, and sharing it all with close friends made it feel more real than just a postcard..",
      images: ["images/sweden1.jpg"]
    },
    "Denmark": {
      title: "Copenhagen Cool 🇩🇰",
      description: "Copenhagen felt effortlessly cool. We rented bikes and rode everywhere—past canals, street art, and packed coffee spots. There was something comforting about the city’s pace, and the cozy cafés gave us shelter from the wind while we planned out our next stops. I left feeling inspired to bring some of that Danish calm back with me..",
      images: ["images/denmark1.jpg"]
    },
    "United Arab Emirates": {
      title: "Desert and Skyscrapers 🇦🇪",
      description: "Dubai was a world apart. One moment we were standing at the top of the tallest building in the world, and the next we were bouncing through the desert on a safari, watching the sun disappear behind dunes. It was a trip full of contrasts—glass towers and golden sands, luxury malls and old souks—and somehow it all worked..",
      images: ["images/uae1.jpg"]
    },
    "Maldives": {
      title: "Tropical Paradise 🇲🇻",
      description: "The Maldives felt like a dream. Days blurred into each other—waking up to turquoise water, swimming with colorful fish, reading on the beach, and watching sunsets that looked painted. It was the kind of place where you forget about time completely and just exist, barefoot and happy..",
      images: ["images/maldives1.jpg"]
    },
    "Poland": {
      title: "Historic Poland 🇵🇱",
      description: "Gdansk surprised me. The old town was full of charm—horse-drawn carriages, Gothic buildings, and warm food that felt like comfort in a bowl. We explored the city’s rich history by day and tucked into hearty meals by night, always with something new to discover around each corner.",
      images: ["images/poland1.jpg"]
    },
    "Germany": {
      title: "Anniversary in Berlin 🇩🇪",
      description: "I went to Berlin with my girlfriend for our one year anniversary. This meant fancy dinners, coctail bars and fun daytime activities. Berlin was gritty and beautiful in equal measure. We walked a lot—through memorials, museums, street markets, and old neighborhoods full of stories. The food was simple but satisfying (Nothing beats the local egg sandwiches), and each place felt like it had something to teach if you took the time to look. We had an extraordinary time!",
      images: ["images/germany1.jpg"]
    },
    "United States of America": [
      { name: "Chicago 🇺🇸", description: "Chicago welcomed us with wind, towering buildings, and the smell of pizza in the air. We tried deep dish (as thick and cheesy as promised), walked along the lakeshore, and explored the city’s architecture. It had that big city energy but with a slower rhythm than New York—easier to breathe in..", images: ["images/chicago.jpg"] },
      { name: "Ann Arbor 🇺🇸", description: "Ann Arbor was a chapter of its own—my exchange semester at the University of Michigan. Between lectures, football games, late-night study sessions, and spontaneous yard parties, I found a second home. There was something special about the balance—serious academic energy mixed with genuine warmth and endless activity.", images: ["images/annarbor.jpg"] },
      { name: "Detroit 🇺🇸", description: "Detroit had a different feel. Some areas felt raw, even a little intimidating, but under that surface was a city rebuilding itself. We explored museums, saw a Red Wings hockey game, and noticed small signs of revival in once-forgotten neighborhoods. It wasn't polished—but it was real.", images: ["images/detroit.jpg"] },
      { name: "New York 🇺🇸", description: "In New York, I did everything a tourist should. Times Square at night, biking through Central Park, bagels in the morning and street food in the afternoon. The city moved fast, but that just made the quiet moments—like sitting in Washington Square Park—feel even more vivid. Every corner felt like a scene from a movie.", images: ["images/nyc.jpg"] },
      { name: "Miami 🇺🇸", description: "Miami was all about movement and color. Mornings began with long beach walks, afternoons meant biking through the art-filled streets of Wynwood, and evenings were reserved for watching the sky turn pink over the ocean. It was a family trip, but it still felt like an escape into summer.", images: ["images/miami.jpg"] }
    ],
    "Canada": {
      title: "Toronto 🇨🇦",
      description: "We visited Toronto in the middle of winter, which meant snow-covered streets and a deep chill in the air. Still, we explored the CN Tower, wandered through Little Italy, and took a day trip to Niagara Falls. Cold fingers, warm meals, and city lights—Toronto had a quiet strength to it.",
      images: ["images/toronto.jpg"]
    },
    "Hungary": {
      title: "Budapest Beauty 🇭🇺",
      description: "Budapest had that postcard-perfect look with a lived-in soul. We soaked in thermal baths with steam rising into the winter sky, crossed the Chain Bridge for river views, and tried every Hungarian dish we could. One afternoon we even learned to bake chimney cakes, laughing our way through the sticky dough and powdered sugar mess.",
      images: ["images/hungary1.jpg"]
    },
    "Croatia": {
      title: "Adriatic Adventure 🇭🇷",
      description: "Split was the kind of place where time doesn’t matter. It was a boys' trip full of late mornings, sunny afternoons by the beach, and long nights at pool parties or clubs that blurred into sunrise. Beneath all that fun was a beautiful city with old stone walls, clear water, and the smell of salt in the air.",
      images: ["images/croatia1.jpg"]
    },
   
    "Greece": [
      { name: "Athens 🇬🇷", description: "Athens was loud, warm, and full of history. The Acropolis towered above the city, and wandering through ruins while the modern city buzzed around us felt surreal. We balanced sightseeing with shopping and long meals where the food never stopped coming..", images: ["images/.jpg"] },
      { name: "Antiparos 🇬🇷", description: "I joined my girlfriend’s family for a trip to Antiparos, and the island became our shared little world. We rode quad bikes on dusty roads, jumped off boats into clear water, and spent entire days moving between pool and sea. It was peaceful and playful all at once.", images: ["images/.jpg"] },
      { name: "Santorini 🇬🇷", description: "Family vacation in Santorini was beautiful and chaotic. White-washed buildings, cobbled streets packed with tourists, and donkeys carrying people up the steep hills. We explored, shopped, and always ended our days with sunsets that made everyone stop talking.", images: ["images/.jpg"] }
    ],
    "United Kingdom": [
      { name: "London 🇬🇧", description: "London was electric. We hit all the classics—Big Ben, Buckingham Palace, Oxford Street. At night, we saw a musical in the West End, and during the day we tried not to get lost on the Tube. Museums, food markets, and rainy walks—it all blended into a memory that still feels alive.", images: ["images/london.jpg"] },
      { name: "Edinburgh 🇬🇧", description: "I visited my sister in Edinburgh while she was studying there, and the city quickly grew on me. Castles overlooking the city, narrow alleys that felt like stepping into the past, and cozy pubs that warmed us up after exploring in the cold. The food was surprisingly great, and so was the company.", images: ["images/edinburgh.jpg"] }
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