// YearCard texts. One object per language. Keep keys identical across languages.
window.YC_I18N = {
en: {
  ui: {
    start: "Make my YearCard", time: "12 quick questions · about 60 seconds",
    privacy: "No sign-up. Your answers stay in your browser.",
    next: "Next", back: "Back", skip: "Skip", finish: "See my 2026",
    step: "Question {n} of {t}",
    resultTitle: "Your 2026, recapped", resultSub: "Swipe through your cards, then share them to your story.",
    share: "Share my cards", download: "Download all", copyLink: "Copy link to my recap",
    copied: "Link copied", linkNote: "The link contains your answers, so only send it to people you trust.",
    again: "Start again", friendTitle: "This is {name}'s 2026", friendAnon: "Someone shared their 2026 with you",
    makeYours: "Make your own YearCard", shopTitle: "Want to go deeper?",
    shopText: "The 2026 → 2027 Reflection Workbook: 27 printable pages to close the year properly and plan the next one.",
    shopBtn: "Get the workbook on Etsy", tap: "Tap a card to download it", feed: "Feed post (4:5)",
    shareFail: "Your browser can't share images directly, so the cards were downloaded instead."
  },
  q: {
    name: { q: "First, what should we call you?", ph: "Your first name or nickname" },
    word: { q: "2026 in one word?", ph: "Type a word", chips: ["Growth", "Chaos", "Healing", "Hustle", "Love", "Survival", "Peace", "Change"] },
    mood: { q: "Overall, how was your 2026?", opts: ["Rough", "Meh", "Good", "Great", "Iconic"] },
    focus: { q: "Where did most of your energy go?", hint: "Pick up to 2",
      opts: { work: "Work or study", travel: "Travel", family: "Family", love: "Love", health: "Health & gym", create: "Creating things", party: "Going out", rest: "Rest & me-time" } },
    nums: { q: "Your year in numbers", hint: "A rough guess is fine", places: "New places visited", books: "Books read", people: "New people met", events: "Concerts & events" },
    song: { q: "Song of your year?", ph: "Song or artist" },
    moment: { q: "Your best moment of 2026?", ph: "e.g. Seeing the sea in Lisbon" },
    hard: { q: "Something hard you got through?",
      opts: { breakup: "A breakup", job: "Job stress or change", loss: "Losing someone", health: "A health scare", move: "Moving", exams: "Exams", money: "Money worries", none: "Nothing big, honestly", private: "I'd rather not say" } },
    learned: { q: "One thing 2026 taught you?", ph: "e.g. Rest is productive" },
    win: { q: "Your biggest win?", ph: "e.g. Passed my driving test" },
    era: { q: "Pick your 2027 era", opts: { healing: "Healing era", money: "Money era", main: "Main character era", glow: "Glow-up era", soft: "Soft life era", builder: "Builder era", adventure: "Adventure era", love: "Love era", discipline: "Discipline era" } },
    energy: { q: "Last one: your vibe this year", intro: "Homebody", extro: "Social", plan: "Planner", spont: "Spontaneous" }
  },
  s: {
    cover: "{name}'s 2026", coverAnon: "My 2026", recapped: "recapped", word: "2026 in one word",
    nums: "By the numbers", places: "new places", books: "books", people: "new people", events: "concerts & events",
    song: "On repeat", moment: "Best moment", hard: "I got through", learned: "2026 taught me", win: "Biggest win",
    youwere: "In 2026 I was", era: "Loading next year…", era2: "My 2027 era", mood: "Year rating",
    stars: ["rough", "meh", "good", "great", "iconic"], made: "Make yours", hardDefault: "everything 2026 threw at me"
  },
  a: {
    explorer: { n: "The Explorer", d: "You said yes to new places and new versions of yourself.", t: ["curious", "brave", "restless"] },
    builder: { n: "The Builder", d: "Quietly stacking bricks while everyone else talked about it.", t: ["focused", "consistent", "ambitious"] },
    main: { n: "The Main Character", d: "Every room you walked into had better lighting.", t: ["magnetic", "bold", "fun"] },
    glow: { n: "The Quiet Glow-Up", d: "No announcements. Just a better you, every month.", t: ["disciplined", "calm", "rising"] },
    heart: { n: "The Heart", d: "You made people feel at home, and that's rare.", t: ["loyal", "warm", "there"] },
    soft: { n: "The Soft Life Pro", d: "You protected your peace like it was your job.", t: ["calm", "self-aware", "unbothered"] },
    phoenix: { n: "The Phoenix", d: "2026 tried it. You're still here, and stronger.", t: ["resilient", "honest", "reborn"] },
    wildcard: { n: "The Wildcard", d: "Nobody could predict your year, not even you.", t: ["spontaneous", "creative", "chaotic"] }
  }
},
es: {
  ui: {
    start: "Crear mi YearCard", time: "12 preguntas rápidas · 1 minuto",
    privacy: "Sin registro. Tus respuestas se quedan en tu navegador.",
    next: "Siguiente", back: "Atrás", skip: "Saltar", finish: "Ver mi 2026",
    step: "Pregunta {n} de {t}",
    resultTitle: "Tu 2026, resumido", resultSub: "Pasa tus tarjetas y compártelas en tu historia.",
    share: "Compartir mis tarjetas", download: "Descargar todas", copyLink: "Copiar enlace a mi resumen",
    copied: "Enlace copiado", linkNote: "El enlace contiene tus respuestas: envíalo solo a gente de confianza.",
    again: "Empezar de nuevo", friendTitle: "Este es el 2026 de {name}", friendAnon: "Alguien ha compartido su 2026 contigo",
    makeYours: "Crea tu propia YearCard", shopTitle: "¿Quieres ir más a fondo?",
    shopText: "Cuaderno de reflexión 2026 → 2027: 27 páginas imprimibles para cerrar bien el año y planear el siguiente.",
    shopBtn: "Ver el cuaderno en Etsy", tap: "Toca una tarjeta para descargarla", feed: "Post para el feed (4:5)",
    shareFail: "Tu navegador no puede compartir imágenes directamente, así que se han descargado."
  },
  q: {
    name: { q: "Primero, ¿cómo te llamamos?", ph: "Tu nombre o apodo" },
    word: { q: "¿Tu 2026 en una palabra?", ph: "Escribe una palabra", chips: ["Crecimiento", "Caos", "Sanar", "Currar", "Amor", "Sobrevivir", "Paz", "Cambio"] },
    mood: { q: "En general, ¿qué tal tu 2026?", opts: ["Duro", "Regular", "Bien", "Genial", "Icónico"] },
    focus: { q: "¿En qué se fue la mayor parte de tu energía?", hint: "Elige hasta 2",
      opts: { work: "Trabajo o estudios", travel: "Viajar", family: "Familia", love: "Amor", health: "Salud y gym", create: "Crear cosas", party: "Salir de fiesta", rest: "Descanso y yo" } },
    nums: { q: "Tu año en números", hint: "Un cálculo aproximado vale", places: "Sitios nuevos visitados", books: "Libros leídos", people: "Gente nueva", events: "Conciertos y eventos" },
    song: { q: "¿La canción de tu año?", ph: "Canción o artista" },
    moment: { q: "¿Tu mejor momento de 2026?", ph: "Ej.: Ver el mar en Lisboa" },
    hard: { q: "¿Algo difícil que superaste?",
      opts: { breakup: "Una ruptura", job: "Estrés o cambio de trabajo", loss: "Perder a alguien", health: "Un susto de salud", move: "Una mudanza", exams: "Exámenes", money: "Problemas de dinero", none: "Nada grave, la verdad", private: "Prefiero no decirlo" } },
    learned: { q: "¿Qué te enseñó 2026?", ph: "Ej.: Descansar también es productivo" },
    win: { q: "¿Tu mayor logro?", ph: "Ej.: Aprobé el carnet" },
    era: { q: "Elige tu era 2027", opts: { healing: "Era sanación", money: "Era dinero", main: "Era protagonista", glow: "Era glow-up", soft: "Era vida tranquila", builder: "Era construir", adventure: "Era aventura", love: "Era amor", discipline: "Era disciplina" } },
    energy: { q: "La última: tu vibra este año", intro: "Casero", extro: "Social", plan: "Planificador", spont: "Espontáneo" }
  },
  s: {
    cover: "El 2026 de {name}", coverAnon: "Mi 2026", recapped: "resumido", word: "2026 en una palabra",
    nums: "En números", places: "sitios nuevos", books: "libros", people: "personas nuevas", events: "conciertos y eventos",
    song: "En bucle", moment: "Mejor momento", hard: "Superé", learned: "2026 me enseñó", win: "Mayor logro",
    youwere: "En 2026 fui", era: "Cargando el próximo año…", era2: "Mi era 2027", mood: "Nota del año",
    stars: ["duro", "regular", "bien", "genial", "icónico"], made: "Crea la tuya", hardDefault: "todo lo que me lanzó 2026"
  },
  a: {
    explorer: { n: "El Explorador", d: "Dijiste que sí a sitios nuevos y a nuevas versiones de ti.", t: ["curioso", "valiente", "inquieto"] },
    builder: { n: "El Constructor", d: "Poniendo ladrillos en silencio mientras otros solo hablaban.", t: ["centrado", "constante", "ambicioso"] },
    main: { n: "El Protagonista", d: "Cada sitio al que entrabas tenía mejor luz.", t: ["magnético", "atrevido", "divertido"] },
    glow: { n: "El Glow-Up Silencioso", d: "Sin anuncios. Solo una versión mejor de ti cada mes.", t: ["disciplinado", "tranquilo", "en subida"] },
    heart: { n: "El Corazón", d: "Hiciste que la gente se sintiera en casa, y eso es raro.", t: ["leal", "cálido", "presente"] },
    soft: { n: "Pro de la Vida Tranquila", d: "Protegiste tu paz como si fuera tu trabajo.", t: ["sereno", "consciente", "imperturbable"] },
    phoenix: { n: "El Fénix", d: "2026 lo intentó. Sigues aquí, y más fuerte.", t: ["resiliente", "honesto", "renacido"] },
    wildcard: { n: "El Comodín", d: "Nadie pudo predecir tu año, ni siquiera tú.", t: ["espontáneo", "creativo", "caótico"] }
  }
},
pt: {
  ui: {
    start: "Criar meu YearCard", time: "12 perguntas rápidas · 1 minuto",
    privacy: "Sem cadastro. Suas respostas ficam no seu navegador.",
    next: "Próxima", back: "Voltar", skip: "Pular", finish: "Ver meu 2026",
    step: "Pergunta {n} de {t}",
    resultTitle: "Seu 2026, resumido", resultSub: "Passe pelos seus cards e compartilhe nos stories.",
    share: "Compartilhar meus cards", download: "Baixar todos", copyLink: "Copiar link do meu resumo",
    copied: "Link copiado", linkNote: "O link contém suas respostas, então envie só para quem você confia.",
    again: "Começar de novo", friendTitle: "Esse é o 2026 de {name}", friendAnon: "Alguém compartilhou o 2026 com você",
    makeYours: "Crie o seu YearCard", shopTitle: "Quer ir mais fundo?",
    shopText: "Caderno de reflexão 2026 → 2027: 27 páginas para imprimir, fechar bem o ano e planejar o próximo.",
    shopBtn: "Ver o caderno no Etsy", tap: "Toque num card para baixar", feed: "Post para o feed (4:5)",
    shareFail: "Seu navegador não compartilha imagens direto, então os cards foram baixados."
  },
  q: {
    name: { q: "Primeiro, como a gente te chama?", ph: "Seu nome ou apelido" },
    word: { q: "Seu 2026 em uma palavra?", ph: "Digite uma palavra", chips: ["Crescimento", "Caos", "Cura", "Corre", "Amor", "Sobrevivência", "Paz", "Mudança"] },
    mood: { q: "No geral, como foi seu 2026?", opts: ["Difícil", "Mais ou menos", "Bom", "Ótimo", "Icônico"] },
    focus: { q: "Para onde foi a maior parte da sua energia?", hint: "Escolha até 2",
      opts: { work: "Trabalho ou estudo", travel: "Viagens", family: "Família", love: "Amor", health: "Saúde e academia", create: "Criar coisas", party: "Sair e festas", rest: "Descanso e eu" } },
    nums: { q: "Seu ano em números", hint: "Um chute aproximado serve", places: "Lugares novos", books: "Livros lidos", people: "Pessoas novas", events: "Shows e eventos" },
    song: { q: "A música do seu ano?", ph: "Música ou artista" },
    moment: { q: "Seu melhor momento de 2026?", ph: "Ex.: Ver o mar em Lisboa" },
    hard: { q: "Algo difícil que você superou?",
      opts: { breakup: "Um término", job: "Estresse ou troca de emprego", loss: "Perder alguém", health: "Um susto de saúde", move: "Uma mudança de casa", exams: "Provas", money: "Aperto financeiro", none: "Nada grave, sério", private: "Prefiro não dizer" } },
    learned: { q: "O que 2026 te ensinou?", ph: "Ex.: Descansar também é produtivo" },
    win: { q: "Sua maior conquista?", ph: "Ex.: Passei na autoescola" },
    era: { q: "Escolha sua era 2027", opts: { healing: "Era da cura", money: "Era do dinheiro", main: "Era protagonista", glow: "Era glow-up", soft: "Era vida leve", builder: "Era de construir", adventure: "Era aventura", love: "Era do amor", discipline: "Era da disciplina" } },
    energy: { q: "Última: sua vibe este ano", intro: "Caseiro", extro: "Social", plan: "Planejador", spont: "Espontâneo" }
  },
  s: {
    cover: "O 2026 de {name}", coverAnon: "Meu 2026", recapped: "resumido", word: "2026 em uma palavra",
    nums: "Em números", places: "lugares novos", books: "livros", people: "pessoas novas", events: "shows e eventos",
    song: "No repeat", moment: "Melhor momento", hard: "Eu superei", learned: "2026 me ensinou", win: "Maior conquista",
    youwere: "Em 2026 eu fui", era: "Carregando o próximo ano…", era2: "Minha era 2027", mood: "Nota do ano",
    stars: ["difícil", "mais ou menos", "bom", "ótimo", "icônico"], made: "Crie o seu", hardDefault: "tudo que 2026 jogou em mim"
  },
  a: {
    explorer: { n: "O Explorador", d: "Você disse sim a lugares novos e a novas versões de si.", t: ["curioso", "corajoso", "inquieto"] },
    builder: { n: "O Construtor", d: "Empilhando tijolos em silêncio enquanto os outros só falavam.", t: ["focado", "constante", "ambicioso"] },
    main: { n: "O Protagonista", d: "Todo lugar que você entrava ficava com uma luz melhor.", t: ["magnético", "ousado", "divertido"] },
    glow: { n: "O Glow-Up Silencioso", d: "Sem anúncio. Só uma versão melhor de você a cada mês.", t: ["disciplinado", "calmo", "subindo"] },
    heart: { n: "O Coração", d: "Você fez as pessoas se sentirem em casa, e isso é raro.", t: ["leal", "caloroso", "presente"] },
    soft: { n: "Pro da Vida Leve", d: "Você protegeu sua paz como se fosse seu trabalho.", t: ["sereno", "consciente", "de boa"] },
    phoenix: { n: "A Fênix", d: "2026 tentou. Você continua aqui, e mais forte.", t: ["resiliente", "sincero", "renascido"] },
    wildcard: { n: "O Curinga", d: "Ninguém conseguiu prever seu ano, nem você.", t: ["espontâneo", "criativo", "caótico"] }
  }
},
fr: {
  ui: {
    start: "Créer ma YearCard", time: "12 questions rapides · 1 minute",
    privacy: "Sans inscription. Vos réponses restent dans votre navigateur.",
    next: "Suivant", back: "Retour", skip: "Passer", finish: "Voir mon 2026",
    step: "Question {n} sur {t}",
    resultTitle: "Votre 2026 en résumé", resultSub: "Faites défiler vos cartes, puis partagez-les en story.",
    share: "Partager mes cartes", download: "Tout télécharger", copyLink: "Copier le lien de mon résumé",
    copied: "Lien copié", linkNote: "Le lien contient vos réponses : envoyez-le seulement à des proches.",
    again: "Recommencer", friendTitle: "Voici le 2026 de {name}", friendAnon: "Quelqu'un a partagé son 2026 avec vous",
    makeYours: "Créer ma propre YearCard", shopTitle: "Envie d'aller plus loin ?",
    shopText: "Le cahier de bilan 2026 → 2027 : 27 pages à imprimer pour bien clore l'année et préparer la suivante.",
    shopBtn: "Voir le cahier sur Etsy", tap: "Touchez une carte pour la télécharger", feed: "Post pour le feed (4:5)",
    shareFail: "Votre navigateur ne peut pas partager d'images directement, les cartes ont donc été téléchargées."
  },
  q: {
    name: { q: "D'abord, comment on vous appelle ?", ph: "Prénom ou surnom" },
    word: { q: "Votre 2026 en un mot ?", ph: "Tapez un mot", chips: ["Évolution", "Chaos", "Guérison", "Charbon", "Amour", "Survie", "Paix", "Changement"] },
    mood: { q: "Globalement, votre 2026 c'était comment ?", opts: ["Dur", "Bof", "Bien", "Top", "Iconique"] },
    focus: { q: "Où est passée la plupart de votre énergie ?", hint: "Choisissez jusqu'à 2",
      opts: { work: "Travail ou études", travel: "Voyages", family: "Famille", love: "Amour", health: "Santé et sport", create: "Créer", party: "Sorties", rest: "Repos et moi" } },
    nums: { q: "Votre année en chiffres", hint: "Une estimation suffit", places: "Nouveaux lieux", books: "Livres lus", people: "Nouvelles personnes", events: "Concerts et événements" },
    song: { q: "La chanson de votre année ?", ph: "Chanson ou artiste" },
    moment: { q: "Votre meilleur moment de 2026 ?", ph: "Ex. : Voir la mer à Lisbonne" },
    hard: { q: "Une épreuve que vous avez traversée ?",
      opts: { breakup: "Une rupture", job: "Stress ou changement de job", loss: "Perdre quelqu'un", health: "Un souci de santé", move: "Un déménagement", exams: "Des examens", money: "Des soucis d'argent", none: "Rien de grave", private: "Je préfère ne pas dire" } },
    learned: { q: "Une chose que 2026 vous a apprise ?", ph: "Ex. : Se reposer, c'est productif" },
    win: { q: "Votre plus grande victoire ?", ph: "Ex. : J'ai eu mon permis" },
    era: { q: "Choisissez votre ère 2027", opts: { healing: "Ère guérison", money: "Ère argent", main: "Ère personnage principal", glow: "Ère glow-up", soft: "Ère douceur", builder: "Ère bâtisseur", adventure: "Ère aventure", love: "Ère amour", discipline: "Ère discipline" } },
    energy: { q: "Dernière : votre vibe cette année", intro: "Casanier", extro: "Social", plan: "Organisé", spont: "Spontané" }
  },
  s: {
    cover: "Le 2026 de {name}", coverAnon: "Mon 2026", recapped: "en résumé", word: "2026 en un mot",
    nums: "En chiffres", places: "nouveaux lieux", books: "livres", people: "nouvelles personnes", events: "concerts et événements",
    song: "En boucle", moment: "Meilleur moment", hard: "J'ai traversé", learned: "2026 m'a appris", win: "Plus grande victoire",
    youwere: "En 2026, j'étais", era: "Chargement de l'année suivante…", era2: "Mon ère 2027", mood: "Note de l'année",
    stars: ["dur", "bof", "bien", "top", "iconique"], made: "Créez la vôtre", hardDefault: "tout ce que 2026 m'a lancé"
  },
  a: {
    explorer: { n: "L'Explorateur", d: "Vous avez dit oui à de nouveaux lieux et à de nouvelles versions de vous.", t: ["curieux", "courageux", "libre"] },
    builder: { n: "Le Bâtisseur", d: "Poser des briques en silence pendant que les autres en parlaient.", t: ["concentré", "régulier", "ambitieux"] },
    main: { n: "Le Personnage Principal", d: "Chaque pièce où vous entriez avait une meilleure lumière.", t: ["magnétique", "audacieux", "drôle"] },
    glow: { n: "Le Glow-Up Discret", d: "Aucune annonce. Juste une meilleure version de vous chaque mois.", t: ["discipliné", "calme", "en hausse"] },
    heart: { n: "Le Cœur", d: "Vous avez fait sentir les gens chez eux, et c'est rare.", t: ["loyal", "chaleureux", "présent"] },
    soft: { n: "Pro de la Douceur", d: "Vous avez protégé votre paix comme si c'était votre métier.", t: ["serein", "lucide", "imperturbable"] },
    phoenix: { n: "Le Phénix", d: "2026 a essayé. Vous êtes toujours là, et plus fort.", t: ["résilient", "sincère", "renaissant"] },
    wildcard: { n: "Le Joker", d: "Personne n'a pu prédire votre année, pas même vous.", t: ["spontané", "créatif", "chaotique"] }
  }
},
de: {
  ui: {
    start: "Meine YearCard erstellen", time: "12 schnelle Fragen · etwa 1 Minute",
    privacy: "Ohne Anmeldung. Deine Antworten bleiben in deinem Browser.",
    next: "Weiter", back: "Zurück", skip: "Überspringen", finish: "Mein 2026 ansehen",
    step: "Frage {n} von {t}",
    resultTitle: "Dein 2026 im Rückblick", resultSub: "Wisch durch deine Karten und teile sie in deiner Story.",
    share: "Meine Karten teilen", download: "Alle herunterladen", copyLink: "Link zu meinem Rückblick kopieren",
    copied: "Link kopiert", linkNote: "Der Link enthält deine Antworten. Schick ihn nur an Leute, denen du vertraust.",
    again: "Neu starten", friendTitle: "Das ist das 2026 von {name}", friendAnon: "Jemand hat sein 2026 mit dir geteilt",
    makeYours: "Eigene YearCard erstellen", shopTitle: "Willst du tiefer gehen?",
    shopText: "Das Reflexionsheft 2026 → 2027: 27 Seiten zum Ausdrucken, um das Jahr gut abzuschließen und das nächste zu planen.",
    shopBtn: "Zum Heft auf Etsy", tap: "Tippe auf eine Karte, um sie zu speichern", feed: "Feed-Post (4:5)",
    shareFail: "Dein Browser kann Bilder nicht direkt teilen, deshalb wurden die Karten heruntergeladen."
  },
  q: {
    name: { q: "Zuerst: Wie sollen wir dich nennen?", ph: "Vorname oder Spitzname" },
    word: { q: "Dein 2026 in einem Wort?", ph: "Ein Wort eingeben", chips: ["Wachstum", "Chaos", "Heilung", "Grind", "Liebe", "Überleben", "Ruhe", "Wandel"] },
    mood: { q: "Wie war dein 2026 insgesamt?", opts: ["Hart", "Naja", "Gut", "Super", "Legendär"] },
    focus: { q: "Wohin ging der Großteil deiner Energie?", hint: "Bis zu 2 wählen",
      opts: { work: "Arbeit oder Studium", travel: "Reisen", family: "Familie", love: "Liebe", health: "Gesundheit & Gym", create: "Etwas erschaffen", party: "Ausgehen", rest: "Ruhe & Me-Time" } },
    nums: { q: "Dein Jahr in Zahlen", hint: "Grob geschätzt reicht", places: "Neue Orte", books: "Gelesene Bücher", people: "Neue Leute", events: "Konzerte & Events" },
    song: { q: "Der Song deines Jahres?", ph: "Song oder Artist" },
    moment: { q: "Dein schönster Moment 2026?", ph: "z. B. Das Meer in Lissabon sehen" },
    hard: { q: "Etwas Schweres, das du geschafft hast?",
      opts: { breakup: "Eine Trennung", job: "Jobstress oder Jobwechsel", loss: "Jemanden verlieren", health: "Ein Gesundheitsschreck", move: "Ein Umzug", exams: "Prüfungen", money: "Geldsorgen", none: "Nichts Großes, ehrlich", private: "Sag ich lieber nicht" } },
    learned: { q: "Was hat dir 2026 beigebracht?", ph: "z. B. Pausen sind produktiv" },
    win: { q: "Dein größter Erfolg?", ph: "z. B. Führerschein bestanden" },
    era: { q: "Wähle deine 2027-Ära", opts: { healing: "Heilungs-Ära", money: "Geld-Ära", main: "Hauptfigur-Ära", glow: "Glow-up-Ära", soft: "Soft-Life-Ära", builder: "Aufbau-Ära", adventure: "Abenteuer-Ära", love: "Liebes-Ära", discipline: "Disziplin-Ära" } },
    energy: { q: "Letzte Frage: deine Vibe dieses Jahr", intro: "Stubenhocker", extro: "Gesellig", plan: "Planer", spont: "Spontan" }
  },
  s: {
    cover: "{name}s 2026", coverAnon: "Mein 2026", recapped: "im Rückblick", word: "2026 in einem Wort",
    nums: "In Zahlen", places: "neue Orte", books: "Bücher", people: "neue Leute", events: "Konzerte & Events",
    song: "Auf Repeat", moment: "Schönster Moment", hard: "Ich habe geschafft", learned: "2026 hat mir beigebracht", win: "Größter Erfolg",
    youwere: "2026 war ich", era: "Nächstes Jahr lädt…", era2: "Meine 2027-Ära", mood: "Jahresnote",
    stars: ["hart", "naja", "gut", "super", "legendär"], made: "Mach deine", hardDefault: "alles, was 2026 mir zugemutet hat"
  },
  a: {
    explorer: { n: "Der Entdecker", d: "Du hast Ja gesagt zu neuen Orten und neuen Versionen von dir.", t: ["neugierig", "mutig", "rastlos"] },
    builder: { n: "Der Macher", d: "Leise Stein auf Stein gesetzt, während andere nur geredet haben.", t: ["fokussiert", "beständig", "ehrgeizig"] },
    main: { n: "Die Hauptfigur", d: "Jeder Raum, den du betreten hast, hatte besseres Licht.", t: ["magnetisch", "mutig", "witzig"] },
    glow: { n: "Der Stille Glow-up", d: "Keine Ankündigung. Nur jeden Monat eine bessere Version von dir.", t: ["diszipliniert", "ruhig", "im Aufwind"] },
    heart: { n: "Das Herz", d: "Bei dir haben sich Menschen zu Hause gefühlt, und das ist selten.", t: ["loyal", "herzlich", "da"] },
    soft: { n: "Soft-Life-Profi", d: "Du hast deinen Frieden beschützt, als wäre es dein Job.", t: ["gelassen", "achtsam", "entspannt"] },
    phoenix: { n: "Der Phönix", d: "2026 hat es versucht. Du bist noch da, und stärker.", t: ["resilient", "ehrlich", "neu geboren"] },
    wildcard: { n: "Der Joker", d: "Niemand konnte dein Jahr vorhersagen, nicht mal du.", t: ["spontan", "kreativ", "chaotisch"] }
  }
}
};
