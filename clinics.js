const clinics = {
    nairobi: [
      { name: 'Mbagathi Hospital', location: 'Lang’ata Rd' },
      { name: 'Marie Stopes', location: 'Ngong Road' },
      { name: 'Kenyatta National Hospital', location: 'Hospital Rd' },
    ],
  };
  
  module.exports = (area) => clinics[area.toLowerCase()] || [];
  