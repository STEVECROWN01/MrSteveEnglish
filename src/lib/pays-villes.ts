/**
 * PAYS & VILLES DU FORMULAIRE D'INSCRIPTION (Task 39 — instruction
 * propriétaire).
 *
 * Le champ « Pays » du formulaire est un DROPLISTE listant TOUS les
 * pays (avec leur drapeau) ; le champ « Ville » est lui aussi un
 * dropliste qui ne propose QUE les villes du pays sélectionné — le
 * prospect doit donc choisir son pays AVANT sa ville.
 *
 * • code : ISO 3166-1 alpha-2 (minuscule) — sert à construire l'URL
 *   du drapeau (https://flagcdn.com/w40/{code}.png, CDN public
 *   gratuit et fiable ; repli alt = nom du pays).
 * • nom : nom français usuel (affiché tel quel ; le formulaire, le
 *   reçu PDF et l'email au coach reçoivent ce nom).
 * • villes : villes principales du pays — couverture volontairement
 *   TRÈS large pour l'Afrique de l'Ouest/centrale et la France
 *   (public du site), solide pour le reste du monde.
 *
 * Liste triée alphabétiquement (ordre français) pour un repérage
 * immédiat dans le dropliste, qui propose en plus une recherche.
 */

export type Pays = {
  code: string;
  nom: string;
  villes: string[];
};

export const PAYS_VILLES: Pays[] = [
  { code: "af", nom: "Afghanistan", villes: ["Kaboul", "Kandahar", "Hérat", "Mazar-e-Sharif", "Jalalabad", "Kunduz", "Ghazni"] },
  { code: "za", nom: "Afrique du Sud", villes: ["Johannesburg", "Le Cap", "Durban", "Pretoria", "Soweto", "Port Elizabeth", "Bloemfontein", "East London", "Kimberley", "Pietermaritzburg", "Polokwane", "Nelspruit"] },
  { code: "al", nom: "Albanie", villes: ["Tirana", "Durrës", "Vlora", "Shkodra", "Elbasan", "Fier"] },
  { code: "dz", nom: "Algérie", villes: ["Alger", "Oran", "Constantine", "Annaba", "Blida", "Batna", "Sétif", "Tlemcen", "Béjaïa", "Tizi Ouzou", "Ouargla", "Skikda", "Ghardaïa", "Tébessa", "Mostaganem", "Sidi Bel Abbès", "Béchar"] },
  { code: "de", nom: "Allemagne", villes: ["Berlin", "Hambourg", "Munich", "Cologne", "Francfort-sur-le-Main", "Stuttgart", "Düsseldorf", "Leipzig", "Dortmund", "Essen", "Brême", "Dresde", "Hanovre", "Nuremberg", "Bonn", "Münster"] },
  { code: "ad", nom: "Andorre", villes: ["Andorre-la-Vieille", "Les Escaldes", "Encamp", "La Massana"] },
  { code: "ao", nom: "Angola", villes: ["Luanda", "Huambo", "Lobito", "Benguela", "Cabinda", "Malanje", "Lubango", "Namibe", "Uíge", "Cuito"] },
  { code: "ag", nom: "Antigua-et-Barbuda", villes: ["Saint John's", "All Saints", "Liberta"] },
  { code: "sa", nom: "Arabie saoudite", villes: ["Riyad", "Djeddah", "La Mecque", "Médine", "Dammam", "Dhahran", "Khobar", "Taïf", "Tabuk", "Abha"] },
  { code: "ar", nom: "Argentine", villes: ["Buenos Aires", "Córdoba", "Rosario", "Mendoza", "La Plata", "Mar del Plata", "Salta", "San Miguel de Tucumán", "Santa Fe", "Neuquén"] },
  { code: "am", nom: "Arménie", villes: ["Erevan", "Gyumri", "Vanadzor", "Vagharshapat"] },
  { code: "au", nom: "Australie", villes: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adélaïde", "Gold Coast", "Canberra", "Newcastle", "Wollongong", "Hobart", "Cairns", "Darwin"] },
  { code: "at", nom: "Autriche", villes: ["Vienne", "Graz", "Linz", "Salzbourg", "Innsbruck", "Klagenfurt"] },
  { code: "az", nom: "Azerbaïdjan", villes: ["Bakou", "Gandja", "Sumqayıt", "Mingachevir", "Lankaran"] },
  { code: "bs", nom: "Bahamas", villes: ["Nassau", "Freeport", "West End"] },
  { code: "bh", nom: "Bahreïn", villes: ["Manama", "Riffa", "Muharraq"] },
  { code: "bd", nom: "Bangladesh", villes: ["Dacca", "Chittagong", "Khulna", "Rajshahi", "Sylhet", "Barisal", "Rangpur", "Comilla"] },
  { code: "bb", nom: "Barbade", villes: ["Bridgetown", "Speightstown", "Oistins"] },
  { code: "be", nom: "Belgique", villes: ["Bruxelles", "Anvers", "Gand", "Charleroi", "Liège", "Bruges", "Namur", "Louvain", "Alost", "Mons", "La Louvière", "Malines", "Hasselt"] },
  { code: "bz", nom: "Belize", villes: ["Belize City", "Belmopan", "San Ignacio", "Orange Walk"] },
  { code: "bj", nom: "Bénin", villes: ["Cotonou", "Porto-Novo", "Abomey-Calavi", "Djougou", "Parakou", "Bohicon", "Kandi", "Natitingou", "Lokossa", "Ouidah", "Abomey", "Dassa-Zoumè", "Comè", "Allada", "Sakété", "Pobè", "Bantè", "Nikki", "Savalou", "Aplahoué", "Dogbo", "Malanville", "Bembèrèkè", "Sinendé", "Tchaourou", "Bassila", "Ouèssè", "Kétou", "Adjarra", "Avrankou", "Akpro-Missérété", "Sèmè-Podji", "Ifangni", "Covè", "Za-Kpota", "Zè", "So-Ava", "Aguégués", "Pèrèrè", "Ségbana"] },
  { code: "bt", nom: "Bhoutan", villes: ["Thimphou", "Phuntsholing", "Punakha", "Samdrup Jongkhar"] },
  { code: "by", nom: "Biélorussie", villes: ["Minsk", "Homiel", "Moguilev", "Vitebsk", "Hrodna", "Brest", "Babrouïsk"] },
  { code: "mm", nom: "Birmanie (Myanmar)", villes: ["Rangoun", "Mandalay", "Naypyidaw", "Bago", "Moulmein", "Taunggyi", "Sittwe"] },
  { code: "bo", nom: "Bolivie", villes: ["La Paz", "Santa Cruz de la Sierra", "Cochabamba", "Sucre", "Oruro", "Tarija", "Potosí", "Trinidad"] },
  { code: "ba", nom: "Bosnie-Herzégovine", villes: ["Sarajevo", "Banja Luka", "Tuzla", "Zenica", "Mostar"] },
  { code: "bw", nom: "Botswana", villes: ["Gaborone", "Francistown", "Molepolole", "Maun", "Serowe"] },
  { code: "br", nom: "Brésil", villes: ["São Paulo", "Rio de Janeiro", "Brasilia", "Salvador", "Fortaleza", "Belo Horizonte", "Manaus", "Curitiba", "Recife", "Porto Alegre", "Belém", "Goiânia", "Campinas", "Natal", "Florianópolis", "Santos", "Vitória"] },
  { code: "bn", nom: "Brunei", villes: ["Bandar Seri Begawan", "Kuala Belait", "Tutong"] },
  { code: "bg", nom: "Bulgarie", villes: ["Sofia", "Plovdiv", "Varna", "Bourgas", "Roussé", "Stara Zagora"] },
  { code: "bf", nom: "Burkina Faso", villes: ["Ouagadougou", "Bobo-Dioulasso", "Koudougou", "Banfora", "Ouahigouya", "Kaya", "Tenkodogo", "Fada N'Gourma", "Houndé", "Dédougou", "Dori", "Ziniaré", "Réo", "Manga", "Gaoua", "Léo", "Nouna", "Sapouy"] },
  { code: "bi", nom: "Burundi", villes: ["Bujumbura", "Gitega", "Ngozi", "Rumonge", "Kayanza", "Muyinga", "Rutana"] },
  { code: "kh", nom: "Cambodge", villes: ["Phnom Penh", "Siem Reap", "Battambang", "Sihanoukville", "Kampong Cham"] },
  { code: "cm", nom: "Cameroun", villes: ["Yaoundé", "Douala", "Garoua", "Bamenda", "Maroua", "Bafoussam", "Ngaoundéré", "Bertoua", "Edéa", "Kumba", "Limbé", "Kribi", "Dschang", "Nkongsamba", "Foumban", "Sangmélima", "Bafang", "Mbalmayo"] },
  { code: "ca", nom: "Canada", villes: ["Toronto", "Montréal", "Calgary", "Ottawa", "Edmonton", "Mississauga", "Winnipeg", "Vancouver", "Québec", "Hamilton", "Halifax", "Victoria", "Saskatoon", "Regina", "St. John's"] },
  { code: "cv", nom: "Cap-Vert", villes: ["Praia", "Mindelo", "Santa Maria", "Assomada", "Pedra Badejo"] },
  { code: "cl", nom: "Chili", villes: ["Santiago", "Valparaíso", "Concepción", "Viña del Mar", "Antofagasta", "Temuco", "Iquique", "Rancagua", "Talca"] },
  { code: "cn", nom: "Chine", villes: ["Pékin", "Shanghai", "Canton (Guangzhou)", "Shenzhen", "Chengdu", "Chongqing", "Tianjin", "Wuhan", "Xi'an", "Hangzhou", "Nankin (Nanjing)", "Shenyang", "Harbin", "Qingdao", "Dalian", "Suzhou"] },
  { code: "cy", nom: "Chypre", villes: ["Nicosie", "Limassol", "Larnaca", "Paphos", "Famagouste"] },
  { code: "co", nom: "Colombie", villes: ["Bogota", "Medellín", "Cali", "Barranquilla", "Carthagène des Indes", "Bucaramanga", "Pereira", "Santa Marta", "Manizales", "Cúcuta", "Ibagué", "Villavicencio"] },
  { code: "km", nom: "Comores", villes: ["Moroni", "Mutsamudu", "Fomboni", "Domoni"] },
  { code: "cg", nom: "Congo (République du)", villes: ["Brazzaville", "Pointe-Noire", "Dolisie", "Nkayi", "Impfondo", "Ouesso", "Gamboma", "Mossendjo"] },
  { code: "cd", nom: "Congo (République démocratique du)", villes: ["Kinshasa", "Lubumbashi", "Mbuji-Mayi", "Kananga", "Kisangani", "Bukavu", "Goma", "Kolwezi", "Likasi", "Uvira", "Boma", "Tshikapa", "Matadi", "Mwene-Ditu", "Butembo", "Mbandaka", "Kikwit"] },
  { code: "kp", nom: "Corée du Nord", villes: ["Pyongyang", "Hamhung", "Chongjin", "Nampo", "Kaesong"] },
  { code: "kr", nom: "Corée du Sud", villes: ["Séoul", "Busan", "Incheon", "Daegu", "Daejeon", "Gwangju", "Ulsan", "Suwon"] },
  { code: "cr", nom: "Costa Rica", villes: ["San José", "Alajuela", "Cartago", "Heredia", "Liberia", "Puntarenas"] },
  { code: "ci", nom: "Côte d'Ivoire", villes: ["Abidjan", "Yamoussoukro", "Bouaké", "Daloa", "San-Pédro", "Korhogo", "Man", "Divo", "Gagnoa", "Abengourou", "Séguéla", "Bondoukou", "Odienné", "Dimbokro", "Dabou", "Grand-Bassam", "Sassandra", "Tiassalé", "Katiola", "Adzopé", "Agboville", "Bingerville", "Anyama", "Duékoué", "Guiglo", "Touba", "Oumé", "Lakota", "Soubré", "Tabou", "Boundiali", "Ferkessédougou", "Toumodi"] },
  { code: "hr", nom: "Croatie", villes: ["Zagreb", "Split", "Rijeka", "Osijek", "Zadar", "Pula"] },
  { code: "cu", nom: "Cuba", villes: ["La Havane", "Santiago de Cuba", "Camagüey", "Holguín", "Santa Clara", "Matanzas", "Cienfuegos"] },
  { code: "dk", nom: "Danemark", villes: ["Copenhague", "Aarhus", "Odense", "Aalborg", "Esbjerg", "Randers"] },
  { code: "dj", nom: "Djibouti", villes: ["Djibouti", "Ali Sabieh", "Tadjoura", "Obock", "Dikhil", "Arta"] },
  { code: "dm", nom: "Dominique", villes: ["Roseau", "Portsmouth", "Mahaut"] },
  { code: "eg", nom: "Égypte", villes: ["Le Caire", "Alexandrie", "Gizeh", "Louxor", "Assouan", "Port-Saïd", "Suez", "Mansourah", "Tanta", "Zagazig", "Hurghada", "Charm el-Cheikh", "Assiout"] },
  { code: "ae", nom: "Émirats arabes unis", villes: ["Dubaï", "Abou Dabi", "Charjah", "Al-Aïn", "Ajman", "Fujaïrah", "Ras el Khaïmah", "Oumm al Qaïwaïn"] },
  { code: "ec", nom: "Équateur", villes: ["Quito", "Guayaquil", "Cuenca", "Santo Domingo", "Manta", "Portoviejo", "Ambato"] },
  { code: "er", nom: "Érythrée", villes: ["Asmara", "Keren", "Massaoua", "Assab", "Adi Keyh"] },
  { code: "es", nom: "Espagne", villes: ["Madrid", "Barcelone", "Valence", "Séville", "Saragosse", "Malaga", "Murcie", "Bilbao", "Alicante", "Cordoue", "Valladolid", "Vigo", "Gijón", "Grenade", "A Coruña", "Pampelune", "Salamanque"] },
  { code: "ee", nom: "Estonie", villes: ["Tallinn", "Tartu", "Narva", "Pärnu"] },
  { code: "sz", nom: "Eswatini", villes: ["Mbabane", "Manzini", "Lobamba", "Siteki"] },
  { code: "us", nom: "États-Unis", villes: ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix", "Philadelphie", "San Antonio", "San Diego", "Dallas", "San José", "Austin", "Jacksonville", "San Francisco", "Columbus", "Seattle", "Denver", "Washington D.C.", "Boston", "Miami", "Atlanta", "Détroit", "Minneapolis", "Orlando", "La Nouvelle-Orléans", "Las Vegas", "Portland", "Nashville", "Memphis"] },
  { code: "et", nom: "Éthiopie", villes: ["Addis-Abeba", "Dire Dawa", "Mekelle", "Gondar", "Bahir Dar", "Hawassa", "Jimma", "Adama", "Dessie", "Debre Berhan", "Harar"] },
  { code: "fj", nom: "Fidji", villes: ["Suva", "Nadi", "Lautoka", "Labasa"] },
  { code: "fi", nom: "Finlande", villes: ["Helsinki", "Espoo", "Tampere", "Vantaa", "Turku", "Oulu"] },
  { code: "fr", nom: "France", villes: ["Paris", "Marseille", "Lyon", "Toulouse", "Nice", "Nantes", "Montpellier", "Strasbourg", "Bordeaux", "Lille", "Rennes", "Reims", "Toulon", "Saint-Étienne", "Le Havre", "Grenoble", "Dijon", "Angers", "Nîmes", "Villeurbanne", "Clermont-Ferrand", "Le Mans", "Aix-en-Provence", "Brest", "Tours", "Amiens", "Limoges", "Annecy", "Metz", "Besançon", "Orléans", "Rouen", "Mulhouse", "Perpignan", "Caen", "Nancy", "Argenteuil", "Roubaix", "Tourcoing", "Avignon", "Créteil", "Dunkerque", "Poitiers", "Versailles", "Pau", "Colombes", "Aubervilliers", "Quimper", "Chambéry"] },
  { code: "ga", nom: "Gabon", villes: ["Libreville", "Port-Gentil", "Franceville", "Oyem", "Moanda", "Lambaréné", "Mouila", "Tchibanga", "Gamba", "Koulamoutou"] },
  { code: "gm", nom: "Gambie", villes: ["Banjul", "Serekunda", "Brikama", "Bakau", "Farafenni", "Basse Santa Su", "Gunjur", "Sukuta"] },
  { code: "ge", nom: "Géorgie", villes: ["Tbilissi", "Batoumi", "Koutaïssi", "Roustavi", "Zugdidi", "Gori"] },
  { code: "gh", nom: "Ghana", villes: ["Accra", "Kumasi", "Tamale", "Takoradi", "Cape Coast", "Tema", "Ho", "Koforidua", "Sunyani", "Bolgatanga", "Wa", "Sekondi", "Obuasi", "Tarkwa", "Axim"] },
  { code: "gr", nom: "Grèce", villes: ["Athènes", "Thessalonique", "Patras", "Héraklion", "Larissa", "Volos", "Ioánnina", "Chaniá"] },
  { code: "gd", nom: "Grenade", villes: ["Saint-George's", "Gouyave", "Sauteurs"] },
  { code: "gn", nom: "Guinée", villes: ["Conakry", "Nzérékoré", "Kankan", "Kindia", "Boké", "Labé", "Kissidougou", "Guéckédougou", "Mamou", "Faranah", "Siguiri", "Macenta", "Pita", "Dalaba", "Koundara", "Coyah"] },
  { code: "gw", nom: "Guinée-Bissau", villes: ["Bissau", "Bafatá", "Gabú", "Bissorã", "Bolama", "Cacheu", "Farim", "Quinhamel"] },
  { code: "gq", nom: "Guinée équatoriale", villes: ["Malabo", "Bata", "Ebebiyín", "Aconibe", "Luba"] },
  { code: "gy", nom: "Guyana", villes: ["Georgetown", "Linden", "New Amsterdam", "Bartica"] },
  { code: "ht", nom: "Haïti", villes: ["Port-au-Prince", "Cap-Haïtien", "Gonaïves", "Les Cayes", "Jacmel", "Port-de-Paix", "Jérémie"] },
  { code: "hn", nom: "Honduras", villes: ["Tegucigalpa", "San Pedro Sula", "La Ceiba", "Choloma", "Puerto Cortés"] },
  { code: "hu", nom: "Hongrie", villes: ["Budapest", "Debrecen", "Szeged", "Miskolc", "Pécs", "Győr"] },
  { code: "mh", nom: "Îles Marshall", villes: ["Majuro", "Ebeye"] },
  { code: "sb", nom: "Îles Salomon", villes: ["Honiara", "Gizo", "Auki"] },
  { code: "in", nom: "Inde", villes: ["New Delhi", "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur", "Lucknow", "Kanpur", "Nagpur", "Indore", "Bhopal", "Patna", "Vadodara"] },
  { code: "id", nom: "Indonésie", villes: ["Jakarta", "Surabaya", "Bandung", "Medan", "Semarang", "Palembang", "Makassar", "Denpasar", "Yogyakarta", "Bandar Lampung", "Malang", "Padang"] },
  { code: "iq", nom: "Irak", villes: ["Bagdad", "Mossoul", "Bassora", "Erbil", "Nadjaf", "Kerbala", "Kirkouk", "Souleimaniye"] },
  { code: "ir", nom: "Iran", villes: ["Téhéran", "Machhad", "Ispahan", "Karaj", "Chiraz", "Tabriz", "Qom", "Ahvaz", "Kermânchâh", "Orumiyeh"] },
  { code: "ie", nom: "Irlande", villes: ["Dublin", "Cork", "Limerick", "Galway", "Waterford", "Kilkenny"] },
  { code: "is", nom: "Islande", villes: ["Reykjavik", "Kópavogur", "Akureyri", "Reykjanesbær"] },
  { code: "il", nom: "Israël", villes: ["Jérusalem", "Tel-Aviv-Jaffa", "Haïfa", "Rishon LeZion", "Petah Tikva", "Beer-Sheva", "Netanya"] },
  { code: "it", nom: "Italie", villes: ["Rome", "Milan", "Naples", "Turin", "Palerme", "Gênes", "Bologne", "Florence", "Bari", "Catane", "Venise", "Vérone", "Messine", "Padoue", "Trieste", "Brescia", "Parme", "Modène"] },
  { code: "jm", nom: "Jamaïque", villes: ["Kingston", "Montego Bay", "Spanish Town", "Ocho Rios"] },
  { code: "jp", nom: "Japon", villes: ["Tokyo", "Yokohama", "Osaka", "Nagoya", "Sapporo", "Fukuoka", "Kobe", "Kyoto", "Kawasaki", "Saitama", "Hiroshima", "Sendai", "Chiba", "Kitakyushu"] },
  { code: "jo", nom: "Jordanie", villes: ["Amman", "Zarka", "Irbid", "Aqaba", "Madaba", "Salt"] },
  { code: "kz", nom: "Kazakhstan", villes: ["Almaty", "Astana", "Chimkent", "Karaganda", "Aktioube", "Pavlodar"] },
  { code: "ke", nom: "Kenya", villes: ["Nairobi", "Mombasa", "Nakuru", "Kisumu", "Eldoret", "Malindi", "Kitale", "Garissa", "Thika", "Nyeri", "Machakos", "Kakamega", "Naivasha"] },
  { code: "kg", nom: "Kirghizistan", villes: ["Bichkek", "Och", "Djalal-Abad", "Karakol"] },
  { code: "ki", nom: "Kiribati", villes: ["Tarawa-Sud", "Betio"] },
  { code: "kw", nom: "Koweït", villes: ["Koweït", "Al Jahra", "Hawalli", "Salmiya"] },
  { code: "la", nom: "Laos", villes: ["Vientiane", "Savannakhet", "Pakse", "Luang Prabang", "Thakhek"] },
  { code: "ls", nom: "Lesotho", villes: ["Maseru", "Teyateyaneng", "Mafeteng", "Leribe"] },
  { code: "lv", nom: "Lettonie", villes: ["Riga", "Daugavpils", "Liepāja", "Jelgava"] },
  { code: "lb", nom: "Liban", villes: ["Beyrouth", "Tripoli", "Saïda", "Tyr", "Zahlé", "Jounieh"] },
  { code: "lr", nom: "Liberia", villes: ["Monrovia", "Gbarnga", "Kakata", "Bensonville", "Harper", "Voinjama", "Buchanan"] },
  { code: "ly", nom: "Libye", villes: ["Tripoli", "Benghazi", "Misrata", "Syrte", "Sabha", "Zawiya", "Al-Bayda"] },
  { code: "li", nom: "Liechtenstein", villes: ["Vaduz", "Schaan", "Balzers"] },
  { code: "lt", nom: "Lituanie", villes: ["Vilnius", "Kaunas", "Klaipėda", "Šiauliai", "Panevėžys"] },
  { code: "lu", nom: "Luxembourg", villes: ["Luxembourg", "Esch-sur-Alzette", "Differdange", "Dudelange", "Ettelbruck"] },
  { code: "mk", nom: "Macédoine du Nord", villes: ["Skopje", "Bitola", "Kumanovo", "Prilep"] },
  { code: "mg", nom: "Madagascar", villes: ["Antananarivo", "Toamasina", "Antsirabe", "Fianarantsoa", "Mahajanga", "Toliara", "Antsiranana", "Nosy Be", "Sambava", "Ambatondrazaka"] },
  { code: "my", nom: "Malaisie", villes: ["Kuala Lumpur", "George Town", "Johor Bahru", "Ipoh", "Malacca", "Alor Setar", "Kota Kinabalu", "Kuching"] },
  { code: "mw", nom: "Malawi", villes: ["Lilongwe", "Blantyre", "Mzuzu", "Zomba", "Karonga"] },
  { code: "mv", nom: "Maldives", villes: ["Malé", "Hithadhoo", "Fuvahmulah"] },
  { code: "ml", nom: "Mali", villes: ["Bamako", "Sikasso", "Ségou", "Mopti", "Kayes", "Gao", "Koutiala", "Niono", "Markala", "Kati", "San", "Djenné", "Tombouctou"] },
  { code: "mt", nom: "Malte", villes: ["La Valette", "Birkirkara", "Sliema", "Saint Julian's", "Mosta"] },
  { code: "ma", nom: "Maroc", villes: ["Casablanca", "Rabat", "Marrakech", "Fès", "Tanger", "Agadir", "Meknès", "Oujda", "Kénitra", "Tétouan", "Salé", "Safi", "El Jadida", "Nador", "Béni Mellal", "Mohammedia", "Laâyoune", "Essaouira", "Berkane"] },
  { code: "mu", nom: "Maurice", villes: ["Port-Louis", "Vacoas", "Curepipe", "Quatre Bornes", "Rose Hill", "Mahébourg"] },
  { code: "mr", nom: "Mauritanie", villes: ["Nouakchott", "Nouadhibou", "Kiffa", "Rosso", "Kaédi", "Boghé", "Néma", "Aioun el Atrouss", "Atar", "Zouérat", "Sélibabi"] },
  { code: "mx", nom: "Mexique", villes: ["Mexico", "Guadalajara", "Monterrey", "Puebla", "Tijuana", "Ciudad Juárez", "Cancún", "Mérida", "León", "Querétaro", "Toluca", "Tuxtla Gutiérrez"] },
  { code: "fm", nom: "Micronésie", villes: ["Palikir", "Kolonia", "Weno"] },
  { code: "md", nom: "Moldavie", villes: ["Chisinau", "Bălți", "Tiraspol", "Tighina (Bender)"] },
  { code: "mc", nom: "Monaco", villes: ["Monaco", "Monte-Carlo", "La Condamine"] },
  { code: "mn", nom: "Mongolie", villes: ["Oulan-Bator", "Erdenet", "Darhan", "Choibalsan"] },
  { code: "me", nom: "Monténégro", villes: ["Podgorica", "Nikšić", "Pljevlja", "Budva", "Kotor"] },
  { code: "mz", nom: "Mozambique", villes: ["Maputo", "Matola", "Beira", "Nampula", "Quelimane", "Tete", "Chimoio", "Pemba", "Xai-Xai"] },
  { code: "na", nom: "Namibie", villes: ["Windhoek", "Walvis Bay", "Swakopmund", "Oshakati", "Rundu", "Rehoboth"] },
  { code: "nr", nom: "Nauru", villes: ["Yaren", "Denigomodu"] },
  { code: "np", nom: "Népal", villes: ["Katmandou", "Pokhara", "Lalitpur", "Biratnagar", "Bhaktapur"] },
  { code: "ni", nom: "Nicaragua", villes: ["Managua", "León", "Granada", "Masaya", "Estelí"] },
  { code: "ne", nom: "Niger", villes: ["Niamey", "Zinder", "Maradi", "Tahoua", "Agadez", "Dosso", "Diffa", "Gaya", "Birni-N'Konni", "Tessaoua", "Tillabéri", "Arlit", "Dogondoutchi", "Maine-Soroa"] },
  { code: "ng", nom: "Nigeria", villes: ["Lagos", "Abuja", "Kano", "Ibadan", "Port Harcourt", "Benin City", "Kaduna", "Enugu", "Abeokuta", "Onitsha", "Warri", "Jos", "Ilorin", "Calabar", "Uyo", "Aba", "Ogbomoso", "Osogbo", "Ikorodu", "Maiduguri", "Sokoto", "Zaria", "Katsina", "Akure", "Bauchi", "Makurdi", "Yenagoa", "Lokoja", "Minna", "Owerri", "Abakaliki"] },
  { code: "no", nom: "Norvège", villes: ["Oslo", "Bergen", "Trondheim", "Stavanger", "Drammen", "Tromsø"] },
  { code: "nz", nom: "Nouvelle-Zélande", villes: ["Auckland", "Wellington", "Christchurch", "Hamilton", "Tauranga", "Dunedin", "Rotorua"] },
  { code: "om", nom: "Oman", villes: ["Mascate", "Salalah", "Sohar", "Nizwa", "Sur"] },
  { code: "ug", nom: "Ouganda", villes: ["Kampala", "Entebbe", "Gulu", "Lira", "Jinja", "Mbarara", "Masaka", "Mbale", "Arua", "Fort Portal"] },
  { code: "uz", nom: "Ouzbékistan", villes: ["Tachkent", "Samarcande", "Boukhara", "Namangan", "Andijan", "Fergana", "Nukus"] },
  { code: "pk", nom: "Pakistan", villes: ["Karachi", "Lahore", "Faisalabad", "Rawalpindi", "Islamabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala"] },
  { code: "pw", nom: "Palaos", villes: ["Ngerulmud", "Koror", "Airai"] },
  { code: "ps", nom: "Palestine", villes: ["Ramallah", "Gaza", "Jérusalem-Est", "Hébron", "Naplouse", "Bethléem", "Tulkarem", "Qalqilya"] },
  { code: "pa", nom: "Panama", villes: ["Panama", "San Miguelito", "Colón", "David", "Arraiján"] },
  { code: "pg", nom: "Papouasie-Nouvelle-Guinée", villes: ["Port Moresby", "Lae", "Mount Hagen", "Madang"] },
  { code: "py", nom: "Paraguay", villes: ["Asuncion", "Ciudad del Este", "San Lorenzo", "Luque", "Encarnación"] },
  { code: "nl", nom: "Pays-Bas", villes: ["Amsterdam", "Rotterdam", "La Haye", "Utrecht", "Eindhoven", "Groningue", "Tilbourg", "Almere", "Bréda", "Nimègue"] },
  { code: "pe", nom: "Pérou", villes: ["Lima", "Arequipa", "Trujillo", "Chiclayo", "Piura", "Cusco", "Iquitos", "Huancayo", "Tacna"] },
  { code: "ph", nom: "Philippines", villes: ["Manille", "Quezon City", "Davao", "Cebu", "Zamboanga", "Cagayan de Oro", "Iloilo", "Bacolod", "Antipolo"] },
  { code: "pl", nom: "Pologne", villes: ["Varsovie", "Cracovie", "Łódź", "Wrocław", "Poznań", "Gdańsk", "Szczecin", "Lublin", "Katowice", "Białystok"] },
  { code: "pt", nom: "Portugal", villes: ["Lisbonne", "Porto", "Braga", "Coimbra", "Amadora", "Funchal", "Setúbal", "Aveiro", "Faro"] },
  { code: "qa", nom: "Qatar", villes: ["Doha", "Al Rayyan", "Al Wakrah", "Umm Salal"] },
  { code: "cf", nom: "République centrafricaine", villes: ["Bangui", "Bimbo", "Bambari", "Bouar", "Bossangoa", "Carnot", "Berbérati"] },
  { code: "do", nom: "République dominicaine", villes: ["Saint-Domingue", "Santiago de los Caballeros", "Punta Cana", "La Romana", "San Pedro de Macorís", "San Cristóbal"] },
  { code: "cz", nom: "République tchèque", villes: ["Prague", "Brno", "Ostrava", "Plzeň", "Liberec", "Olomouc"] },
  { code: "ro", nom: "Roumanie", villes: ["Bucarest", "Cluj-Napoca", "Timișoara", "Iași", "Constanța", "Craiova", "Brașov", "Galați", "Ploiești"] },
  { code: "gb", nom: "Royaume-Uni", villes: ["Londres", "Birmingham", "Manchester", "Liverpool", "Leeds", "Sheffield", "Bristol", "Glasgow", "Édimbourg", "Cardiff", "Belfast", "Newcastle upon Tyne", "Nottingham", "Leicester", "Coventry", "Brighton"] },
  { code: "ru", nom: "Russie", villes: ["Moscou", "Saint-Pétersbourg", "Novossibirsk", "Iekaterinbourg", "Kazan", "Nijni Novgorod", "Samara", "Omsk", "Tcheliabinsk", "Rostov-sur-le-Don", "Sotchi", "Vladivostok", "Krasnoïarsk", "Volgograd"] },
  { code: "rw", nom: "Rwanda", villes: ["Kigali", "Butare (Huye)", "Gitarama (Muhanga)", "Ruhengeri (Musanze)", "Gisenyi (Rubavu)", "Nyamata", "Kibungo"] },
  { code: "kn", nom: "Saint-Kitts-et-Nevis", villes: ["Basseterre", "Charlestown"] },
  { code: "sm", nom: "Saint-Marin", villes: ["Saint-Marin", "Serravalle"] },
  { code: "vc", nom: "Saint-Vincent-et-les-Grenadines", villes: ["Kingstown", "Barrouallie"] },
  { code: "lc", nom: "Sainte-Lucie", villes: ["Castries", "Vieux Fort", "Soufrière"] },
  { code: "sv", nom: "Salvador", villes: ["San Salvador", "Santa Ana", "San Miguel", "Soyapango"] },
  { code: "ws", nom: "Samoa", villes: ["Apia", "Vaitele", "Faleula"] },
  { code: "st", nom: "São Tomé-et-Principe", villes: ["São Tomé", "Santo António", "Trindade"] },
  { code: "sn", nom: "Sénégal", villes: ["Dakar", "Thiès", "Touba", "Saint-Louis", "Ziguinchor", "Kaolack", "Mbour", "Mbacké", "Rufisque", "Louga", "Diourbel", "Tambacounda", "Kaffrine", "Kédougou", "Matam", "Sédhiou", "Fatick", "Guédiawaye", "Pikine", "Diamniadio"] },
  { code: "rs", nom: "Serbie", villes: ["Belgrade", "Novi Sad", "Niš", "Kragujevac", "Subotica"] },
  { code: "sc", nom: "Seychelles", villes: ["Victoria", "Anse Boileau", "Beau Vallon", "Takamaka"] },
  { code: "sl", nom: "Sierra Leone", villes: ["Freetown", "Bo", "Kenema", "Makeni", "Koidu", "Lunsar", "Waterloo", "Kabala", "Magburaka"] },
  { code: "sg", nom: "Singapour", villes: ["Singapour"] },
  { code: "sk", nom: "Slovaquie", villes: ["Bratislava", "Košice", "Prešov", "Žilina", "Nitra"] },
  { code: "si", nom: "Slovénie", villes: ["Ljubljana", "Maribor", "Celje", "Kranj"] },
  { code: "so", nom: "Somalie", villes: ["Mogadiscio", "Hargeisa", "Berbera", "Bosaso", "Kismayo", "Baidoa", "Garowe"] },
  { code: "sd", nom: "Soudan", villes: ["Khartoum", "Omdourman", "Port-Soudan", "Kassala", "Al-Fashir", "Nyala", "Wad Madani", "Kosti"] },
  { code: "ss", nom: "Soudan du Sud", villes: ["Djouba", "Wau", "Malakal", "Bentiu", "Yei", "Bor"] },
  { code: "lk", nom: "Sri Lanka", villes: ["Colombo", "Kandy", "Galle", "Jaffna", "Negombo", "Trincomalee", "Matara"] },
  { code: "se", nom: "Suède", villes: ["Stockholm", "Göteborg", "Malmö", "Uppsala", "Linköping", "Västerås", "Örebro"] },
  { code: "ch", nom: "Suisse", villes: ["Zurich", "Genève", "Bâle", "Lausanne", "Berne", "Winterthour", "Lucerne", "Saint-Gall", "Lugano", "Fribourg", "Neuchâtel", "La Chaux-de-Fonds"] },
  { code: "sr", nom: "Suriname", villes: ["Paramaribo", "Lelydorp", "Nieuw Nickerie"] },
  { code: "sy", nom: "Syrie", villes: ["Damas", "Alep", "Homs", "Lattaquié", "Hama", "Deir ez-Zor"] },
  { code: "tj", nom: "Tadjikistan", villes: ["Douchanbé", "Khodjent", "Koulab", "Bokhtar"] },
  { code: "tz", nom: "Tanzanie", villes: ["Dodoma", "Dar es Salaam", "Mwanza", "Arusha", "Mbeya", "Morogoro", "Tanga", "Zanzibar", "Moshi", "Tabora", "Kigoma"] },
  { code: "td", nom: "Tchad", villes: ["N'Djamena", "Moundou", "Sarh", "Abéché", "Kélo", "Koumra", "Pala"] },
  { code: "th", nom: "Thaïlande", villes: ["Bangkok", "Chiang Mai", "Pattaya", "Phuket", "Hat Yai", "Nakhon Ratchasima", "Khon Kaen", "Udon Thani"] },
  { code: "tl", nom: "Timor oriental", villes: ["Dili", "Baucau", "Maliana", "Suai"] },
  { code: "tg", nom: "Togo", villes: ["Lomé", "Sokodé", "Kara", "Atakpamé", "Kpalimé", "Bassar", "Tsévié", "Aného", "Niamtougou", "Bafilo", "Badou", "Sotouboua", "Cinkassé", "Mango", "Dapaong", "Vogan", "Tabligbo", "Notsé", "Amlamé", "Kandé", "Pagouda", "Guérin-Kouka", "Blitta", "Anié", "Tchamba"] },
  { code: "to", nom: "Tonga", villes: ["Nukuʻalofa", "Neiafu", "Haveluloto"] },
  { code: "tt", nom: "Trinité-et-Tobago", villes: ["Port-d'Espagne", "San Fernando", "Chaguanas", "Arima"] },
  { code: "tn", nom: "Tunisie", villes: ["Tunis", "Sfax", "Sousse", "Kairouan", "Bizerte", "Gabès", "Ariana", "Monastir", "Nabeul", "Djerba", "Gafsa", "La Marsa", "Hammamet", "Tozeur"] },
  { code: "tm", nom: "Turkménistan", villes: ["Achgabat", "Turkménabat", "Daşoguz", "Mary"] },
  { code: "tr", nom: "Turquie", villes: ["Istanbul", "Ankara", "Izmir", "Bursa", "Antalya", "Adana", "Konya", "Gaziantep", "Mersin", "Kayseri", "Eskişehir"] },
  { code: "tv", nom: "Tuvalu", villes: ["Funafuti", "Vaiaku"] },
  { code: "ua", nom: "Ukraine", villes: ["Kyiv", "Kharkiv", "Odessa", "Dnipro", "Donetsk", "Lviv", "Zaporijjia", "Vinnytsia", "Poltava", "Tchernivtsi"] },
  { code: "uy", nom: "Uruguay", villes: ["Montevideo", "Salto", "Paysandú", "Punta del Este", "Maldonado"] },
  { code: "vu", nom: "Vanuatu", villes: ["Port-Vila", "Luganville", "Norsup"] },
  { code: "va", nom: "Vatican", villes: ["Cité du Vatican"] },
  { code: "ve", nom: "Venezuela", villes: ["Caracas", "Maracaibo", "Valencia", "Barquisimeto", "Maracay", "Ciudad Guayana", "San Cristóbal", "Maturín"] },
  { code: "vn", nom: "Vietnam", villes: ["Hanoï", "Ho Chi Minh-Ville", "Da Nang", "Hué", "Haiphong", "Can Tho", "Nha Trang", "Da Lat"] },
  { code: "ye", nom: "Yémen", villes: ["Sanaa", "Aden", "Taëz", "Hodeïda", "Mukalla", "Ibb"] },
  { code: "zm", nom: "Zambie", villes: ["Lusaka", "Kitwe", "Ndola", "Livingstone", "Kabwe", "Chipata", "Chingola"] },
  { code: "zw", nom: "Zimbabwe", villes: ["Harare", "Bulawayo", "Chitungwiza", "Mutare", "Gweru", "Kwekwe", "Masvingo"] },
];

/** URL du drapeau d'un pays (flagcdn — CDN public, PNG ~100-800 o). */
export function flagUrl(code: string, width: 40 | 80 = 40): string {
  return `https://flagcdn.com/w${width}/${code}.png`;
}

/** Recherche insensible aux accents/casse (pays et villes). */
export function normaliser(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/** Villes du pays sélectionné (triées telles quelles — la liste est
 *  déjà ordonnée de la plus grande à la plus petite pour les pays
 *  cibles ; sinon ordre alphabétique du fichier). */
export function villesDe(paysNom: string): string[] {
  return PAYS_VILLES.find((p) => p.nom === paysNom)?.villes ?? [];
}

