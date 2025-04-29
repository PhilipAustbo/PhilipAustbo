const visitedMemories = {
    // full visitedMemories object you posted earlier
    "Norway": {
      title: "Home Sweet Home 🇳🇴",
      description: "Fjords, midnight sun, and skiing adventures.",
      images: ["images/norway1.jpg"]
    },
    "Spain": {
      title: "Barcelona Escape 🇪🇸",
      description: "Tapas, Sagrada Familia, and beach vibes.",
      images: ["images/spain1.jpg", "images/spain2.jpg"]
    },
    "France": [
      { name: "Paris 🇫🇷", description: "Croissants by the Seine and Montmartre evenings.", images: ["images/paris1.jpg"] },
      { name: "Cannes 🇫🇷", description: "Film festival atmosphere and Riviera charm.", images: ["images/cannes1.jpg"] },
      { name: "Champagne 🇫🇷", description: "Toured vineyards and tasted world-class bubbly.", images: ["images/champagne1.jpg"] }
    ],
    "Sweden": {
      title: "Summer in Stockholm 🇸🇪",
      description: "Island hopping and fika with friends.",
      images: ["images/sweden1.jpg"]
    },
    "Denmark": {
      title: "Copenhagen Cool 🇩🇰",
      description: "Cycling, canals, and cozy cafés.",
      images: ["images/denmark1.jpg"]
    },
    "United Arab Emirates": {
      title: "Desert and Skyscrapers 🇦🇪",
      description: "Dubai adventures and desert safaris.",
      images: ["images/uae1.jpg"]
    },
    "Maldives": {
      title: "Tropical Paradise 🇲🇻",
      description: "Crystal-clear waters and white sand beaches.",
      images: ["images/maldives1.jpg"]
    },
    "Poland": {
      title: "Historic Kraków 🇵🇱",
      description: "Old towns, history, and hearty meals.",
      images: ["images/poland1.jpg"]
    },
    "Germany": {
      title: "Berlin & Beyond 🇩🇪",
      description: "History, culture, and bratwurst.",
      images: ["images/germany1.jpg"]
    },
    "United States of America": [
      { name: "Chicago 🇺🇸", description: "Deep dish pizza, skyscrapers, and lakeside walks.", images: ["images/chicago.jpg"] },
      { name: "Ann Arbor 🇺🇸", description: "Exchange semester at Michigan – Go Blue!", images: ["images/annarbor.jpg"] },
      { name: "Detroit 🇺🇸", description: "Motown, architecture, and cultural revival.", images: ["images/detroit.jpg"] },
      { name: "New York 🇺🇸", description: "Times Square, Central Park, and Manhattan energy.", images: ["images/nyc.jpg"] },
      { name: "Miami 🇺🇸", description: "Beach days and vibrant nightlife.", images: ["images/miami.jpg"] }
    ],
    "Canada": {
      title: "Toronto 🇨🇦",
      description: "CN Tower, waterfront walks, and multicultural food.",
      images: ["images/toronto.jpg"]
    },
    "Hungary": {
      title: "Budapest Beauty 🇭🇺",
      description: "Thermal baths and Danube views.",
      images: ["images/hungary1.jpg"]
    },
    "Croatia": {
      title: "Adriatic Adventure 🇭🇷",
      description: "Island hopping and sea kayaking.",
      images: ["images/croatia1.jpg"]
    },
    "Greece": {
      title: "Greek Islands 🇬🇷",
      description: "White buildings, blue water, epic sunsets.",
      images: ["images/greece1.jpg"]
    },
    "United Kingdom": [
      { name: "London 🇬🇧", description: "Big Ben, finance, and world-class museums.", images: ["images/london.jpg"] },
      { name: "Edinburgh 🇬🇧", description: "Historic castles, cozy pubs, and Scottish charm.", images: ["images/edinburgh.jpg"] }
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