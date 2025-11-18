export interface PostalCodeInfo {
  code: string;
  locality: string;
  municipality: string;
  district: string;
}

// Common Portuguese postal codes with their locations
// This is a sample data - in production, you might want to use a more comprehensive database
export const portuguesePostalCodes: PostalCodeInfo[] = [
  // Lisbon area
  { code: "1000-001", locality: "Lisboa", municipality: "Lisboa", district: "Lisboa" },
  { code: "1000-002", locality: "Lisboa", municipality: "Lisboa", district: "Lisboa" },
  { code: "1100-001", locality: "Lisboa", municipality: "Lisboa", district: "Lisboa" },
  { code: "1200-001", locality: "Lisboa", municipality: "Lisboa", district: "Lisboa" },
  { code: "1300-001", locality: "Lisboa", municipality: "Lisboa", district: "Lisboa" },
  { code: "1400-001", locality: "Lisboa", municipality: "Lisboa", district: "Lisboa" },
  { code: "1500-001", locality: "Lisboa", municipality: "Lisboa", district: "Lisboa" },
  { code: "1600-001", locality: "Lisboa", municipality: "Lisboa", district: "Lisboa" },
  { code: "1700-001", locality: "Lisboa", municipality: "Lisboa", district: "Lisboa" },
  { code: "1800-001", locality: "Lisboa", municipality: "Lisboa", district: "Lisboa" },
  { code: "1900-001", locality: "Lisboa", municipality: "Lisboa", district: "Lisboa" },
  { code: "1950-001", locality: "Lisboa", municipality: "Lisboa", district: "Lisboa" },
  { code: "1990-001", locality: "Lisboa", municipality: "Lisboa", district: "Lisboa" },
  
  // Porto area
  { code: "4000-001", locality: "Porto", municipality: "Porto", district: "Porto" },
  { code: "4000-002", locality: "Porto", municipality: "Porto", district: "Porto" },
  { code: "4100-001", locality: "Porto", municipality: "Porto", district: "Porto" },
  { code: "4200-001", locality: "Porto", municipality: "Porto", district: "Porto" },
  { code: "4300-001", locality: "Porto", municipality: "Porto", district: "Porto" },
  { code: "4400-001", locality: "Vila Nova de Gaia", municipality: "Vila Nova de Gaia", district: "Porto" },
  { code: "4500-001", locality: "Espinho", municipality: "Espinho", district: "Aveiro" },
  { code: "4500-002", locality: "Espinho", municipality: "Espinho", district: "Aveiro" },
  { code: "4550-001", locality: "Santa Maria da Feira", municipality: "Santa Maria da Feira", district: "Aveiro" },
  
  // Other major cities
  { code: "3000-001", locality: "Coimbra", municipality: "Coimbra", district: "Coimbra" },
  { code: "3000-002", locality: "Coimbra", municipality: "Coimbra", district: "Coimbra" },
  { code: "3020-001", locality: "Coimbra", municipality: "Coimbra", district: "Coimbra" },
  { code: "3040-001", locality: "Coimbra", municipality: "Coimbra", district: "Coimbra" },
  { code: "3050-001", locality: "Coimbra", municipality: "Coimbra", district: "Coimbra" },
  { code: "3060-001", locality: "Coimbra", municipality: "Coimbra", district: "Coimbra" },
  { code: "3810-001", locality: "Aveiro", municipality: "Aveiro", district: "Aveiro" },
  { code: "3810-002", locality: "Aveiro", municipality: "Aveiro", district: "Aveiro" },
  { code: "3830-001", locality: "Ílhavo", municipality: "Ílhavo", district: "Aveiro" },
  { code: "3834-001", locality: "Ílhavo", municipality: "Ílhavo", district: "Aveiro" },
  { code: "3850-001", locality: "Albergaria-a-Velha", municipality: "Albergaria-a-Velha", district: "Aveiro" },
  { code: "3860-001", locality: "Estarreja", municipality: "Estarreja", district: "Aveiro" },
  { code: "4700-001", locality: "Braga", municipality: "Braga", district: "Braga" },
  { code: "4700-002", locality: "Braga", municipality: "Braga", district: "Braga" },
  { code: "4715-001", locality: "Braga", municipality: "Braga", district: "Braga" },
  { code: "4720-001", locality: "Braga", municipality: "Braga", district: "Braga" },
  { code: "4730-001", locality: "Vila Verde", municipality: "Vila Verde", district: "Braga" },
  { code: "4740-001", locality: "Esposende", municipality: "Esposende", district: "Braga" },
  { code: "4800-001", locality: "Guimarães", municipality: "Guimarães", district: "Braga" },
  { code: "4810-001", locality: "Guimarães", municipality: "Guimarães", district: "Braga" },
  { code: "4835-001", locality: "Vizela", municipality: "Vizela", district: "Braga" },
  { code: "4835-517", locality: "Nespereira", municipality: "Guimarães", district: "Braga" },
  { code: "4850-001", locality: "Póvoa de Lanhoso", municipality: "Póvoa de Lanhoso", district: "Braga" },
  { code: "4900-001", locality: "Viana do Castelo", municipality: "Viana do Castelo", district: "Viana do Castelo" },
  { code: "4935-001", locality: "Caminha", municipality: "Caminha", district: "Viana do Castelo" },
  { code: "4950-001", locality: "Monção", municipality: "Monção", district: "Viana do Castelo" },
  { code: "4980-001", locality: "Ponte de Lima", municipality: "Ponte de Lima", district: "Viana do Castelo" },
  { code: "4990-001", locality: "Ponte da Barca", municipality: "Ponte da Barca", district: "Viana do Castelo" },
  { code: "5000-001", locality: "Vila Real", municipality: "Vila Real", district: "Vila Real" },
  { code: "5100-001", locality: "Bragança", municipality: "Bragança", district: "Bragança" },
  { code: "5200-001", locality: "Mirandela", municipality: "Mirandela", district: "Bragança" },
  { code: "5300-001", locality: "Chaves", municipality: "Chaves", district: "Vila Real" },
  { code: "5400-001", locality: "Viseu", municipality: "Viseu", district: "Viseu" },
  { code: "5415-001", locality: "Viseu", municipality: "Viseu", district: "Viseu" },
  { code: "5425-001", locality: "Tondela", municipality: "Tondela", district: "Viseu" },
  { code: "5430-001", locality: "Mangualde", municipality: "Mangualde", district: "Viseu" },
  { code: "5450-001", locality: "Viseu", municipality: "Viseu", district: "Viseu" },
  { code: "5500-001", locality: "Castelo Branco", municipality: "Castelo Branco", district: "Castelo Branco" },
  { code: "6000-001", locality: "Guarda", municipality: "Guarda", district: "Guarda" },
  { code: "6100-001", locality: "Covilhã", municipality: "Covilhã", district: "Castelo Branco" },
  { code: "6200-001", locality: "Fundão", municipality: "Fundão", district: "Castelo Branco" },
  { code: "6300-001", locality: "Seia", municipality: "Seia", district: "Guarda" },
  { code: "7000-001", locality: "Évora", municipality: "Évora", district: "Évora" },
  { code: "7100-001", locality: "Estremoz", municipality: "Estremoz", district: "Évora" },
  { code: "7200-001", locality: "Reguengos de Monsaraz", municipality: "Reguengos de Monsaraz", district: "Évora" },
  { code: "7300-001", locality: "Beja", municipality: "Beja", district: "Beja" },
  { code: "7400-001", locality: "Ourique", municipality: "Ourique", district: "Beja" },
  { code: "7500-001", locality: "Moura", municipality: "Moura", district: "Beja" },
  { code: "7800-001", locality: "Beja", municipality: "Beja", district: "Beja" },
  { code: "8000-001", locality: "Faro", municipality: "Faro", district: "Faro" },
  { code: "8000-002", locality: "Faro", municipality: "Faro", district: "Faro" },
  { code: "8100-001", locality: "Loulé", municipality: "Loulé", district: "Faro" },
  { code: "8200-001", locality: "Albufeira", municipality: "Albufeira", district: "Faro" },
  { code: "8300-001", locality: "Silves", municipality: "Silves", district: "Faro" },
  { code: "8400-001", locality: "Portimão", municipality: "Portimão", district: "Faro" },
  { code: "8500-001", locality: "Monchique", municipality: "Monchique", district: "Faro" },
  { code: "8600-001", locality: "Lagos", municipality: "Lagos", district: "Faro" },
  { code: "8700-001", locality: "Olhão", municipality: "Olhão", district: "Faro" },
  { code: "8800-001", locality: "Tavira", municipality: "Tavira", district: "Faro" },
  { code: "8900-001", locality: "Vila Real de Santo António", municipality: "Vila Real de Santo António", district: "Faro" },
  
  // Madeira
  { code: "9000-001", locality: "Funchal", municipality: "Funchal", district: "Madeira" },
  { code: "9000-002", locality: "Funchal", municipality: "Funchal", district: "Madeira" },
  { code: "9100-001", locality: "Santa Cruz", municipality: "Santa Cruz", district: "Madeira" },
  { code: "9200-001", locality: "Machico", municipality: "Machico", district: "Madeira" },
  
  // Azores
  { code: "9500-001", locality: "Ponta Delgada", municipality: "Ponta Delgada", district: "Açores" },
  { code: "9500-002", locality: "Ponta Delgada", municipality: "Ponta Delgada", district: "Açores" },
  { code: "9700-001", locality: "Angra do Heroísmo", municipality: "Angra do Heroísmo", district: "Açores" },
  { code: "9900-001", locality: "Horta", municipality: "Horta", district: "Açores" },
];

// Function to search postal codes
export const searchPostalCodes = (query: string): PostalCodeInfo[] => {
  if (!query || query.length < 2) return [];
  
  const normalizedQuery = query.toLowerCase().replace(/[-\s]/g, '');
  
  return portuguesePostalCodes.filter(postalCode => {
    const normalizedCode = postalCode.code.toLowerCase().replace(/[-\s]/g, '');
    const normalizedLocality = postalCode.locality.toLowerCase();
    const normalizedMunicipality = postalCode.municipality.toLowerCase();
    
    return normalizedCode.includes(normalizedQuery) ||
           normalizedLocality.includes(normalizedQuery.toLowerCase()) ||
           normalizedMunicipality.includes(normalizedQuery.toLowerCase());
  }).slice(0, 10); // Limit to 10 results
};

// Function to format postal code
export const formatPostalCode = (value: string): string => {
  // Remove all non-digits
  const digits = value.replace(/\D/g, '');
  
  // Format as XXXX-XXX
  if (digits.length <= 4) {
    return digits;
  } else if (digits.length <= 7) {
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  } else {
    return `${digits.slice(0, 4)}-${digits.slice(4, 7)}`;
  }
};

// Function to validate postal code format
export const isValidPostalCode = (postalCode: string): boolean => {
  const postalCodeRegex = /^\d{4}-\d{3}$/;
  return postalCodeRegex.test(postalCode);
};