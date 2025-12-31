// بيانات الولايات والبلديات المنقحة
const statesList = [
    "Adrar", "Chlef", "Laghouat", "Oum El Bouaghi", "Batna", "Bejaia", "Biskra", "Bechar", 
    "Blida", "Bouira", "Tamanrasset", "Tebessa", "Tlemcen", "Tiaret", "Tizi Ouzou", "Alger", 
    "Djelfa", "Jijel", "Setif", "Saida", "Skikda", "Sidi Bel Abbes", "Guelma", "Constantine", 
    "Medea", "Mostaganem", "M'Sila", "Mascara", "Ouargla", "Oran", "El Bayadh", "Illizi", 
    "Bordj Bou Arreridj", "Boumerdes", "El Tarf", "Tindouf", "Tissemsilt", "El Oued", 
    "Khenchela", "Souk Ahras", "Tipaza", "Mila", "Ain Defla", "Naama", "Ain Temouchent", 
    "Ghardaia", "Relizane", "Timimoun", "Bordj Badji Mokhtar", "Ouled Djellal", "Beni Abbes", 
    "In Salah", "In Guezzam", "Touggourt", "Djanet", "El M'Ghair", "El Meniaa"
];

const communesData = {
    "Adrar": ["Adrar", "Tamest", "Charouine", "Reggane", "In Zghmir", "Tit", "Tsabit", "Timimoun", "Ouled Said", "Zaouiet Kounta", "Aoulef", "Timokten", "Tamentit", "Fenoughil", "Tinerkouk", "Deldoul", "Sali", "Akabli", "Metarfa", "Ouled Ahmed Timmi", "Bouda", "Aougrout", "Talmine", "Bordj Badji Mokhtar", "Sbaa", "Ouled Aissa", "Ksar Kaddour"],
    "Chlef": ["Chlef", "Tenes", "Benairia", "El Karimia", "Tadjena", "Taougrite", "Beni Haoua", "Sobha", "Harchoun", "Ouled Fares", "Sidi Akkacha", "Boukadir", "Beni Rached", "Talassa", "Heraren", "Oued Goussine", "Dahra", "Ouled Abbes", "Sendjas", "Sidi Abderrahmane", "Oued Fodda", "Ouled Ben Abdelkader", "Bouzghaia", "Ain Merane", "Oum Drou", "Breira", "Moussadek", "El Hadjadj", "Labiod Medjadja", "Oued Sly", "Medjadja"],
    "Laghouat": ["Laghouat", "Ksar El Hirane", "Bennasser Benchohra", "Sidi Makhlouf", "Hassi Delaa", "Hassi R'mel", "Ain Madhi", "Tadjemout", "Kheneg", "Gueltat Sidi Saad", "Ain Sidi Ali", "Beidha", "Brida", "El Ghicha", "Hadj Mechri", "Sebgag", "Taouiala", "Tadjrouna", "Aflou", "Oued Morra", "Oued M'zi", "El Assafia", "Sidi Bouzid"],
    "Oum El Bouaghi": ["Oum El Bouaghi", "Ain Beida", "Ain M'lila", "Behir Chergui", "El Amiria", "Sigus", "El Belala", "Ain Babouche", "Berriche", "Ouled Hamla", "Dhalaa", "Ain Kercha", "Hanchir Toumgani", "Fkirina", "Oued Nini", "Meskiana", "Dhir", "Ain Fekroun", "Rahia", "Ain Zitoun", "Ouled Gacem", "Ouled Zouai", "Souk Naamane", "Zorg"],
    "Batna": ["Batna", "Ghassira", "Maafa", "Menaa", "Seriana", "Tighghar", "Ain Yagout", "Amdoukal", "N'gaous", "Sefiane", "Boulhilat", "Chemora", "Echrana", "Oued El Ma", "Oued Taga", "Arris", "Kimmel", "Tighanimine", "Larbaa", "Bouzina", "Fesdis", "Oued Chaaba", "Taxlent", "Gosbat", "Guigba", "Teniet El Abed", "Hidoussa", "Rahbat", "Barika", "Bitam", "Metkaouak", "M'douhal", "Azil Abdeldjebar", "Kimel", "N'douhal", "Ras El Aioun", "Oulad Si Slimane", "Lemcen", "Talkhamt", "Bouchetagne", "Lemsane", "Ksar Bellezma", "Ouldja", "Tilatou"],
    "Bejaia": ["Bejaia", "Amizour", "Feraoun", "Taourirt Ighil", "Chellata", "Tamokra", "Timzrit", "Souk El Tenine", "Melbou", "Oued Ghir", "Tala Hamza", "Barbacha", "Beni Djellil", "Beni Maouche", "Sidi Ayad", "Smaoun", "Kendira", "Tifra", "Sidi Aich", "Leflaye", "Akbou", "Ouzellaguen", "Ighram", "Chemini", "Souamar", "Toudja", "Kherrata", "Draa El Kaid", "Beni Ksila", "Beni Mallikeche", "Boudjellil", "Adekar", "Akfadou", "Tinebdar", "El Kseur", "Fenaia Ilmaten"],
    "Biskra": ["Biskra", "Oumache", "Branis", "Chetma", "Ouled Djellal", "Ras El Miaad", "Besbes", "Sidi Khaled", "Doucen", "Ech Chaiba", "Sidi Okba", "M'chouneche", "El Haouch", "Ain Naga", "Zeribet El Oued", "El Feidh", "El Kantara", "Djemorah", "Foughala", "El Ghrous", "M'lili", "Tolga", "Lichana", "Bouchagroune", "Mekhadma", "Khouled"],
    "Bechar": ["Bechar", "Abadla", "Taghit", "El Ouata", "Beni Abbes", "Kerzaz", "Igli", "Tabelbala", "Ouled Khoudir", "Lahmar", "Mougheul", "Kenadsa", "Meridja", "Timoudi", "Beni Ikhlef", "Ksabi", "Mechraa Houari Boumediene", "Beni Ounif"],
    "Blida": ["Blida", "Chebli", "Bouinan", "Oued El Alleug", "Ouled Yaich", "Chrea", "El Affroun", "Mouzaia", "Hammam Melouane", "Bougara", "Souhane", "Larbaa", "Soumaa", "Guerrouaou", "Boufarik", "Meftah", "Benkhelil", "Beni Mered", "Ouled Slama", "Sidi Moussa"],
    "Bouira": ["Bouira", "El Asnam", "Guerrouma", "Souk El Khemis", "Kadiria", "Hanif", "Dirah", "Ait Laaziz", "Taghzout", "Raouraoua", "Mezdour", "Haizer", "Lakhdaria", "Maala", "El Hachimia", "Sour El Ghozlane", "Maamora", "Dechmia", "Ridane", "Bechloul", "Bouderbala", "Aghbalou", "Ain Turk", "Saharidj", "El Adjiba", "Ahl El Ksar", "Boukram", "Zbarbar", "Ain El Hadjar", "Taguedit", "Ath Mansour"],
    "Tamanrasset": ["Tamanrasset", "Abalessa", "In Ghar", "In Salah", "Idles", "Tazrouk", "In Amguel", "Foggaret Ezzaouia", "In Guezzam", "Tin Zaouatine"],
    "Tebessa": ["Tebessa", "Bir El Ater", "Cheria", "Stah Guentis", "El Hammamet", "Safsaf El Ouesra", "Bedjene", "Ouenza", "El Meridj", "Ain Zerga", "Morsott", "Bir Dheb", "El Ogla", "Bir Mokkadem", "Guorriguer", "Bekkaria", "Boukhadra", "El Kouif", "M'douhal", "Negrine", "Ferkane", "El Mezeraa", "Boulhaf Dir"],
    "Tlemcen": ["Tlemcen", "Beni Mester", "Ain Tallout", "Remchi", "El Feuilla", "Sabra", "Ghazaouet", "Souani", "Djebala", "El Aricha", "Beni Snous", "Bensekrane", "Fellaoucene", "Azails", "Maghnia", "Hammam Boughrara", "Zenata", "Souahlia", "Nedroma", "Sidi Djillali", "Beni Bahdel", "Beni Ouarsous", "Honaine", "Sidi Medjahed", "Amieur", "Ain Fezza", "Hennaya", "Chetouane", "Mansourah", "Beni Khellad", "Souk Thleta", "Terny Beni Hediel"],
    "Tiaret": ["Tiaret", "Medroussa", "Oued Lilli", "Sidi Hosni", "Ain El Hadid", "Mechraa Safa", "Hamadia", "Bougara", "Rechaiga", "Tidda", "Naima", "Meghila", "Guertoufa", "Sidi Bakhti", "Sidi Ali Mellal", "Ain Deheb", "Chehaima", "Sidi Abderrahmane", "Zmalet El Emir Abdelkader", "Madna", "Ksar Chellala", "Serghine", "Mahdia", "Ain Zarit", "Sebaine", "Faidja", "Si Abdelghani", "Sougueur", "Tousnina", "Dahmouni", "Rahouia"],
    "Tizi Ouzou": ["Tizi Ouzou", "Ain El Hammam", "Akbil", "Abi Youcef", "Ait Yahia", "Iferhounene", "Bouzeguene", "Azazga", "Illoula Oumalou", "Yakouren", "Larbaa Nath Irathen", "Tizi Rached", "Irdjen", "Azeffoun", "Iflissen", "Tigzirt", "Ait Aissa Mimoun", "Ouaguenoun", "Timizart", "Maatkas", "Souk El Tenine", "Draa Ben Khedda", "Tizi Gheniff", "Ait Yahia Moussa", "Draa El Mizan", "Frikat", "Ait Kouffi", "Mekla", "Ait Khellili", "Souamaa", "Beni Yenni", "Iboudraren", "Ouacif", "Ait Toudert", "Ait Boumahdi", "Beni Douala", "Beni Aissa", "Beni Zmenzer", "Idjeur", "Ait Aggouacha", "Imsouhal", "Ait Oumalou", "Ait Bouaddou", "Illilten", "Zekri", "Mizrana", "Tizi N'Tleta"],
    "Alger": ["Alger Centre", "Madania", "Belouizdad", "Bab El Oued", "Bologhine", "Casbah", "Oued Koriche", "Bir Mourad Rais", "Birmandreis", "Hydra", "El Biar", "Bouzareah", "Ben Aknoun", "El Mouradia", "Beni Messous", "Kouba", "Bachidjerrah", "El Harrach", "Bourouba", "Mahelma", "Sidi Abdellah", "Zeralda", "Staoueli", "Ain Benian", "Hammamet", "Cheraga", "Ouled Fayet", "Dely Ibrahim", "Draria", "Saoula", "Baba Hassen", "Douera", "Khraicia", "Birtouta", "Tessala El Merdja", "Ouled Chebel", "Sidi Moussa", "Ain Taya", "Bordj El Kiffan", "Marsa", "Bab Ezzouar", "Reghaia", "Rouiba", "Herraoua", "Baraki", "Eucalyptus", "Sidi M'hamed", "Bordj El Bahri", "El Magharia", "Hussein Dey", "Mohammadia", "Oued Smar"],
    "Djelfa": ["Djelfa", "Moudjebara", "El Khedid", "Hassi Bahbah", "Ain Maabed", "Sed Rahal", "Feidh El Botma", "Birine", "Bouira Lahdab", "Ain Fekka", "Sidi Baizid", "M'liliha", "Dar Chioukh", "Taadmit", "Had Sahary", "Guernini", "Selmana", "Sidi Ladjel", "Hassi Fedoul", "El Kherba", "Benhar", "Ain El Ibel", "Zakkar", "Douis", "Ain Chouhada", "Messaad", "Guattara", "Deldoul", "Amourah", "Charef", "Benyagoub"],
    "Jijel": ["Jijel", "Erraguene", "El Aouana", "Ziama Mansouriah", "Taher", "Emir Abdelkader", "Chekfa", "Chahna", "El Kennar Nouchfi", "Sidi Abdelaziz", "El Ancer", "Boucif Ouled Askeur", "Djemaa Beni Habibi", "Bouraoui Belhadef", "El Milia", "Settara", "Sidi Maarouf", "Ouled Yahia Khadrouch", "Ouled Rabah", "Boussiaba", "Ghebala", "Boudriaa Ben Yadjis", "Djimla", "Kaous", "Texenna", "Ouadjana"],
    "Setif": ["Setif", "Ain Abessa", "Ain Arnat", "Ain Azal", "Ain El Kebira", "Ain Lahdjar", "Ain Oulmene", "Ain Roua", "Ain Sebt", "Babor", "Bazer Sakhra", "Beidha Bordj", "Bellaa", "Beni Aziz", "Beni Chebana", "Beni Fouda", "Beni Hocine", "Beni Mouli", "Beni Ouerthilane", "Bir El Arch", "Bir Haddada", "Bouandas", "Bougaa", "Bousselam", "Djemila", "Draa Kebila", "El Eulma", "El Ouldja", "Guellal", "Guelta Zerka", "Guenzet", "Guidjel", "Hamma", "Hammam Guergour", "Hammam Souhna", "Harbil", "Ksar El Abtal", "Maouia", "Malaako", "Mezloug", "Oued El Bared", "Ouled Addouane", "Ouled Sabor", "Ouled Si Ahmed", "Ouled Tebben", "Ouricia", "Salah Bey", "Serdj El Ghoul", "Tachouda", "Tala Ifacene", "Taya", "Tizi N'Bechar", "Dahra"],
    "Saida": ["Saida", "Ain El Hadjar", "Sidi Ahmed", "Moulay Larbi", "Youb", "Hounet", "Sidi Amar", "Sidi Boubekeur", "El Hassasna", "Ain Sekhouna", "Ouled Brahim", "Tircine", "Ouled Khaled", "Maamora", "Sidi Khlifa"],
    "Skikda": ["Skikda", "Ain Zouit", "El Hadaiek", "Bouchtata", "Hamadi Krouma", "Filfila", "Ben Azzouz", "Bekkouche Lakhdar", "Es Sebt", "Ain Kechra", "Oultene", "Harroucha", "Medjez Dchiche", "Salah Bouchaour", "El Ghedir", "Ramdane Djamel", "Bin El Ouidane", "Collo", "Cheraia", "Kerkera", "Ouled Attia", "Oued Zhour", "Zitouna", "El Marsa", "Azzaba", "Djendel Saadi Mohamed", "Ain Cherchar", "Oum Toub", "Sidi Mezghiche", "Tamalous", "Ain Bouziane", "Beni Zid", "Beni Oulbane"],
    "Sidi Bel Abbes": ["Sidi Bel Abbes", "Tessala", "Sidi Brahim", "Mostefa Ben Brahim", "Telagh", "Mezaourou", "Dhaya", "Ain El Berd", "Sidi Ali Benyoub", "Sidi Yacoub", "Sidi Lahcene", "Lamtar", "Sidi Khaled", "Boukhanafis", "Tabia", "Badredine El Mokrani", "Sehala Thaoura", "Tilmouni", "Sidi Hamadouche", "Sidi Chaib", "Makedra", "Ain Thrid", "Sehailia", "Tenira", "Benachiba Chelia", "Zerouala", "Merine", "Oued Taourira", "Teghalimet", "Belarbi", "Sfisef", "Boudjebaa El Bordj", "Ain Adden", "Sidi Daho des Zairs", "Amarnas", "Hassi Zahana", "Hassi Dahou", "Oued Sefioun"],
    "Guelma": ["Guelma", "Nechmaya", "Bouati Mahmoud", "Oued Zenati", "Tamlouka", "Ras El Agba", "Ain Makhlouf", "Ain Larbi", "Ain Sandel", "Bou Hachana", "Medjez Sfa", "Bouchegouf", "Mashroha", "Ain Ben Beida", "Guelaat Bou Sbaa", "Boumahra Ahmed", "Hammam Debagh", "Roknia", "Dahouara", "Hammam N'Bail", "Belkheir", "Beni Mezline", "Medjez Amar", "Houari Boumediene"],
    "Constantine": ["Constantine", "Hamma Bouziane", "Didouche Mourad", "Zighoud Youcef", "Khroub", "Ain Abid", "Ouled Rahmoune", "Ain Smara", "Beni Hamidane", "Ibn Ziad", "Messaoud Boudjeriou"],
    "Medea": ["Medea", "Ouzera", "Tamesguida", "Ouled Hellal", "Sidi Naamane", "Khams Djouamaa", "Derrag", "Chahbounia", "Boughezoul", "El Ouardania", "Hannacha", "Ouled Bouachra", "Sedraya", "Seghouane", "Mezerana", "Ouled Maaref", "Ain Boucif", "Kef Lakhdar", "Sidi Damed", "Souagui", "Ksar El Boukhari", "Moudjbar", "Ouled Antar", "Djouab", "Sidi Zahar", "Sidi Ziane", "El Azizia", "Mghane", "Bir Ben Laabed", "Baata", "Sidi Rebia", "Beni Slimane", "Bouskene", "Ouled Brahim", "Tablat", "El Omaria", "Ouled Deide", "Damiat", "Oum El Djalil", "Aziz", "Saneg", "Tlatet Douair", "Zoubiria", "Si Mahdjoub", "Bouaiche", "Ouedane", "Berrouaghia", "Rebaia", "El Hamdania", "Oued Harbil"],
    "Mostaganem": ["Mostaganem", "Sayada", "Mesra", "Bouguirat", "Sirat", "Ain Sidi Cherif", "Mansourah", "Hassi Maameche", "Mazagran", "Stidia", "Foronaka", "Ain Nouissy", "Hacine", "Sour", "Oued El Kheir", "Sidi Ali", "Ouled Maallah", "Tazgait", "Sidi Lakhdar", "Hadadj", "Abdelmalek Ramdane", "Khadra", "Achaacha", "Ouled Boughalem", "Nekmaria", "Safsaf", "Souaflia"],
    "M'Sila": ["M'Sila", "Maadid", "Hammam Dalaa", "Tarmount", "Ouled Mansour", "Ouanougha", "Ighil Ali", "Sidi Aissa", "Bouti Sayah", "Sidi Hadjeres", "Ain El Hadjel", "Sidi Ameur", "Tamsa", "Ben Srour", "Ouled Madhi", "Zarzour", "Ouled Derradj", "M'tarfa", "Sidi M'hamed", "Maarif", "Chellal", "Ouled Addi Guebala", "Belaiba", "Berhoum", "Dehahna", "Magra", "Baniou", "Ain Khadra", "Mohamed Boudiaf", "Slamat", "Souamaa", "Ain El Melh", "Bir Foda"],
    "Mascara": ["Mascara", "Bou Hanifia", "El Guetna", "El Hachem", "Tizi", "Froha", "Ghriss", "Matemore", "Sidi Boussaid", "Maoussa", "Sidi Kada", "Tighennif", "Sidi Abdeldjebar", "Oued Taria", "Bou Henni", "Mamounia", "Ferraguig", "El Ghomri", "Zahana", "El Gaada", "Oggaz", "Alaimia", "Ras El Ain Amirouche", "Sig", "Chorfa", "Sidi Abdelmoumen", "Mohammadia", "Mocta Douze", "Beniane", "Aouf", "Gharrous", "Ain Fekan", "Ain Fares", "Khalouia", "Hacine"],
    "Ouargla": ["Ouargla", "Ain Beida", "Ngoussa", "Hassi Messaoud", "Rouissat", "Balidat Ameur", "Tebesbest", "Nezla", "Zaouia El Abidia", "Megarine", "Sidi Slimane", "Taibet", "El Allia", "El Hadjira", "Benaceur", "M'naguer"],
    "Oran": ["Oran", "Gdyel", "Bir El Djir", "Hassi Bounif", "Es Senia", "Sidi Chami", "El Kerma", "Arzew", "Sidi Benyebka", "Ain El Bya", "Bethioua", "Marsat El Hadjadj", "Ain El Turk", "Mers El Kebir", "Bousfer", "El Ançor", "Oued Tlelat", "Tafraoui", "Boufatis", "Ben Freha", "Boutlelis", "Ain Kerma", "Misserghin", "Hassi Ben Okba", "Hassi Mefsoukh"],
    "El Bayadh": ["El Bayadh", "Rogassa", "Stitten", "Brezina", "Ghassoul", "Boualem", "El Abiodh Sidi Cheikh", "Arbaouat", "Boussemghoun", "Chellala", "Krakda", "El Kheiter", "Kef El Ahmar", "Bougtoub", "Tousmouline", "Sidi Ameur", "Sidi Slimane", "Sidi Tifour", "Cheguig"],
    "Illizi": ["Illizi", "Djanet", "Debdeb", "Bordj Omar Driss", "Bordj El Haouas", "In Amenas"],
    "Bordj Bou Arreridj": ["Bordj Bou Arreridj", "Ras El Oued", "Bordj Zemoura", "Mansoura", "El M'hir", "Ben Daoud", "El Ach", "Ghilassa", "Taglait", "Bordj Ghedir", "Belimour", "Ouled Brahem", "Bir Kasdali", "Khelil", "Sidi Embarek", "Tixter", "Hamadia", "El Anasser", "Tesmart", "Medjana", "Teniet En Nasr", "Hasnaoua", "Ouled Dahmane", "Yeryas", "El Main", "Djaafra", "Colla"],
    "Boumerdes": ["Boumerdes", "Boudouaou", "Afir", "Bordj Menaiel", "Baghlia", "Sidi Daoud", "Naciria", "Isser", "Zemmouri", "Si Mustapha", "Tidjelabine", "Chabet El Ameur", "Thenia", "Souk El Had", "Ouled Moussa", "Larbatache", "Khemis El Khechna", "Hamadi", "Boudouaou El Bahri", "Taورga", "Ouled Haddadj", "Leghata", "Djinet", "Kharrouba", "Bouzegza Keddara"],
    "El Tarf": ["El Tarf", "Bouhadjar", "Ben M'hidi", "Besbes", "Drean", "El Kala", "Asfour", "Berrihane", "Chebaita Mokhtar", "Chefia", "Chihani", "Ain El Assel", "Bougous", "Echatt", "Oued Zitoun", "Ramloul", "Souarekh", "Zerizer", "Hammam Beni Salah", "Zitouna"],
    "Tindouf": ["Tindouf", "Oum El Assel"],
    "Tissemsilt": ["Tissemsilt", "Khemisti", "Theniet El Had", "Lardjem", "Melaako", "Lazharia", "Beni Chaib", "Beni Lahcene", "Sidi Boutouchent", "Ouled Bessem", "Sidi Lantri", "Sidi Slimane", "Boucaid", "Bordj El Emir Abdelkader", "Layoune", "Ammari", "Maacem", "Bordj Bounaama", "Tamalaht", "Youssoufia"],
    "El Oued": ["El Oued", "Robbah", "Bayadha", "Nakhla", "Guemar", "Ourmas", "Taghzout", "Hamraia", "Reguiba", "Debila", "Hassani Abdelkrim", "Hassi Khalifa", "Magrane", "Sidi Aoun", "Mih Ouansa", "Kouinine", "Sidi Amrane", "Mrara", "Djamaa", "Tenedla", "El M'ghair", "Oum Touyour", "Sidi Khelil", "Still", "Ben Guecha", "Douar El Ma"],
    "Khenchela": ["Khenchela", "Babar", "El Hamma", "Baghai", "El Mahmal", "Ouled Rechache", "Chechar", "Khirane", "Yabous", "Taouzient", "Bouhmama", "Remila", "Kais", "Ensigha", "M'Sara", "Tamza", "Ain Touila"],
    "Souk Ahras": ["Souk Ahras", "Sedrata", "Hanancha", "Machroha", "Ouled Driss", "Sidi Fredj", "Bir Bouhouche", "Safsaf El Ouesra", "Ragouba", "Drea", "Taoura", "Zaarouria", "Ouled Moumen", "Merahna", "Haddada", "Khedara", "M'daourouch", "Tiffech", "Ain Soltane", "Quillen", "Terrag"],
    "Tipaza": ["Tipaza", "Menaceur", "Larhat", "Douaouda", "Bourkika", "Khemisti", "Ahmer El Ain", "Nadhor", "Hadjout", "Sidi Amar", "Sidi Ghiles", "Cherchell", "Damous", "Gouraya", "Sidi Semiane", "Meskelmoun", "Hadjret Ennous", "Sidi Rached", "Attatba", "Chaiba", "Bou Ismail", "Fouka", "Bouharoun", "Aine Tagourait", "Kolea"],
    "Mila": ["Mila", "Oued Endja", "Ahmed Rachedi", "Bouhatem", "Rouached", "Tergou", "Grarem Gouga", "Hamala", "Sidi Khelifa", "Chigara", "Sidi Merouane", "Teleghma", "Oued Seguen", "Oued Athmania", "Ain Mellouk", "Chelghoum Laid", "Tadjenanet", "Benyahia Abderrahmane", "Taya", "Minar Zarza", "Amira Arres", "Ferdjioua", "Derradji Bousselah", "Tibane", "Baala", "Zeghaia"],
    "Ain Defla": ["Ain Defla", "Miliana", "Boumedfaa", "Khemis Miliana", "Hammam Righa", "Sidi Lakhdar", "Ain Benian", "Vesoul Benian", "Hocinia", "Djelida", "Bourached", "Hoceinia", "Djemaa Ouled Cheikh", "El Amra", "Mekhatria", "El Abadia", "Tacheta Zougagha", "Bir Ould Khelifa", "Bordj Emir Khaled", "Tarik Ibn Ziad", "Bathia", "Belaas", "Hassasna", "Djendel", "Main", "Djouab", "El Attaf"],
    "Naama": ["Naama", "Mecheria", "Ain Sefra", "Tiout", "Sfissifa", "Moghrar", "Asla", "Djeniane Bourzeg", "Kasdir", "Makman Ben Amer", "El Biodh"],
    "Ain Temouchent": ["Ain Temouchent", "Sidi Ben Adda", "Maleh", "Chaabet El Ham", "Terga", "El Amria", "Hassi El Ghella", "Ouled Boudjemaa", "Aghlal", "Ain Kihal", "Ain Tolba", "Hammam Bouhadjar", "Chentouf", "Sidi Boumediene", "Oued Berkeche", "Sidi Safi", "Beni Saf", "Emir Abdelkader", "Oulhaca Gheraba", "Sidi Ouriache", "Bouzedjar"],
    "Ghardaia": ["Ghardaia", "El Atteuf", "Bounoura", "Metlili", "Zelfana", "Dhayet Bendhahoua", "Berriane", "Guerrara", "El Meniaa", "Hassi Fehal", "Hassi Gara", "Sebseb"],
    "Relizane": ["Relizane", "Oued Rhiou", "Bendaoud", "Zemmora", "Dar Ben Abdellah", "Djidiouia", "Hamri", "El Guettar", "Sidi M'hamed Benaouda", "Ain El Tarik", "Had Echkalla", "El Matmar", "Sidi Khettab", "Ammi Moussa", "Oued El Djemaa", "Mendes", "Sidi Lazreg", "Ouarizane", "Mazouna", "El Hassi", "Sidi M'hamed Ben Ali", "Beni Zentis", "Medjabaa", "Lahlef", "Souk El Haad"]
};

const deliveryData = {
    'Alger': { home: 400, office: 400 }, 'Tipaza': { home: 600, office: 400 },
    'Boumerdes': { home: 600, office: 400 }, 'Blida': { home: 600, office: 400 },
    'Relizane': { home: 700, office: 400 }, 'Ain Temouchent': { home: 700, office: 400 },
    'Ain Defla': { home: 700, office: 400 }, 'Mila': { home: 700, office: 400 },
    'Souk Ahras': { home: 700, office: 400 }, 'Khenchela': { home: 700, office: 400 },
    'Tissemsilt': { home: 700, office: 400 }, 'El Tarf': { home: 700, office: 400 },
    'Bordj Bou Arreridj': { home: 700, office: 400 }, 'Oran': { home: 700, office: 400 },
    'Mascara': { home: 700, office: 400 }, "M'Sila": { home: 700, office: 400 },
    'Mostaganem': { home: 700, office: 400 }, 'Medea': { home: 700, office: 400 },
    'Constantine': { home: 700, office: 400 }, 'Guelma': { home: 700, office: 400 },
    'Sidi Bel Abbes': { home: 700, office: 400 }, 'Skikda': { home: 700, office: 400 }, 
    'Saida': { home: 700, office: 400 }, 'Setif': { home: 700, office: 400 }, 
    'Jijel': { home: 700, office: 400 }, 'Tizi Ouzou': { home: 700, office: 400 }, 
    'Tiaret': { home: 700, office: 400 }, 'Tlemcen': { home: 700, office: 400 }, 
    'Bouira': { home: 700, office: 400 }, 'Bejaia': { home: 700, office: 400 }, 
    'Batna': { home: 700, office: 400 }, 'Oum El Bouaghi': { home: 700, office: 400 }, 
    'Chlef': { home: 700, office: 400 }, 'Ghardaia': { home: 850, office: 550 }, 
    'El Oued': { home: 850, office: 550 }, 'Ouargla': { home: 850, office: 550 }, 
    'Djelfa': { home: 850, office: 550 }, 'Tebessa': { home: 850, office: 550 }, 
    'Biskra': { home: 850, office: 550 }, 'Laghouat': { home: 850, office: 550 }, 
    'Ouled Djellal': { home: 900, office: 500 }, 'Touggourt': { home: 900, office: 500 }, 
    "El M'Ghair": { home: 900, office: 500 }, 'El Meniaa': { home: 900, office: 500 }, 
    'Timimoun': { home: 1300, office: 850 }, 'Bordj Badji Mokhtar': { home: 1300, office: 850 }, 
    'Beni Abbes': { home: 1300, office: 850 }, 'Naama': { home: 1350, office: 900 }, 
    'El Bayadh': { home: 1350, office: 900 }, 'Bechar': { home: 1350, office: 900 }, 
    'Adrar': { home: 1350, office: 900 }, 'In Salah': { home: 1500, office: 1250 }, 
    'In Guezzam': { home: 1500, office: 1250 }, 'Djanet': { home: 1500, office: 1250 }, 
    'Tindouf': { home: 1550, office: 1300 }, 'Illizi': { home: 1550, office: 1300 }, 
    'Tamanrasset': { home: 1550, office: 1300 }
};

// العناصر البرمجية
const stateInput = document.getElementById('state');
const communeInput = document.getElementById('commune');
const qtyInput = document.getElementById('quantity');
const delInput = document.getElementById('deliveryType');
const couponInput = document.getElementById('couponCode');
const sizeOpts = document.querySelectorAll('.size-option');
let selectedSize = '';

// تعبئة قائمة الولايات عند التحميل
function initStates() {
    if (!stateInput) return;
    stateInput.innerHTML = '<option value="">Select Wilaya</option>';
    statesList.forEach((state, index) => {
        let opt = document.createElement('option');
        opt.value = state;
        opt.textContent = `${index + 1} - ${state}`;
        stateInput.appendChild(opt);
    });
}
initStates();

// الانتقال من البطاقة إلى نموذج الطلب
const productCard = document.getElementById('productCard');
if (productCard) {
    productCard.onclick = () => {
        productCard.style.display = 'none';
        const orderDetails = document.getElementById('orderDetails');
        orderDetails.style.display = 'flex';
        setTimeout(() => orderDetails.style.opacity = '1', 50);
    };
}

// معالجة اختيار المقاس
sizeOpts.forEach(opt => {
    opt.onclick = () => {
        sizeOpts.forEach(s => s.classList.remove('selected'));
        opt.classList.add('selected');
        selectedSize = opt.dataset.size;
    };
});

// تحديث البلديات عند تغيير الولاية
if (stateInput) {
    stateInput.onchange = () => {
        const state = stateInput.value;
        communeInput.innerHTML = '<option value="">Select Commune</option>';
        
        if(communesData[state]) {
            communesData[state].forEach(c => {
                let o = document.createElement('option'); 
                o.value = c; 
                o.textContent = c;
                communeInput.appendChild(o);
            });
        } else if (state !== "") {
            let o = document.createElement('option');
            o.value = "Centre Ville"; o.textContent = "Centre Ville";
            communeInput.appendChild(o);
        }
        calculate();
    };
}

// دالة حساب السعر الإجمالي والشحن
function calculate() {
    const qty = parseInt(qtyInput.value) || 1;
    const state = stateInput.value;
    const type = delInput.value;
    const coupon = couponInput.value.trim().toLowerCase();

    let productPrice = qty * 2700;
    
    // منطق خصم الكمية (الجملة)
    const bulkMsg = document.getElementById('bulkDiscountMsg');
    if(qty >= 2) {
        productPrice -= 500;
        if (bulkMsg) bulkMsg.style.display = 'block';
    } else {
        if (bulkMsg) bulkMsg.style.display = 'none';
    }

    // منطق الكوبون
    const couponMsg = document.getElementById('couponDiscountMsg');
    if(coupon === 'stitchx') {
        productPrice -= 200;
        if (couponMsg) couponMsg.style.display = 'block';
    } else {
        if (couponMsg) couponMsg.style.display = 'none';
    }

    // حساب سعر الشحن
    let delPrice = 0;
    if(state && type && deliveryData[state]) {
        delPrice = deliveryData[state][type];
    }

    const delPriceEl = document.getElementById('delPrice');
    const finalPriceEl = document.getElementById('finalPrice');
    
    if (delPriceEl) delPriceEl.textContent = delPrice;
    if (finalPriceEl) finalPriceEl.textContent = productPrice + delPrice;
}

// ربط أحداث الإدخال بالحساب التلقائي
[qtyInput, delInput, couponInput].forEach(el => {
    if (el) el.oninput = calculate;
});

// تأكيد الطلب والتحقق من الحقول
const confirmBtn = document.getElementById('confirmBtn');
if (confirmBtn) {
    confirmBtn.onclick = () => {
        const name = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const err = document.getElementById('errorMessage');

        if(!selectedSize || !name || !phone || !stateInput.value || !communeInput.value || !delInput.value) {
            if (err) {
                err.textContent = "Please fill all fields!";
                err.style.display = 'block';
            }
            return;
        }

        // إخفاء النموذج وإظهار صفحة النجاح
        document.getElementById('orderDetails').style.display = 'none';
        document.getElementById('successPage').style.display = 'block';
        document.getElementById('displayUserName').textContent = name;
        document.getElementById('displayPhone').textContent = phone;
    };
}
