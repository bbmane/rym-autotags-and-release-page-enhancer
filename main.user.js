// ==UserScript==
// @name         RYM Genre Autotags and Release Page Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Autotags + My Catalog
// @author       bbmane
// @match        https://rateyourmusic.com/release/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const has = (genres, str) =>
        [...genres].some(g => g.innerText.toLowerCase().includes(str));

    const removeDuplicates = arr => [...new Set(arr)];

    const pushIf = (genres, str, ...tags) => {
        if (has(genres, str)) return tags;
        return [];
    };

    const GROUP_MAP = [
        // --- AMBIENT ---
        { list: ["black ambient","ritual ambient"], add: () => ["dark ambient"] },
        { list: ["ambient","ambient americana","dark ambient","space ambient","tribal ambient"], add: () => ["ambient"] },
        // --- BLUES ---
        { list: ["acoustic blues","acoustic chicago blues","acoustic texas blues","jug band","piedmont blues"], add: () => ["acoustic blues"] },
        { list: ["country blues","acoustic texas blues","delta blues","hill country blues","piedmont blues"], add: () => ["country blues"] },
        { list: ["electric blues","british blues","chicago blues","electric texas blues","swamp blues"], add: () => ["electric blues"] },
        { list: ["acoustic blues","boogie woogie","country blues","electric blues","fife and drum blues","jump blues","piano blues","soul blues","vaudeville blues"], add: () => ["blues"] },
        // --- CLASSICAL MUSIC
        { list: ["sarum chant"], add: () => ["gregorian chant"] },
        { list: ["danmono","kumiuta"], add: () => ["sōkyoku"] },
        { list: ["gagok"], add: () => ["jeong-ak"] },
        { list: ["gamelan angklung","gamelan beleganjur","gamelan gender wayang","gamelan gong gede","gamelan gong kebyar","gamelan jegog","gamelan selonding","gamelan semar pegulingan"], add: () => ["balinese gamelan"] },
        { list: ["gamelan sekaten","solonese gamelan"], add: () => ["javanese gamelan"] },
        { list: ["requiem"], add: () => ["mass"] },
        { list: ["ambrosian chant","canto beneventano","canto mozárabe","celtic chant","gallican chant","gregorian chant","old roman chant"], add: () => ["plainsong"] },
        { list: ["holy minimalism"], add: () => ["minimalism"] },
        { list: ["totalism"], add: () => ["post-minimalism"] },
        { list: ["integral serialism"], add: () => ["serialism"] },
        { list: ["kalon'ny fahiny"], add: () => ["operetta"] },
        { list: ["género chico","zarzuela barroca","zarzuela grande"], add: () => ["zarzuela"] },
        { list: ["concerto for orchestra","concerto grosso","sinfonia concertante"], add: () => ["concerto"] },
        { list: ["choral symphony","sinfonia concertante"], add: () => ["symphony"] },
        { list: ["baisha xiyue","chinese literati music","dongjing","yayue"], add: () => ["chinese classical music"] },
        { list: ["gagaku","heikyoku","honkyoku","jiuta","jōruri","meiji shinkyoku","nagauta","noh","shōmyō","sōkyoku"], add: () => ["japanese classical music"] },
        { list: ["aak","dang-ak","hyang-ak","jeong-ak"], add: () => ["korean classical music"] },
        { list: ["vietnamese opera"], add: () => ["vietnamese court music"] },
        { list: ["andalusian classical music","iraqi maqam","sawt"], add: () => ["arabic classical music"] },
        { list: ["turkish mevlevi music"], add: () => ["turkish classical music"] },
        { list: ["konnakol"], add: () => ["carnatic classical music"] },
        { list: ["dhrupad","kafi","khayal","klasik","qawwali","shabad kirtan","tarana","thumri"], add: () => ["hindustani classical music"] },
        { list: ["balinese gamelan","gamelan degung","javanese gamelan","malay gamelan"], add: () => ["gamelan"] },
        { list: ["malay gamelan"], add: () => ["malay classical music"] },
        { list: ["fon leb","khrueang sai","piphat"], add: () => ["thai classical music"] },
        { list: ["elizabethan song","lied","mélodie","orchestral song"], add: () => ["art song"] },
        { list: ["ballet de cour","comédie-ballet","opéra-ballet"], add: () => ["ballet"] },
        { list: ["ballet de cour","comédie-ballet","opéra-ballet","zarzuela barroca"], add: () => ["baroque music"] },
        { list: ["valsa brasileira"], add: () => ["brazilian classical music"] },
        { list: ["byzantine chant"], add: () => ["byzantine music"] },
        { list: ["string quartet"], add: () => ["chamber music"] },
        { list: ["nocturne"], add: () => ["character piece"] },
        { list: ["choral concerto","choral symphony","mass"], add: () => ["choral"] },
        { list: ["epic music","spaghetti western"], add: () => ["cinematic classical"] },
        { list: ["ars antiqua","ars nova","ars subtilior","contenance angloise","medieval lyric poetry","plainsong"], add: () => ["medieval classical music"] },
        { list: ["american gamelan","expressionism","futurism","impressionism","indeterminacy","microtonal classical","minimalism","musique concrète instrumentale","new complexity","post-minimalism","process music","serialism","sonorism","spectralism","stochastic music"], add: () => ["modern classical"] },
        { list: ["ballad opera","grand opéra","monodrama","opera buffa","opera semiseria","opera seria","operetta","opéra-ballet","opéra-comique","romantische oper","singspiel","tragédie en musique","verismo","zarzuela","zeitoper"], add: () => ["opera"] },
        { list: ["concert band","concerto","orchestral song","symphonic mugham","symphony","tone poem"], add: () => ["orchestral music"] },
        { list: ["contenance angloise","elizabethan song","franco-flemish school"], add: () => ["renaissance music"] },
        { list: ["grand opéra","new german school","romantische oper"], add: () => ["romanticism"] },
        { list: ["canto mozárabe","zarzuela"], add: () => ["spanish classical music"] },
        { list: ["chinese classical music","japanese classical music","korean classical music","vietnamese court music"], add: () => ["east asian classical music"] },
        { list: ["arabic classical music","azerbaijani mugham","persian classical music","shashmaqam","sufiana kalam","turkish classical music","twelve muqam"], add: () => ["maqāmic music"] },
        { list: ["carnatic classical music","hindustani classical music","odissi classical music"], add: () => ["south asian classical music"] },
        { list: ["burmese classical music","gamelan","kacapi suling","kakawin","kulintang","mahori","malay classical music","pinpeat","saluang klasik","talempong","tembang sunda cianjuran","thai classical music"], add: () => ["southeast asian classical music"] },
        { list: ["art song","bagatelle","ballet","baroque music","baroque suite","brazilian classical music","byzantine music","cantata","canzona","capriccio","chamber music","character piece","choral","cinematic classical","classical period","divertissement","english pastoral school","fantasia","fugue","impromptu","latin american classical music","light music","madrigal","medieval classical music","modern classical","motet","neoclassicism","opera","oratorio","orchestral music","overture","passion","prelude","renaissance music","ricercar","romanticism","serenade","sonata","spanish classical music","theme and variation","toccata","étude"], add: () => ["western classical music"] },
        { list: ["buganda royal court music","east asian classical music","inkiranya","kete","maqāmic music","minyue","pìobaireachd","south asian classical music","southeast asian classical music","tibetan buddhist chant","western classical music"], add: () => ["classical music"] },
        // --- COUNTRY ---
        { list: ["gothic country"], add: () => ["alt-country"] },
        { list: ["jamgrass"], add: () => ["progressive bluegrass"] },
        { list: ["bluegrass gospel"], add: () => ["traditional bluegrass"] },
        { list: ["progressive bluegrass","traditional bluegrass"], add: () => ["bluegrass"] },
        { list: ["neo-traditionalist country","bro-country"], add: () => ["contemporary country"] },
        { list: ["bro-country","countrypolitan","urban cowboy"], add: () => ["country pop"] },
        { list: ["bakersfield sound","truck driving country"], add: () => ["honky tonk"] },
        { list: ["countrypolitan"], add: () => ["nashville sound"] },
        { list: ["outlaw country"], add: () => ["progressive country"] },
        { list: ["bluegrass gospel"], add: () => ["country gospel"] },
        { list: ["close harmony","country gospel","country yodeling","traditional bluegrass"], add: () => ["traditional country"] },
        { list: ["alt-country","bluegrass","contemporary country","country & irish","country boogie","country folk","country pop","honky tonk","nashville sound","progressive country","traditional country","western","western swing"], add: () => ["country"] },
        // --- EASY LISTENING ---
        { list: ["sitarsploitation"], add: () => ["exotica"] },
        { list: ["cocktail nation","exotica","light music","lounge","pops orchestra","space age pop"], add: () => ["easy listening"] },
        // --- DANCE + ELECTRONIC ---
        { list: ["minatory"], add: () => ["deathstep"] },
        { list: ["rawphoric"], add: () => ["rawstyle"] },
        { list: ["hardbass"], add: () => ["scouse house"] },
        { list: ["noiadance"], add: () => ["dutch house"] },
        { list: ["buchiage trance"], add: () => ["hands up"] },
        { list: ["hi-tech psytrance","psycore"], add: () => ["dark psytrance"] },
        { list: ["nitzhonot"], add: () => ["goa trance"] },
        { list: ["zenonesque"], add: () => ["progressive psytrance"] },
        { list: ["spacesynth"], add: () => ["italo-disco"] },
        { list: ["darkside","hardcore breaks"], add: () => ["breakbeat hardcore"] },
        { list: ["jungle dutch"], add: () => ["breakbeat kota"] },
        { list: ["crossbreed","skullstep"], add: () => ["darkstep"] },
        { list: ["ragga jungle"], add: () => ["jungle"] },
        { list: ["sambass"], add: () => ["liquid drum and bass"] },
        { list: ["autonomic","microfunk"], add: () => ["minimal drum and bass"] },
        { list: ["briddim","colour bass","deathstep","drumstep","tearout [brostep]"], add: () => ["brostep"] },
        { list: ["future riddim","liquid riddim"], add: () => ["riddim"] },
        { list: ["aggrotech"], add: () => ["dark electro"] },
        { list: ["hard beat"], add: () => ["new beat"] },
        { list: ["future core"], add: () => ["kawaii future bass"] },
        { list: ["lolicore","mashcore","raggacore"], add: () => ["breakcore"] },
        { list: ["nu style gabber"], add: () => ["gabber"] },
        { list: ["bouncy techno","uk hardcore"], add: () => ["happy hardcore"] },
        { list: ["future core","powerstomp"], add: () => ["uk hardcore"] },
        { list: ["raggatek"], add: () => ["hardtek"] },
        { list: ["extratone","splittercore"], add: () => ["speedcore"] },
        { list: ["dubstyle","early hardstyle","euphoric hardstyle","nustyle","psystyle","rawstyle"], add: () => ["hardstyle"] },
        { list: ["scouse house","speed house"], add: () => ["uk hard house"] },
        { list: ["3-step"], add: () => ["afro house"] },
        { list: ["afropiano"], add: () => ["amapiano"] },
        { list: ["speed house"], add: () => ["bass house"] },
        { list: ["mega funk","slap house"], add: () => ["brazilian bass"] },
        { list: ["la hard house"], add: () => ["chicago hard house"] },
        { list: ["lo-fi house"], add: () => ["deep house"] },
        { list: ["hardbag"], add: () => ["diva house"] },
        { list: ["complextro","dutch house","fidget house","french electro","melbourne bounce"], add: () => ["electro house"] },
        { list: ["hardbag"], add: () => ["euro house"] },
        { list: ["future bounce","slap house"], add: () => ["future house"] },
        { list: ["gospel house","jersey sound"], add: () => ["garage house"] },
        { list: ["juke"], add: () => ["ghetto house"] },
        { list: ["bacardi"], add: () => ["kwaito"] },
        { list: ["lo-fi house"], add: () => ["outsider house"] },
        { list: ["deep tech","rominimal"], add: () => ["tech house"] },
        { list: ["guaracha [edm]"], add: () => ["tribal house"] },
        { list: ["schranz"], add: () => ["hard techno"] },
        { list: ["birmingham sound"], add: () => ["industrial techno"] },
        { list: ["dub techno"], add: () => ["minimal techno"] },
        { list: ["hands up"], add: () => ["euro trance"] },
        { list: ["latin freestyle"], add: () => ["freestyle"] },
        { list: ["j-euro"], add: () => ["eurobeat"] },
        { list: ["bubblegum dance","italo dance"], add: () => ["eurodance"] },
        { list: ["footwork jungle"], add: () => ["footwork"] },
        { list: ["beat bruxaria","brazilian phonk","funk automotivo","ritmada"], add: () => ["funk mandelão"] },
        { list: ["breakbeat kota"], add: () => ["funkot"] },
        { list: ["kawaii future bass"], add: () => ["future bass"] },
        { list: ["ghetto funk","neurohop"], add: () => ["glitch hop [edm]"] },
        { list: ["neo-grime","weightless"], add: () => ["grime"] },
        { list: ["batida"], add: () => ["kuduro"] },
        { list: ["car audio bass"], add: () => ["techno bass"] },
        { list: ["festival trap","hard trap","heaven trap","hybrid trap","twerk"], add: () => ["trap [edm]"] },
        { list: ["2-step","bassline","breakstep","future garage","speed garage"], add: () => ["uk garage"] },
        { list: ["aquacrunk"], add: () => ["wonky"] },
        { list: ["grebo","new rave"], add: () => ["alternative dance"] },
        { list: ["bubblegum dance","disco polo","freestyle","funk melody","romanian popcorn","tecnorumba","township bubblegum"], add: () => ["dance-pop"] },
        { list: ["boogie","electro-disco","euro-disco","latin disco","mutant disco","nu-disco"], add: () => ["disco"] },
        { list: ["atlanta bass","tamborzão","techno bass"], add: () => ["miami bass"] },
        { list: ["j-euro"], add: () => ["wa euro"] },
        { list: ["doskpop"], add: () => ["demostyle"] },
        { list: ["minatory"], add: () => ["deathstep"] },
        { list: ["doskpop"], add: () => ["spacesynth"] },
        { list: ["rawphoric"], add: () => ["rawstyle"] },
        { list: ["hardbass"], add: () => ["scouse house"] },
        { list: ["noiadance"], add: () => ["dutch house"] },
        { list: ["buchiage trance"], add: () => ["hands up"] },
        { list: ["hi-tech psytrance","psycore"], add: () => ["dark psytrance"] },
        { list: ["nitzhonot"], add: () => ["goa trance"] },
        { list: ["zenonesque"], add: () => ["progressive psytrance"] },
        { list: ["amigacore","demostyle"], add: () => ["tracker music"] },
        { list: ["darkside","hardcore breaks"], add: () => ["breakbeat hardcore"] },
        { list: ["jungle dutch"], add: () => ["breakbeat kota"] },
        { list: ["crossbreed","skullstep"], add: () => ["darkstep"] },
        { list: ["ragga jungle"], add: () => ["jungle"] },
        { list: ["sambass"], add: () => ["liquid drum and bass"] },
        { list: ["autonomic","microfunk"], add: () => ["minimal drum and bass"] },
        { list: ["briddim","colour bass","deathstep","drumstep","tearout [brostep]"], add: () => ["brostep"] },
        { list: ["future riddim","liquid riddim"], add: () => ["riddim"] },
        { list: ["hard beat"], add: () => ["new beat"] },
        { list: ["spacesynth"], add: () => ["italo-disco"] },
        { list: ["future core"], add: () => ["kawaii future bass"] },
        { list: ["lolicore","mashcore","raggacore"], add: () => ["breakcore"] },
        { list: ["nu style gabber"], add: () => ["gabber"] },
        { list: ["bouncy techno","uk hardcore"], add: () => ["happy hardcore"] },
        { list: ["future core","powerstomp"], add: () => ["uk hardcore"] },
        { list: ["raggatek"], add: () => ["hardtek"] },
        { list: ["extratone","splittercore"], add: () => ["speedcore"] },
        { list: ["dubstyle","early hardstyle","euphoric hardstyle","nustyle","psystyle","rawstyle"], add: () => ["hardstyle"] },
        { list: ["scouse house","speed house"], add: () => ["uk hard house"] },
        { list: ["3-step"], add: () => ["afro house"] },
        { list: ["afropiano"], add: () => ["amapiano"] },
        { list: ["speed house"], add: () => ["bass house"] },
        { list: ["mega funk","slap house"], add: () => ["brazilian bass"] },
        { list: ["la hard house"], add: () => ["chicago hard house"] },
        { list: ["lo-fi house"], add: () => ["deep house"] },
        { list: ["hardbag"], add: () => ["diva house"] },
        { list: ["complextro","dutch house","fidget house","french electro","melbourne bounce"], add: () => ["electro house"] },
        { list: ["hardbag"], add: () => ["euro house"] },
        { list: ["future bounce","slap house"], add: () => ["future house"] },
        { list: ["gospel house","jersey sound"], add: () => ["garage house"] },
        { list: ["juke"], add: () => ["ghetto house"] },
        { list: ["bacardi"], add: () => ["kwaito"] },
        { list: ["lo-fi house"], add: () => ["outsider house"] },
        { list: ["deep tech","rominimal"], add: () => ["tech house"] },
        { list: ["guaracha [edm]"], add: () => ["tribal house"] },
        { list: ["schranz"], add: () => ["hard techno"] },
        { list: ["birmingham sound"], add: () => ["industrial techno"] },
        { list: ["dub techno"], add: () => ["minimal techno"] },
        { list: ["hands up"], add: () => ["euro trance"] },
        { list: ["dark psytrance","forest psytrance","full-on psytrance","goa trance","progressive psytrance","suomisaundi"], add: () => ["psytrance"] },
        { list: ["black midi"], add: () => ["midi music"] },
        { list: ["16-bit","tracker music"], add: () => ["sequencer & tracker"] },
        { list: ["trip hop"], add: () => ["downtempo"] },
        { list: ["aggrotech"], add: () => ["dark electro"] },
        { list: ["acid breaks","baltimore club","big beat","breakbeat hardcore","breakbeat kota","florida breaks","funky breaks","nu skool breaks","progressive breaks","psybreaks","west coast breaks"], add: () => ["breakbeat"] },
        { list: ["atmospheric drum and bass","dancefloor drum and bass","darkstep","deep drum and bass","drumfunk","drumstep","dubwise drum and bass","footwork jungle","halftime","hardstep","jazzstep","jump-up","jungle","liquid drum and bass","minimal drum and bass","neurofunk","techstep","technoid","trancestep"], add: () => ["drum and bass"] },
        { list: ["brostep","chillstep","dungeon sound","melodic dubstep","purple sound","riddim","tearout"], add: () => ["dubstep"] },
        { list: ["baltimore club","jersey club","philly club"], add: () => ["east coast club"] },
        { list: ["dark electro","futurepop","new beat","tbm"], add: () => ["ebm"] },
        { list: ["hi-nrg","italo-disco","red disco","space disco"], add: () => ["electro-disco"] },
        { list: ["j-euro"], add: () => ["eurobeat"] },
        { list: ["bubblegum dance","italo dance"], add: () => ["eurodance"] },
        { list: ["footwork jungle"], add: () => ["footwork"] },
        { list: ["latin freestyle"], add: () => ["freestyle"] },
        { list: ["beat bruxaria","brazilian phonk","funk automotivo","ritmada"], add: () => ["funk mandelão"] },
        { list: ["breakbeat kota"], add: () => ["funkot"] },
        { list: ["kawaii future bass"], add: () => ["future bass"] },
        { list: ["ghetto funk","neurohop"], add: () => ["glitch hop [edm]"] },
        { list: ["neo-grime","weightless"], add: () => ["grime"] },
        { list: ["acidcore","amigacore","belgian techno","breakbeat hardcore","breakcore","crossbreed","darkcore","deathchant hardcore","digital hardcore","doomcore","frapcore","freeform hardcore","frenchcore","gabber","happy hardcore","hardtek","industrial hardcore","speedcore","terrorcore","uptempo hardcore"], add: () => ["hardcore [edm]"] },
        { list: ["hard trance","hardstyle","hardtek","jumpstyle","lento violento","nrg","uk hard house","uk hardcore"], add: () => ["hard dance"] },
        { list: ["acid house","afro house","amapiano","ambient house","ballroom","baltimore club","bass house","bassline","big room house","brazilian bass","bubbling house","changa tuki","chicago hard house","chicago house","deep house","diva house","electro house","eletrofunk","euro house","festival progressive house","french house","funky house","future funk","future house","g-house","garage house","ghetto house","gqom","hip house","italo house","jackin' house","kwaito","latin house","melodic house","microhouse","organic house","outsider house","phonk house","progressive house","romanian popcorn","speed garage","stutter house","tech house","tribal house","tropical house","uk hard house","uk jackin'","vinahouse"], add: () => ["house"] },
        { list: ["batida"], add: () => ["kuduro"] },
        { list: ["acid techno","ambient techno","belgian techno","bleep techno","detroit techno","freetekno","hard techno","hardgroove techno","industrial techno","melodic techno","minimal techno","peak time techno","tbm","wonky techno"], add: () => ["techno"] },
        { list: ["car audio bass"], add: () => ["techno bass"] },
        { list: ["acid trance","big room trance","dream trance","euro trance","hard trance","hi-tech full-on","ibiza trance","nrg","progressive trance","psytrance","tech trance","uplifting trance","vocal trance"], add: () => ["trance"] },
        { list: ["festival trap","hard trap","heaven trap","hybrid trap","twerk"], add: () => ["trap [edm]"] },
        { list: ["2-step","bassline","breakstep","future garage","speed garage"], add: () => ["uk garage"] },
        { list: ["aquacrunk"], add: () => ["wonky"] },
        { list: ["chillsynth"], add: () => ["chillwave"] },
        { list: ["broken transmission","eccojams","mallsoft","slushwave"], add: () => ["vaporwave"] },
        { list: ["chiptune","fm synthesis","midi music","sequencer & tracker"], add: () => ["bit music"] },
        { list: ["ambient dub","ambient house","ambient trance","balearic beat","barber beats","downtempo","psybient"], add: () => ["chillout"] },
        { list: ["brazilian phonk","phonk house"], add: () => ["drift phonk"] },
        { list: ["comfy synth","keller synth","winter synth"], add: () => ["dungeon synth"] },
        { list: ["acousmatic music","eai","musique concrète"], add: () => ["electroacoustic"] },
        { list: ["dark electro"], add: () => ["electro-industrial"] },
        { list: ["artcore","balani show","balearic beat","breakbeat","broken beat","bubblegum bass","bubbling","budots","bérite club","coupé-décalé","cruise","dariacore","deconstructed club","dek bass","digital cumbia","drum and bass","dubstep","east coast club","ebm","electro","electro latino","electro swing","electro-disco","electroclash","eurobeat","eurodance","flex dance music","footwork","freestyle","funk mandelão","funkot","future bass","future rave","ghettotech","glitch hop [edm]","grime","hard dance","hard drum","hardcore [edm]","hardvapour","hardwave","house","hyper techno","hypertechno","jungle terror","krushclub","kuduro","makina","manyao","melodic bass","midtempo bass","moombahcore","moombahton","nerdcore techno","nu-disco","ori deck","post-dubstep","shangaan electro","singeli","skweee","slimepunk","techno","techno bass","tecnorumba","trance","trap [edm]","tribal guarachero","uk bass","uk funky","uk garage","wonky"], add: () => ["electronic dance music"] },
        { list: ["krushclub"], add: () => ["hexd"] },
        { list: ["drill and bass"], add: () => ["idm"] },
        { list: ["chillwave","glitch pop","picopop"], add: () => ["indietronica"] },
        { list: ["changa tuki","digital cumbia","electro latino","electrotango","nortec","tribal guarachero"], add: () => ["latin electronic"] },
        { list: ["minimal synth"], add: () => ["minimal wave"] },
        { list: ["death industrial"], add: () => ["power electronics"] },
        { list: ["berlin school"], add: () => ["progressive electronic"] },
        { list: ["futurepop","pon-chak disco","techno kayō"], add: () => ["synthpop"] },
        { list: ["chillsynth","darksynth","sovietwave"], add: () => ["synthwave"] },
        { list: ["tecnofunk"], add: () => ["tecnobrega"] },
        { list: ["barber beats","dreampunk","future funk","hardvapour","utopian virtual","vapornoise","vaportrap","vaporwave"], add: () => ["vapor"] },
        { list: ["hardwave","neo-grime"], add: () => ["wave"] },
        //{ list: ["acholitronix","algorave","binaural beats","bit music","bitpop","celtic electronica","chillout","digital fusion","drift phonk","dungeon synth","electro hop","electro-industrial","electroacoustic","electronic dance music","electropop","epic collage","flashcore","folktronica","funktronica","glitch","glitch hop","graphical sound","hexd","horror synth","hyperpop","idm","illbient","indietronica","latin electronic","livetronica","maloya électronique","micromontage","minimal wave","moogsploitation","nightcore","nu jazz","power electronics","power noise","progressive electronic","space ambient","synth punk","synthpop","synthwave","tecnobrega","vapor","wave","witch house"], add: () => ["electronic"] },
        // --- EXPERIMENTAL ---
        { list: ["death industrial"], add: () => ["power electronics"] },
        { list: ["harsh noise wall"], add: () => ["harsh noise"] },
        { list: ["acousmatic music","eai","musique concrète"], add: () => ["electroacoustic"] },
        { list: ["eai"], add: () => ["free improvisation"] },
        { list: ["power electronics"], add: () => ["industrial"] },
        { list: ["ambient noise wall","black noise","gorenoise","harsh noise","power electronics","power noise"], add: () => ["noise"] },
        { list: ["lowercase","onkyo"], add: () => ["reductionism"] },
        { list: ["epic collage"], add: () => ["sound collage"] },
        { list: ["conducted improvisation","data sonification","drone","electroacoustic","free improvisation","futurism","glitch","graphical sound","indeterminacy","industrial","micromontage","modern creative","musique concrète instrumentale","noise","plunderphonics","reductionism","sound art","sound collage","sound poetry","tape music","turntable music"], add: () => ["experimental"] },
        // --- FOLK ---
        { list: ["rizitika"], add: () => ["cretan folk music"] },
        { list: ["seinn nan salm","òrain luaidh"], add: () => ["òrain ghàidhlig"] },
        { list: ["hambo"], add: () => ["polska"] },
        { list: ["warsaw city folk"], add: () => ["folklor miejski"] },
        { list: ["cape breton fiddling"], add: () => ["cape breton folk music"] },
        { list: ["lab polyphony","musika popullore","tosk polyphony"], add: () => ["albanian folk music"] },
        { list: ["izvorna bosanska muzika","sevdalinka"], add: () => ["bosnian folk music"] },
        { list: ["klapa"], add: () => ["croatian folk music"] },
        { list: ["aegean islands folk music","cretan folk music","dimotika","ionian islands folk music","rembetika"], add: () => ["greek folk music"] },
        { list: ["čalgija"], add: () => ["macedonian folk music"] },
        { list: ["čalgija"], add: () => ["starogradska muzika"] },
        { list: ["sutartinės"], add: () => ["lithuanian folk music"] },
        { list: ["seto leelo"], add: () => ["estonian folk music"] },
        { list: ["seto leelo"], add: () => ["rune singing"] },
        { list: ["bagad"], add: () => ["breton celtic folk music"] },
        { list: ["sean-nós"], add: () => ["irish folk music"] },
        { list: ["pipe band","pìobaireachd","scots song","scottish country dance music","shetland & orkney folk music","òrain ghàidhlig"], add: () => ["scottish folk music"] },
        { list: ["breton celtic folk music","kan ha diskan"], add: () => ["breton folk music"] },
        { list: ["paghjella"], add: () => ["corsican folk music"] },
        { list: ["swing musette"], add: () => ["musette"] },
        { list: ["auvergnat folk music","gascon folk music"], add: () => ["occitan folk music"] },
        { list: ["cantu a chiterra","cantu a tenore"], add: () => ["sardinian folk music"] },
        { list: ["pizzica","tammurriata"], add: () => ["tarantella"] },
        { list: ["polska"], add: () => ["nordic old time dance music"] },
        { list: ["hambo"], add: () => ["swedish folk music"] },
        { list: ["fado de coimbra"], add: () => ["fado"] },
        { list: ["polish goral music"], add: () => ["goral music"] },
        { list: ["folklor miejski","kashubian folk music","krakowiak","kujawiak","kujon","kurpian folk music","oberek","polish goral music"], add: () => ["polish folk music"] },
        { list: ["narodno zabavna glasba"], add: () => ["slovenian folk music"] },
        { list: ["duma","hutsul folk music"], add: () => ["ukrainian folk music"] },
        { list: ["saeta","sevillanas"], add: () => ["andalusian folk music"] },
        { list: ["unyago"], add: () => ["ngoma"] },
        { list: ["afrikaner folk music","khoisan folk music","nguni folk music","sotho-tswana folk music"], add: () => ["southern african folk music"] },
        { list: ["old-time"], add: () => ["appalachian folk music"] },
        { list: ["acoustic texas blues","delta blues","hill country blues","piedmont blues"], add: () => ["country blues"] },
        { list: ["raqs baladi"], add: () => ["arabic bellydance music"] },
        { list: ["aboio cantado"], add: () => ["aboio"] },
        { list: ["repente"], add: () => ["cantoria"] },
        { list: ["ponto de umbanda"], add: () => ["jongo"] },
        { list: ["moda de viola"], add: () => ["sertanejo de raiz"] },
        { list: ["cape breton folk music"], add: () => ["canadian maritime folk"] },
        { list: ["avar folk music"], add: () => ["dagestani folk music"] },
        { list: ["batonebi songs"], add: () => ["georgian folk music"] },
        { list: ["chaozhou xianshi","han folk music","haozi","jiangnan sizhu","shan'ge"], add: () => ["chinese folk music"] },
        { list: ["heikyoku","kagura","kouta","min'yō","ondō","rōkyoku","taiko","tsugaru shamisen"], add: () => ["japanese folk music"] },
        { list: ["muak","pansori","pungmul","sanjo","sinawi"], add: () => ["korean folk music"] },
        { list: ["chèo","quan họ","xẩm"], add: () => ["vietnamese folk music"] },
        { list: ["canto degli alpini","ländler","narodno zabavna glasba","naturjodel"], add: () => ["alpine folk music"] },
        { list: ["albanian folk music","aromanian folk music","balkan brass band","bosnian folk music","bulgarian folk music","croatian folk music","csango folk music","gagauz folk music","ganga","greek folk music","macedonian folk music","montenegrin folk music","muzică lăutărească","serbian folk music","starogradska muzika"], add: () => ["balkan folk music"] },
        { list: ["latvian folk music","lithuanian folk music"], add: () => ["baltic folk music"] },
        { list: ["estonian folk music","finnish folk music","karelian folk music","livonian folk music","rune singing"], add: () => ["balto-finnic folk music"] },
        { list: ["trikitixa"], add: () => ["basque folk music"] },
        { list: ["sardana"], add: () => ["catalan folk music"] },
        { list: ["breton celtic folk music","cape breton folk music","cornish folk music","irish folk music","manx folk music","scottish folk music","welsh folk music"], add: () => ["celtic folk music"] },
        { list: ["northumbrian folk music","scrumpy and western"], add: () => ["english folk music"] },
        { list: ["alsatian folk music","breton folk music","corsican folk music","musette","occitan folk music"], add: () => ["french folk music"] },
        { list: ["gstanzl"], add: () => ["german folk music"] },
        { list: ["csárdás","magyar nóta"], add: () => ["hungarian folk music"] },
        { list: ["canto degli alpini","canzone napoletana","liscio","sardinian folk music","stornello","tarantella","trallalero"], add: () => ["italian folk music"] },
        { list: ["bardcore"], add: () => ["neo-medieval folk"] },
        { list: ["danish folk music","faroese folk music","finnish folk music","icelandic folk music","joik","nordic old time dance music","norwegian folk music","swedish folk music"], add: () => ["nordic folk music"] },
        { list: ["chicago polka","polka peruana"], add: () => ["polka"] },
        { list: ["cante alentejano","chamarrita açoriana","desgarrada","fado","trás-os-montes folk music","vira"], add: () => ["portuguese folk music"] },
        { list: ["bocet","colinde","doină","muzică lăutărească"], add: () => ["romanian folk music"] },
        { list: ["belarusian folk music","bosnian folk music","bulgarian folk music","croatian folk music","czech folk music","ganga","goral music","macedonian folk music","montenegrin folk music","moravian folk music","polish folk music","russian folk music","serbian folk music","slovak folk music","slovenian folk music","starogradska muzika","ukrainian folk music"], add: () => ["slavic folk music"] },
        { list: ["andalusian folk music","aragonese folk music","asturian folk music","canarian folk music","chotis madrileño","copla","cuplé","galician folk music","pasodoble","valencian folk music"], add: () => ["spanish folk music"] },
        { list: ["bashkir folk music","chuvash folk music","komi folk music","mari folk music","mordvin folk music","udmurt folk music","volga tatar folk music"], add: () => ["volga-ural folk music"] },
        { list: ["chamamé tropical"], add: () => ["chamamé"] },
        { list: ["canto cardenche","pirekua","son calentano","son huasteco","son istmeño","son jarocho","trova yucateca"], add: () => ["mexican folk music"] },
        { list: ["festejo","landó","marinera","polka peruana","tondero","vals criollo"], add: () => ["música criolla peruana"] },
        { list: ["baul gaan"], add: () => ["bengali folk music"] },
        { list: ["biraha"], add: () => ["bhojpuri folk music"] },
        { list: ["shabad kirtan"], add: () => ["kirtan"] },
        { list: ["sarala gee"], add: () => ["sinhalese folk music"] },
        { list: ["urumi melam"], add: () => ["tamil folk music"] },
        { list: ["burrakatha"], add: () => ["telugu folk music"] },
        { list: ["fon leb"], add: () => ["thai folk music"] },
        { list: ["kef music"], add: () => ["armenian folk music"] },
        { list: ["turkish black sea region folk music","uzun hava","zeybek"], add: () => ["turkish folk music"] },
        { list: ["free folk"], add: () => ["avant-folk"] },
        { list: ["stomp and holler"], add: () => ["folk pop"] },
        { list: ["stomp and holler"], add: () => ["indie folk"] },
        { list: ["dark folk"], add: () => ["neofolk"] },
        { list: ["freak folk","free folk","udigrudi","wyrd folk"], add: () => ["psychedelic folk"] },
        { list: ["ambasse bey","apala","batuque","dagomba music","gnawa","kabye folk music","kilapanga","malagasy folk music","mbenga-mbuti music","moutya","ngoma","southern african folk music","tchinkoumé","traditional maloya","traditional séga","zinli"], add: () => ["african folk music"] },
        { list: ["appalachian folk music","country blues","field hollers","fife and drum blues","jug band","ring shout","sacred harp singing","spirituals","talking blues","traditional black gospel","traditional cajun music","traditional country"], add: () => ["american folk music"] },
        { list: ["aita","arabic bellydance music","ayyalah","fijiri","liwa","nuban","sa'idi"], add: () => ["arabic folk music"] },
        { list: ["aboio","banda de pífano","candomblé music","cantoria","capoeira music","fandango caiçara","jongo","lundu","maracatu","modinha","rasqueado","samba de roda","sertanejo de raiz","toada de boi","xaxado"], add: () => ["brazilian folk music"] },
        { list: ["canadian maritime folk","french-canadian folk music","métis fiddling","newfoundland folk music"], add: () => ["canadian folk music"] },
        { list: ["bele","benna","bomba","fungi","haitian vodou drumming","jibaro","kaiso","kitchen dance music","mento","méringue","plena","ripsaw","tumba","virgin islander cariso"], add: () => ["caribbean folk music"] },
        { list: ["abkhazian folk music","chechen folk music","circassian folk music","dagestani folk music","georgian folk music","ossetian folk music"], add: () => ["caucasian folk music"] },
        { list: ["amami shimauta","chinese folk music","indigenous taiwanese music","japanese folk music","korean folk music","vietnamese folk music"], add: () => ["east asian folk music"] },
        { list: ["alpine folk music","balkan folk music","baltic folk music","balto-finnic folk music","basque folk music","catalan folk music","celtic folk music","dutch folk music","english folk music","flemish folk music","french folk music","german folk music","għana","hungarian folk music","istrian folk music","italian folk music","neo-medieval folk","neo-pagan folk","nordic folk music","polka","portuguese folk music","romanian folk music","slavic folk music","spanish folk music","volga-ural folk music","walloon folk music","white voice","yiddish folksong"], add: () => ["european folk music"] },
        { list: ["bambuco","bomba","candombe","canto a lo poeta","carranga","chacarera","chamamé","chamarrita rioplatense","cueca","jibaro","joropo","malagueña venezolana","mexican folk music","milonga","muliza","música criolla peruana","música llanera","plena","saya","tamborito","taquirari","tonada chilena","yaraví","zamacueca","zamba"], add: () => ["hispanic american folk music"] },
        { list: ["athabaskan fiddling","inuit vocal games","james bay fiddling","mapuche folk music","powwow music","tonada potosina","unakesa"], add: () => ["indigenous american traditional music"] },
        { list: ["djanba","wangga"], add: () => ["indigenous australian traditional music"] },
        { list: ["assamese folk music","bengali folk music","bhojpuri folk music","boduberu","burushaski folk music","gujarati folk music","kannada folk music","kirtan","malayali folk music","marathi folk music","newa folk music","odia folk music","pashto folk music","punjabi folk music","rajasthani folk music","sinhalese folk music","tamil folk music","telugu folk music"], add: () => ["south asian folk music"] },
        { list: ["balitaw","bamar folk music","gondang","harana","hmong folk music","khmer folk music","kuda kepang","lao folk music","malay folk music","philippine rondalla","tarawangsa","thai folk music","vietnamese folk music"], add: () => ["southeast asian folk music"] },
        { list: ["alevi folk music","armenian folk music","assyrian folk music","ayyalah","fijiri","israeli folk music","luri folk music","meyxana","persian folk music","turkish folk music"], add: () => ["west asian folk music"] },
        { list: ["aboio","field hollers","haozi","sea shanty","shan'ge","òrain luaidh"], add: () => ["work song"] },
        { list: ["country yodeling","naturjodel"], add: () => ["yodeling"] },
        { list: ["american primitivism","anti-folk","avant-folk","campus folk","chamber folk","country folk","folk baroque","folk pop","indie folk","loner folk","neofolk","neofolklore","progressive folk","psychedelic folk","skiffle","xinyao"], add: () => ["contemporary folk"] },
        { list: ["african folk music","american folk music","arabic folk music","australian folk music","bayawan","brazilian folk music","buryat folk music","canadian folk music","caribbean folk music","caucasian folk music","chukchi folk music","east asian folk music","european folk music","football chant","hazara folk music","hispanic american folk music","indigenous american traditional music","indigenous australian traditional music","ladino folksong","ob-ugric folk music","payada","romani folk music","samoyedic folk music","south asian folk music","southeast asian folk music","west asian folk music","work song","yodeling"], add: () => ["traditional folk music"] },
        { list: ["contemporary folk","traditional folk music"], add: () => ["folk"] },
        // --- HIP HOP ---
        { list: ["asian rock"], add: () => ["pluggnb"] },
        { list: ["bop"], add: () => ["chicago drill"] },
        { list: ["sample drill","sexy drill"], add: () => ["new york drill"] },
        { list: ["mafioso rap","road rap","scam rap"], add: () => ["gangsta rap"] },
        { list: ["dungeon rap","phonk"], add: () => ["memphis rap"] },
        { list: ["ambient plugg","dark plugg","pluggnb","terror plugg"], add: () => ["plugg"] },
        { list: ["sissy bounce"], add: () => ["bounce"] },
        { list: ["chap hop"], add: () => ["comedy rap"] },
        { list: ["crunkcore"], add: () => ["crunk"] },
        { list: ["flint sound","philly drill"], add: () => ["detroit sound"] },
        { list: ["chicago drill","free car music","jersey drill","new york drill","philly drill","uk drill"], add: () => ["drill"] },
        { list: ["industrial hip hop"], add: () => ["experimental hip hop"] },
        { list: ["gengetone"], add: () => ["genge"] },
        { list: ["britcore","chopper","gangsta rap","horrorcore","memphis rap","mid-school hip hop","trap metal"], add: () => ["hardcore hip hop"] },
        { list: ["jerk rap"], add: () => ["hyphy"] },
        { list: ["rare phonk"], add: () => ["instrumental hip hop"] },
        { list: ["jersey drill"], add: () => ["jersey club rap"] },
        { list: ["chicano rap"], add: () => ["latin rap"] },
        { list: ["atlanta bass","tamborzão","techno bass"], add: () => ["miami bass"] },
        { list: ["bop","frat rap","futuristic swag"], add: () => ["pop rap"] },
        { list: ["chicago drill","free car music","futuristic swag","new jazz","no melody","plugg","rage","rare phonk","regalia","sigilkore","trap latino","trap metal","trap soul","tread"], add: () => ["trap"] },
        { list: ["abstract hip hop","afro trap","afroswing","arabesque rap","bongo flava","boom bap","bounce","chipmunk soul","chopped and screwed","christian hip hop","cloud rap","comedy rap","conscious hip hop","country rap","crunk","detroit sound","digicore","dirty south","disco rap","drill","drumless","emo rap","experimental hip hop","g-funk","genge","hardcore hip hop","hipco","hiplife","houston sound","hyphy","instrumental hip hop","jazz rap","jerk","jersey club rap","jigg","jook","latin rap","lo-fi hip hop","lowend","miami bass","mobb music","motswako","nerdcore hip hop","nervous music","philly club rap","political hip hop","pop rap","ratchet","snap","stoner rap","trap","trap shaabi","turntablism"], add: () => ["hip hop"] },
        // --- INDUSTRIAL & NOISE
        { list: ["dark electro"], add: () => ["electro-industrial"] },
        { list: ["cyber metal","neue deutsche härte"], add: () => ["industrial metal"] },
        { list: ["dark ambient","deconstructed club","ebm","electro-industrial","industrial hardcore","industrial hip hop","industrial metal","industrial rock","industrial techno","martial industrial","power noise"], add: () => ["post-industrial"] },
        // --- JAZZ ---
        { list: ["european free jazz"], add: () => ["free jazz"] },
        { list: ["experimental big band","free jazz"], add: () => ["avant-garde jazz"] },
        { list: ["experimental big band","progressive big band"], add: () => ["big band"] },
        { list: ["afro-cuban jazz","samba-jazz"], add: () => ["latin jazz"] },
        { list: ["kwela","mbaqanga"], add: () => ["marabi"] },
        { list: ["jazz mugham"], add: () => ["modal jazz"] },
        { list: ["swing revival"], add: () => ["swing"] },
        { list: ["vocalese"], add: () => ["vocal jazz"] },
        { list: ["afro-jazz","arabic jazz","avant-garde jazz","bebop","big band","british dance band","bulawayo jazz","cape jazz","cartoon music","chamber jazz","cool jazz","crime jazz","dark jazz","dixieland","ecm style jazz","ethio-jazz","flamenco jazz","hard bop","indo jazz","jazz fusion","jazz manouche","jazz poetry","jazz-funk","kréyol djaz","latin jazz","marabi","modal jazz","post-bop","smooth jazz","soul jazz","spiritual jazz","spy music","stride","swing","third stream","vocal jazz"], add: () => ["jazz"] },
        // --- METAL ---
        { list: ["blackgaze"], add: () => ["atmospheric black metal"] },
        { list: ["slam death metal"], add: () => ["brutal death metal"] },
        { list: ["dissonant death metal"], add: () => ["technical death metal"] },
        { list: ["epic doom metal"], add: () => ["traditional doom metal"] },
        { list: ["gorenoise","pornogrind"], add: () => ["goregrind"] },
        { list: ["downtempo deathcore"], add: () => ["deathcore"] },
        { list: ["funk metal","neue deutsche härte","nu metal","rap metal"], add: () => ["alternative metal"] },
        { list: ["atmospheric black metal","black 'n' roll","black noise","dissonant black metal","dsbm","hellenic black metal","melodic black metal","pagan black metal","symphonic black metal"], add: () => ["black metal"] },
        { list: ["brutal death metal","death 'n' roll","deathgrind","melodic death metal","technical death metal"], add: () => ["death metal"] },
        { list: ["thall"], add: () => ["djent"] },
        { list: ["death doom metal","funeral doom metal","traditional doom metal"], add: () => ["doom metal"] },
        { list: ["celtic metal","mittelalter-metal"], add: () => ["folk metal"] },
        { list: ["cybergrind","deathgrind","goregrind","mincecore","noisegrind"], add: () => ["grindcore"] },
        { list: ["speed metal","us power metal"], add: () => ["heavy metal"] },
        { list: ["deathcore","mathcore","melodic metalcore","thall"], add: () => ["metalcore"] },
        { list: ["atmospheric sludge metal","blackgaze","doomgaze"], add: () => ["post-metal"] },
        { list: ["atmospheric sludge metal"], add: () => ["sludge metal"] },
        { list: ["crossover thrash","technical thrash metal"], add: () => ["thrash metal"] },
        // --- THEATRE ---
        { list: ["murga uruguaya"], add: () => ["murga"] },
        { list: ["kalon'ny fahiny"], add: () => ["operetta"] },
        { list: ["vaudeville blues"], add: () => ["vaudeville"] },
        { list: ["ballad opera","cabaret","comédie-ballet","cuplé","dutch cabaret","kabarett","kanto","minstrelsy","murga","music hall","operetta","revue","rock musical","show tunes","siffleur","singspiel","vaudeville"], add: () => ["musical theatre and entertainment"] },
        // --- NEW AGE ---
        { list: ["andean new age","celtic new age","native american new age","neoclassical new age","new age kirtan","tibetan new age"], add: () => ["new age"] },
        // --- POP ---
        { list: ["cuddlecore"], add: () => ["twee pop"] },
        { list: ["freakbeat","group sounds","jovem guarda","merseybeat","nederbeat"], add: () => ["beat"] },
        { list: ["c86","dolewave","neo-acoustic","paisley underground"], add: () => ["jangle pop"] },
        { list: ["tropical rock","yacht rock"], add: () => ["soft rock"] },
        { list: ["afropiano","alté"], add: () => ["afrobeats"] },
        { list: ["al jeel","mūsīqā lubnāniyya"], add: () => ["arabic pop"] },
        { list: ["chalga","manele","modern laika","musika popullore","muzică de mahala","skiladika","tallava","turbo-folk"], add: () => ["balkan pop-folk"] },
        { list: ["rom kbach"], add: () => ["cambodian pop"] },
        { list: ["bolero-beat","música cebolla"], add: () => ["canción melódica"] },
        { list: ["neo-city pop"], add: () => ["city pop"] },
        { list: ["dangdut koplo"], add: () => ["dangdut"] },
        { list: ["bhojpuri pop"], add: () => ["indian pop"] },
        { list: ["bedroom pop","c86","chamber pop","neo-acoustic","tontipop","twee pop"], add: () => ["indie pop"] },
        { list: ["canzone neomelodica"], add: () => ["italo pop"] },
        { list: ["akishibu-kei","denpa","wa euro","yakousei"], add: () => ["j-pop"] },
        { list: ["idol kayō","mood kayō","techno kayō"], add: () => ["kayōkyoku"] },
        { list: ["oriental ballad"], add: () => ["korean ballad"] },
        { list: ["semi-trot"], add: () => ["k-pop"] },
        { list: ["cumbia pop","tropipop"], add: () => ["latin pop"] },
        { list: ["palingsound"], add: () => ["nederpop"] },
        { list: ["talempong goyang"], add: () => ["pop minang"] },
        { list: ["beat","beat rock","big music","britpop","jangle pop","piano rock","pop yeh-yeh","post-britpop","power pop","soft rock","stereo","twee pop","vocal surf"], add: () => ["pop rock"] },
        { list: ["motown sound"], add: () => ["pop soul"] },
        { list: ["humppa","levenslied","volkstümliche musik"], add: () => ["schlager"] },
        { list: ["arrocha sertanejo","funknejo"], add: () => ["sertanejo universitário"] },
        { list: ["futurepop","pon-chak disco","techno kayō"], add: () => ["synthpop"] },
        { list: ["british dance band","mood kayō","romanţe","standards","tin pan alley"], add: () => ["traditional pop"] },
        { list: ["adult contemporary","afrobeats","alt-pop","arabic pop","art pop","balkan pop-folk","baroque pop","bitpop","blue-eyed soul","boy band","brega calypso","brill building","bubblegum","cambodian pop","canción melódica","city pop","classical crossover","country pop","dance-pop","dangdut","dansbandsmusik","dansktop","electro hop","electropop","europop","flamenco pop","folk pop","french pop","girl group","hmong pop","hyperpop","indian pop","indie pop","irish showband","italo pop","j-pop","jazz pop","k-pop","kayōkyoku","korean ballad","latin pop","lokal musik","mulatós","nederpop","new music","opm","orthodox pop","p-pop","persian pop","pop batak","pop ghazal","pop minang","pop raï","pop reggae","pop rock","pop soul","pop sunda","progressive pop","psychedelic pop","rabiz","rigsar","rumba catalana","russian chanson","schlager","sertanejo romântico","sertanejo universitário","sophisti-pop","soviet estrada","sunshine pop","synthpop","t-pop","teen pop","toytown pop","traditional pop","turkish pop","vocal trance","yé-yé"], add: () => ["pop"] },
        /// --- PSYCH ---
        { list: ["space rock revival"], add: () => ["space rock"] },
        { list: ["baggy","dream pop","hypnagogic pop","paisley underground","space rock revival"], add: () => ["neo-psychedelia"] },
        { list: ["acid rock","freakbeat","garage psych","heavy psych","raga rock","space rock","xian psych","zamrock"], add: () => ["psychedelic rock"] },
        { list: ["sitarsploitation"], add: () => ["psychsploitation"] },
        { list: ["neo-psychedelia","psychedelic folk","psychedelic pop","psychedelic rock","psychedelic soul","psychsploitation","stoner metal","stoner rock","tropicália"], add: () => ["psychedelia"] },
        // --- PUNK ---
        { list: ["blackened crust","neocrust","stenchcore"], add: () => ["crust punk"] },
        { list: ["crack rock steady"], add: () => ["skacore"] },
        { list: ["powerviolence"], add: () => ["thrashcore"] },
        { list: ["emoviolence"], add: () => ["screamo"] },
        { list: ["burning spirits","crossover thrash","crust punk","d-beat","melodic hardcore","mincecore","skacore","street punk","thrashcore"], add: () => ["hardcore punk"] },
        { list: ["emocore","mall screamo","screamo","swancore"], add: () => ["post-hardcore"] },
        { list: ["dance-punk revival"], add: () => ["dance-punk"] },
        { list: ["deathrock","positive punk"], add: () => ["gothic rock"] },
        { list: ["dance-punk revival"], add: () => ["post-punk revival"] },
        { list: ["easycore","seishun punk"], add: () => ["pop punk"] },
        { list: ["skacore"], add: () => ["ska punk"] },
        { list: ["egg punk"], add: () => ["art punk"] },
        { list: ["emo-pop","emocore","mall screamo","midwest emo","screamo"], add: () => ["emo"] },
        { list: ["celtic punk","gypsy punk"], add: () => ["folk punk"] },
        { list: ["beatdown hardcore","easycore","noisecore","post-hardcore","sass"], add: () => ["hardcore punk"] },
        { list: ["coldwave","dance-punk","gothic rock","post-punk revival"], add: () => ["post-punk"] },
        { list: ["anarcho-punk","celtic punk","deathrock","deutschpunk","egg punk","garage punk","glam punk","horror punk","könsrock","oi!","pop punk","positive punk","psychobilly","ska punk","skate punk","surf punk","vikingarock"], add: () => ["punk rock"] },
        { list: ["digital hardcore","mod revival","pigfuck"], add: () => ["punk"] },
        // --- R&B ---
        { list: ["bounce beat"], add: () => ["go-go"] },
        { list: ["minneapolis sound"], add: () => ["synth funk"] },
        { list: ["alternative r&b","hip hop soul","new jack swing","trap soul","uk street soul"], add: () => ["contemporary r&b"] },
        { list: ["afro-funk","britfunk","deep funk","go-go","jazz-funk","latin funk","p-funk","porn groove","synth funk"], add: () => ["funk"] },
        { list: ["british rhythm & blues","swamp pop","twist","west side sound"], add: () => ["rhythm & blues"] },
        { list: ["chicago soul","country soul","deep soul","latin soul","neo-soul","philly soul","pop soul","progressive soul","psychedelic soul","smooth soul","southern soul"], add: () => ["soul"] },
        { list: ["acid jazz","beach music","blue-eyed soul","boogie","contemporary r&b","doo-wop","funk","new orleans r&b","rhythm & blues","soul","soul blues"], add: () => ["r&b"] },
        // --- REGGAE/SKA/DANCEHALL ---
        { list: ["jawaiian"], add: () => ["pacific reggae"] },
        { list: ["dub poetry"], add: () => ["roots reggae"] },
        { list: ["ska punk"], add: () => ["third wave ska"] },
        { list: ["bubbling","digital dancehall","flex dance music","gommance","ragga","shatta","trap dancehall","zess"], add: () => ["dancehall"] },
        { list: ["deejay","digital dancehall","dub","lovers rock","pacific reggae","pop reggae","roots reggae","seggae","skinhead reggae"], add: () => ["reggae"] },
        { list: ["2 tone","jamaican ska","new tone","spouge","third wave ska"], add: () => ["ska"] },
        // --- REGIONAL MUSIC ---
        { list: ["korean revolutionary opera","revolutionary opera"], add: () => ["peking opera"] },
        { list: ["cumbia rebajada"], add: () => ["cumbia sonidera"] },
        { list: ["movimiento alterado","tecnobanda"], add: () => ["banda sinaloense"] },
        { list: ["corrido tumbado"], add: () => ["sierreño"] },
        { list: ["arrochadeira"], add: () => ["pagodão"] },
        { list: ["forró de favela","piseiro"], add: () => ["forró eletrônico"] },
        { list: ["takamba","tishoumaren"], add: () => ["tuareg music"] },
        { list: ["cantonese opera","henan opera","kunqu opera","peking opera","shaoxing opera","sichuan opera","yangzhou opera"], add: () => ["chinese opera"] },
        { list: ["chaozhou xianshi","guangdong yinyue","jiangnan sizhu","nanyin"], add: () => ["sizhu music"] },
        { list: ["pon-chak disco","semi-trot"], add: () => ["trot"] },
        { list: ["cilokaq","langgam jawa"], add: () => ["keroncong"] },
        { list: ["balinese gamelan","gamelan degung","javanese gamelan","malay gamelan"], add: () => ["gamelan"] },
        { list: ["fon leb","khrueang sai","piphat"], add: () => ["thai classical music"] },
        { list: ["lilat"], add: () => ["luk krung"] },
        { list: ["flamenco jazz"], add: () => ["flamenco nuevo"] },
        { list: ["género chico","zarzuela barroca","zarzuela grande"], add: () => ["zarzuela"] },
        { list: ["cumbia sonidera"], add: () => ["cumbia mexicana"] },
        { list: ["banda sinaloense"], add: () => ["bandas de viento de méxico"] },
        { list: ["cumbia norteña mexicana","duranguense","movimiento alterado","sierreño"], add: () => ["norteño"] },
        { list: ["arrochadeira","bregadeira"], add: () => ["arrocha"] },
        { list: ["batidão romântico"], add: () => ["brega funk"] },
        { list: ["tecnofunk"], add: () => ["tecnobrega"] },
        { list: ["funk proibidão","tamborzão"], add: () => ["funk carioca"] },
        { list: ["pagodão","samba-reggae"], add: () => ["axé"] },
        { list: ["ciranda","embolada"], add: () => ["coco"] },
        { list: ["forró eletrônico","forró universitário"], add: () => ["forró"] },
        { list: ["frevo de bloco","frevo de rua","frevo elétrico","frevo-canção"], add: () => ["frevo"] },
        { list: ["guitarrada"], add: () => ["lambada"] },
        { list: ["pagode romântico","pagodão"], add: () => ["pagode"] },
        { list: ["samba soul"], add: () => ["samba-rock"] },
        { list: ["samba-choro"], add: () => ["choro"] },
        { list: ["vanera"], add: () => ["música gaúcha"] },
        { list: ["tarraxinha"], add: () => ["kizomba"] },
        { list: ["kwassa kwassa"], add: () => ["soukous"] },
        { list: ["acholitronix"], add: () => ["acholi music"] },
        { list: ["buganda royal court music","kadongo kamu","mataali"], add: () => ["baganda music"] },
        { list: ["ahwash","izlan","kabyle music","sahrawi music","staïfi","tuareg music"], add: () => ["amazigh music"] },
        { list: ["al jeel","ancient egyptian music","coptic music","raqs baladi","sa'idi","shaabi"], add: () => ["egyptian music"] },
        { list: ["aita","algerian chaabi","andalusian classical music","banga","gnawa","jilala music","malhun","moroccan chaabi","raï"], add: () => ["maghrebi music"] },
        { list: ["azmari","ethio-jazz","ethiopian church music","gurage music","manzuma","tigrinya music","tizita"], add: () => ["ethiopic music"] },
        { list: ["belwo","dhaanto","qaraami"], add: () => ["somali music"] },
        { list: ["maloya électronique","maloya élektrik","traditional maloya"], add: () => ["maloya"] },
        { list: ["seggae","traditional séga"], add: () => ["séga"] },
        { list: ["chimurenga","shona mbira music"], add: () => ["shona music"] },
        { list: ["kete","zoblazo"], add: () => ["akan music"] },
        { list: ["agbadza","agbekor"], add: () => ["ewe music"] },
        { list: ["tchink system","tchinkoumé","zinli"], add: () => ["fon music"] },
        { list: ["burger-highlife"], add: () => ["highlife"] },
        { list: ["ogene music"], add: () => ["igbo music"] },
        { list: ["alloukou","palm wine music","ziglibithy"], add: () => ["kru music"] },
        { list: ["mbalax","tassu"], add: () => ["wolof music"] },
        { list: ["apala","fuji","jùjú","santería music","waka","yoruba folk opera"], add: () => ["yoruba music"] },
        { list: ["coupé-décalé"], add: () => ["zouglou"] },
        { list: ["falak"], add: () => ["pamiri music"] },
        { list: ["chöd","tibetan buddhist chant","zhabdro gorgom"], add: () => ["tibetan music"] },
        { list: ["bayawan","twelve muqam"], add: () => ["uyghur music"] },
        { list: ["upopo","yukar"], add: () => ["ainu music"] },
        { list: ["ancient chinese music","campus folk","chinese classical music","chinese folk music","chinese opera","minyue","naxi music","quyi","shidaiqu","sizhu music","taoist ritual music","xibei feng","xinyao","zhongguo feng"], add: () => ["chinese music"] },
        { list: ["eleki","enka","japanese classical music","japanese folk music","ryūkōka"], add: () => ["japanese music"] },
        { list: ["beompae","changjak gugak","fusion gugak","korean classical music","korean folk music","korean revolutionary opera","oriental ballad","trot"], add: () => ["korean music"] },
        { list: ["amami shimauta","okinawan music"], add: () => ["ryukyuan music"] },
        { list: ["bolero việt nam","ca trù","cải lương","hát lô tô","ngâm thơ","nhạc tiền chiến","nhạc vàng","nhạc đỏ","tân cổ giao duyên","vietnamese court music","vietnamese folk music"], add: () => ["vietnamese music"] },
        { list: ["folkhop"], add: () => ["bhangra"] },
        { list: ["bamar folk music","burmese classical music","mono"], add: () => ["bamar music"] },
        { list: ["hmong folk music","hmong pop","lisu music"], add: () => ["hill tribe music"] },
        { list: ["balinese music","batak music","dangdut","gambang kromong","javanese music","kakawin","keroncong","minangkabau music","orkes gambus","qasidah modern","rapai dabõih","sundanese music","tanjidor"], add: () => ["indonesian music"] },
        { list: ["gamelan angklung","gamelan beleganjur","gamelan gender wayang","gamelan gong gede","gamelan gong kebyar","gamelan jegog","gamelan selonding","gamelan semar pegulingan"], add: () => ["balinese gamelan"] },
        { list: ["gamelan sekaten","solonese gamelan"], add: () => ["javanese gamelan"] },
        { list: ["cambodian pop","kantruem","khmer folk music","pinpeat"], add: () => ["khmer music"] },
        { list: ["malay gamelan"], add: () => ["malay classical music"] },
        { list: ["molam sing"], add: () => ["molam"] },
        { list: ["balitaw","harana","igorot music","ilocano music","kundiman","opm","philippine rondalla","pinoy folk rock"], add: () => ["philippine music"] },
        { list: ["burmese classical music","gamelan","kacapi suling","kakawin","kulintang","mahori","malay classical music","pinpeat","saluang klasik","talempong","tembang sunda cianjuran","thai classical music"], add: () => ["southeast asian classical music"] },
        { list: ["luk krung","luk thung","molam sing","phleng phuea chiwit","thai classical music","thai folk music","wong shadow"], add: () => ["thai music"] },
        { list: ["armenian church music","armenian folk music","rabiz"], add: () => ["armenian music"] },
        { list: ["azerbaijani mugham","jazz mugham","meyxana","symphonic mugham"], add: () => ["azerbaijani music"] },
        { list: ["achomi music","bandari","koche bazari","persian classical music","persian folk music","persian pop"], add: () => ["persian music"] },
        { list: ["anatolian rock","arabesk","fantezi","kanto","ottoman military music","turkish classical music","turkish folk music","turkish pop","özgün müzik"], add: () => ["turkish music"] },
        { list: ["vude"], add: () => ["fijian music"] },
        { list: ["hapa haole","jawaiian","slack-key guitar"], add: () => ["hawaiian music"] },
        { list: ["reparto"], add: () => ["cubaton"] },
        { list: ["guaguancó"], add: () => ["rumba cubana"] },
        { list: ["bolero son","son montuno"], add: () => ["son cubano"] },
        { list: ["nueva trova"], add: () => ["trova"] },
        { list: ["cadence rampa","compas","haitian vodou drumming","méringue","rabòday","rara","rasin","twoubadou"], add: () => ["haitian music"] },
        { list: ["cabo-zouk","zouk love"], add: () => ["zouk"] },
        { list: ["chutney soca"], add: () => ["chutney"] },
        { list: ["sarum chant"], add: () => ["gregorian chant"] },
        { list: ["entechna laika","neo kyma"], add: () => ["entechna"] },
        { list: ["entechna laika","modern laika","skiladika"], add: () => ["laika"] },
        { list: ["byzantine chant"], add: () => ["byzantine music"] },
        { list: ["música de intervenção","pimba","portuguese folk music"], add: () => ["portuguese music"] },
        { list: ["bulería","flamenco nuevo","rumba flamenca"], add: () => ["flamenco"] },
        { list: ["canto mozárabe","zarzuela"], add: () => ["spanish classical music"] },
        { list: ["bard rock"], add: () => ["avtorskaya pesnya"] },
        { list: ["cumbia santafesina","cumbia turra","cumbia villera"], add: () => ["cumbia argentina"] },
        { list: ["bolero son","filin"], add: () => ["bolero"] },
        { list: ["nueva cumbia chilena"], add: () => ["cumbia chilena"] },
        { list: ["neofolklore"], add: () => ["música típica chilena"] },
        { list: ["cumbia argentina","cumbia chilena","cumbia colombiana","cumbia mexicana","cumbia peruana","cumbia pop","cumbia salvadoreña","digital cumbia","merecumbé"], add: () => ["cumbia"] },
        { list: ["chicha","cumbia amazónica","cumbia norteña peruana"], add: () => ["cumbia peruana"] },
        { list: ["bolivian huayño","carnavalito","chimaychi"], add: () => ["huayno"] },
        { list: ["nueva cumbia chilena"], add: () => ["latin alternative"] },
        { list: ["changa tuki","digital cumbia","electro latino","electrotango","nortec","tribal guarachero"], add: () => ["latin electronic"] },
        { list: ["bandas de viento de méxico","chilena","corrido","cumbia mexicana","cumbiatón","mariachi","mexican folk music","norteño","ranchera","tejano music"], add: () => ["mexican music"] },
        { list: ["nueva canción chilena","nueva trova","nuevo cancionero"], add: () => ["nueva canción latinoamericana"] },
        { list: ["bachatón","cubaton","cumbiatón","doble paso","neoperreo","rkt","romantic style"], add: () => ["reggaetón"] },
        { list: ["finnish tango","tango nuevo"], add: () => ["tango"] },
        { list: ["salsa choke","salsa dura","salsa romántica","timba"], add: () => ["salsa"] },
        { list: ["inuit vocal games","tivaner inngernerlu","uaajeerneq"], add: () => ["inuit music"] },
        { list: ["métis fiddling"], add: () => ["métis music"] },
        { list: ["ashkenazi cantorial music"], add: () => ["chazzanut"] },
        { list: ["traditional cajun music"], add: () => ["cajun music"] },
        { list: ["nouveau zydeco"], add: () => ["zydeco"] },
        { list: ["valsa brasileira"], add: () => ["brazilian classical music"] },
        { list: ["arrocha","brega calypso","brega funk","tecnobrega"], add: () => ["brega"] },
        { list: ["arrocha funk","beat bolha","beat fino","brega funk","eletrofunk","funk 150 bpm","funk carioca","funk de bh","funk mandelão","funk melody","funk ostentação","funknejo","mega funk","noiadance","rasteirinha","tecnofunk","trapfunk"], add: () => ["funk brasileiro"] },
        { list: ["tropicália"], add: () => ["mpb"] },
        { list: ["aboio","afoxé","arrocha","axé","baião","banda de pífano","brega funk","cantoria","coco","forró","frevo","manguebeat","maracatu","samba de roda","udigrudi","unakesa","xaxado"], add: () => ["northeastern brazilian music"] },
        { list: ["brega calypso","carimbó","lambada","tecnobrega"], add: () => ["northern brazilian music"] },
        { list: ["batucada","bossa nova","marchinha","pagode","partido alto","samba de breque","samba de gafieira","samba de roda","samba de terreiro","samba-canção","samba-choro","samba-enredo","samba-exaltação","samba-jazz","samba-joia","samba-rock","sambalanço"], add: () => ["samba"] },
        { list: ["rasqueado","sertanejo de raiz","sertanejo romântico","sertanejo universitário"], add: () => ["sertanejo"] },
        { list: ["choro","jongo","marchinha","maxixe","pagode","partido alto","samba de breque","samba de gafieira","samba de terreiro","samba-enredo","tamborzão"], add: () => ["southeastern brazilian music"] },
        { list: ["bandinha","música gaúcha"], add: () => ["southern brazilian music"] },
        { list: ["batuque","coladeira","funaná","morna"], add: () => ["cape verdean music"] },
        { list: ["ambasse bey","assiko","banda music","bend-skin","bikutsi","congolese rumba","kalindula","kilapanga","kizomba","kuduro","makossa","mangambeu","mbenga-mbuti music","mbolé","puxa","semba","soukous","tradi-moderne congolais","twa music","zamrock"], add: () => ["central african music"] },
        { list: ["acholi music","baganda music","benga","beni","bongo flava","comorian music","dinka music","genge","gogo music","inkiranya","kapuka","kidandali","kidumbak","marrabenta","mchiriku","muziki wa dansi","ngoma","omutibo","shilluk music","singeli","soga music","taarab","timbila","twa music"], add: () => ["east african music"] },
        { list: ["kalon'ny fahiny","malagasy folk music","salegy","tsapiky"], add: () => ["malagasy music"] },
        { list: ["amazigh music","egyptian music","maghrebi music","moorish music"], add: () => ["north african music"] },
        { list: ["mahraganat","trap shaabi"], add: () => ["shaabi"] },
        { list: ["pop raï","traditional raï"], add: () => ["raï"] },
        { list: ["afar music","beja music","dinka music","ethiopic music","nubian music","nuer music","oromo music","shilluk music","somali music","welayta music"], add: () => ["northeastern african music"] },
        { list: ["maloya","moutya","santé engagé","séga"], add: () => ["seychelles & mascarene islands music"] },
        { list: ["amapiano","bulawayo jazz","cape jazz","famo","gqom","isicathamiya","jit","kwaito","marabi","maskandi","mbube","motswako","shangaan electro","shona music","southern african folk music","sungura","township bubblegum","township jive","tsonga disco"], add: () => ["southern african music"] },
        { list: ["afro-funk","afro-rock","afrobeat","akan music","balani show","dagomba music","ewe music","fon music","fula music","griot music","gumbe","hausa music","highlife","hipco","hiplife","igbo music","kabye folk music","kru music","mande music","mossi music","songhai music","tradi-moderne ivoirien","wassoulou","wolof music","yoruba music","zouglou"], add: () => ["west african music"] },
        { list: ["aita","ayyalah","samri","shilla"], add: () => ["bedouin music"] },
        { list: ["ayyalah","fijiri","liwa","nuban","samri","sawt","shehhi music","shilla"], add: () => ["khaliji music"] },
        { list: ["dabke","druze music","mūsīqā lubnāniyya"], add: () => ["levantine arabic music"] },
        { list: ["beompae","chöd","shōmyō","tibetan buddhist chant"], add: () => ["buddhist music"] },
        { list: ["altai music","balochi music","bashkir folk music","burushaski folk music","central asian throat singing","hazara folk music","karakalpak traditional music","kazakh music","khakas traditional music","kyrgyz traditional music","mongolian music","pamiri music","pashto folk music","shashmaqam","sufiana kalam","tajik music","tibetan music","turkmen music","uyghur music","uzbek music"], add: () => ["central asian music"] },
        { list: ["kai","mongolian throat singing","tuvan throat singing"], add: () => ["central asian throat singing"] },
        { list: ["bogino duu","buryat folk music","kalmyk music","mongolian throat singing","urtiin duu","zohioliin duu"], add: () => ["mongolian music"] },
        { list: ["ainu music","chinese music","east asian classical music","east asian folk music","japanese music","korean music","manchu music","ryukyuan music","vietnamese music"], add: () => ["east asian music"] },
        { list: ["ainu music","altai music","buryat folk music","chukchi folk music","kai","khakas traditional music","manchu music","mongolian music","nivkh music","ob-ugric folk music","sakha traditional music","samoyedic folk music","tuvan throat singing"], add: () => ["north asian music"] },
        { list: ["adhunik geet","baila","balochi music","bhajan","bhangra","dek bass","dhol tasha","filmi","garba","ginan","indian pop","indo jazz","pop ghazal","rigsar","south asian classical music","south asian folk music","sufi rock","sufiana kalam","vedic chant"], add: () => ["south asian music"] },
        { list: ["bamar music","hill tribe music","indonesian music","khmer music","malay music","molam","philippine music","southeast asian classical music","southeast asian folk music","stereo","thai music","vietnamese music","xinyao"], add: () => ["southeast asian music"] },
        { list: ["balinese gamelan","kecak"], add: () => ["balinese music"] },
        { list: ["gondang","pop batak"], add: () => ["batak music"] },
        { list: ["bantengan","campursari","javanese gamelan","kuda kepang","langgam jawa"], add: () => ["javanese music"] },
        { list: ["pop minang","saluang klasik","talempong"], add: () => ["minangkabau music"] },
        { list: ["gamelan degung","jaipongan","kacapi suling","ketuk tilu","kliningan","pop sunda","tarawangsa","tembang sunda cianjuran"], add: () => ["sundanese music"] },
        { list: ["dikir barat","dondang sayang","malay classical music","malay folk music","pop yeh-yeh"], add: () => ["malay music"] },
        { list: ["armenian music","azerbaijani music","balochi music","caucasian music","gilaki music","iraqi maqam","khaliji music","kurdish music","levantine arabic music","maftirim","mesopotamian music","muzika mizrahit","persian music","turkish music","west asian folk music"], add: () => ["west asian music"] },
        { list: ["caucasian folk music","karachay-balkarian music","rabiz"], add: () => ["caucasian music"] },
        { list: ["muzikat dika'on"], add: () => ["muzika mizrahit"] },
        { list: ["fijian music","hawaiian music","himene tarava","māori music","samoan music","tahitian music"], add: () => ["polynesian music"] },
        { list: ["calipso venezolano","spouge"], add: () => ["calypso"] },
        { list: ["abakuá music","chachachá","changüí","conga","cuban charanga","cubaton","danzón","descarga","filin","guajira","guaracha","habanera","mambo","mozambique","pachanga","pilón","rumba cubana","santería music","son cubano","songo","timba","trova","tumba francesa"], add: () => ["cuban music"] },
        { list: ["bele","biguine","bouyon","cadence lypso","dennery segment","gwo ka","haitian music","kréyol djaz","tumbélé","zouk"], add: () => ["french caribbean music"] },
        { list: ["punta"], add: () => ["garifuna music"] },
        { list: ["baithak gana","chutney","tassa"], add: () => ["indo-caribbean music"] },
        { list: ["dancehall","jamaican ska","mento","nyahbinghi","reggae","rocksteady"], add: () => ["jamaican music"] },
        { list: ["mambo urbano","merecumbé","merengue típico","merenhouse","tecnomerengue"], add: () => ["merengue"] },
        { list: ["bashment soca","chutney soca","dennery segment","power soca","rapso"], add: () => ["soca"] },
        { list: ["requiem"], add: () => ["mass"] },
        { list: ["ambrosian chant","canto beneventano","canto mozárabe","celtic chant","gallican chant","gregorian chant","old roman chant"], add: () => ["plainsong"] },
        { list: ["choral concerto","znamenny chant"], add: () => ["russian orthodox liturgical music"] },
        { list: ["ashkenazi cantorial music","klezmer","yiddish folksong"], add: () => ["ashkenazi music"] },
        { list: ["balkan folk music","balkan pop-folk","entechna","laika","romanţe","yu-mex"], add: () => ["balkan music"] },
        { list: ["ballet de cour","comédie-ballet","opéra-ballet","zarzuela barroca"], add: () => ["baroque music"] },
        { list: ["ballad opera","british brass band","british dance band","british folk rock","change ringing","concertina band","contenance angloise","cornish folk music","english folk music","english pastoral school","music hall","sarum chant","scottish folk music","welsh folk music"], add: () => ["british music"] },
        { list: ["chanson alternative","chanson québécoise","chanson réaliste","chanson à texte","nouvelle chanson française"], add: () => ["chanson"] },
        { list: ["alsatian folk music","german folk music","guggenmusik","lied","liedermacher","ländler","romantische oper","volkstümliche musik","zeitoper"], add: () => ["german music"] },
        { list: ["ancient greek music","byzantine music","entechna","greek folk music","laika"], add: () => ["greek music"] },
        { list: ["basque folk music","catalan folk music","euskal kantagintza berria","nova cançó","portuguese music","spanish music","villancico"], add: () => ["iberian music"] },
        { list: ["bolero español","flamenco","flamenco pop","nueva canción española","rock andaluz","rumba catalana","spanish classical music","spanish folk music","tecnorumba"], add: () => ["spanish music"] },
        { list: ["canto beneventano","canzone d'autore","italian folk music","lauda","old roman chant","opera buffa","opera semiseria","opera seria"], add: () => ["italian music"] },
        { list: ["ars antiqua","ars nova","ars subtilior","contenance angloise","medieval lyric poetry","plainsong"], add: () => ["medieval classical music"] },
        { list: ["dansbandsmusik","dansktop","greenlandic music","nordic folk music","nordic folk rock","rautalanka","visa"], add: () => ["nordic music"] },
        { list: ["kalattut","tivaner inngernerlu","uaajeerneq","vaigat"], add: () => ["greenlandic music"] },
        { list: ["chicago polka","disco polo","mazur","mazurka","miejski folk","poezja śpiewana","polish folk music","polonaise"], add: () => ["polish music"] },
        { list: ["contenance angloise","elizabethan song","franco-flemish school"], add: () => ["renaissance music"] },
        { list: ["manele","muzică de mahala","romanian etno music","romanian folk music","romanţe"], add: () => ["romanian music"] },
        { list: ["avtorskaya pesnya","russian chanson","russian folk music","russian orthodox liturgical music","russian romance"], add: () => ["russian music"] },
        { list: ["vals venezolano","valsa brasileira"], add: () => ["waltz"] },
        { list: ["afro-cuban jazz","argentine music","avanzada","bachata","bailecito","bolero","boogaloo","bullerengue","caporal","carnaval cruceño","champeta","chilean music","chuntunqui romántico","conjunto andino","cuban music","cumbia","currulao","dembow","gaita zuliana","guarania","hispanic american folk music","huayno","latin alternative","latin american classical music","latin disco","latin electronic","latin funk","latin pop","latin rock","latin soul","merengue","mexican music","new mexico music","nueva canción latinoamericana","onda nueva","pasillo","peruvian music","polka paraguaya","porro","purísima","reggaetón","rhumba","rioplatense music","rock andino","salsa","son de pascua","son nica","tamborera","tropicanibalismo","vallenato","vals venezolano","xuc"], add: () => ["hispanic american music"] },
        { list: ["cuarteto","cumbia argentina","guaracha santiagueña","nuevo cancionero","rkt"], add: () => ["argentine music"] },
        { list: ["canto a lo poeta","chilote music","cumbia chilena","jazz guachaca","mambo chileno","música cebolla","música típica chilena","nueva canción chilena","tonada chilena"], add: () => ["chilean music"] },
        { list: ["chimaychi","cumbia peruana","huaylarsh","música criolla peruana","tunantada"], add: () => ["peruvian music"] },
        { list: ["candombe","candombe beat","chamarrita rioplatense","cumbia pop","electrotango","milonga","murga uruguaya","tango"], add: () => ["rioplatense music"] },
        { list: ["nueva canción española","nueva canción latinoamericana"], add: () => ["nueva canción"] },
        { list: ["baguala","harawi","huaylarsh","huayno","morenada","tonada potosina"], add: () => ["indigenous andean music"] },
        { list: ["athabaskan fiddling","inuit music","james bay fiddling","métis music","powwow music","pueblo music"], add: () => ["indigenous north american music"] },
        { list: ["maya music","nahua music","pirekua"], add: () => ["mesoamerican music"] },
        { list: ["shoor"], add: () => ["maddahi"] },
        { list: ["nigun"], add: () => ["hasidic music"] },
        { list: ["ancient levitical music","chazzanut","kriyat hatorah","piyyut"], add: () => ["jewish liturgical music"] },
        { list: ["ladino folksong","maftirim"], add: () => ["sephardic music"] },
        { list: ["jubilee"], add: () => ["barbershop"] },
        { list: ["cosmic country"], add: () => ["country rock"] },
        { list: ["cajun music","new orleans brass band","new orleans r&b","swamp blues","swamp pop","zydeco"], add: () => ["louisiana music"] },
        { list: ["cakewalk","honky-tonk piano","novelty piano","ragtime song","stride"], add: () => ["ragtime"] },
        { list: ["swamp rock","tex-mex"], add: () => ["roots rock"] },
        { list: ["acoustic texas blues","electric texas blues","tejano music","tex-mex"], add: () => ["texan music"] },
        { list: ["fijian music","kaneka","lokal musik","papuan folk music","tolai rock"], add: () => ["melanesian music"] },
        { list: ["kantan chamorrita"], add: () => ["micronesian music"] },
        { list: ["brazilian classical music","brazilian folk music","brega","dobrado","funk brasileiro","mpb","northeastern brazilian music","northern brazilian music","rock rural","samba","sertanejo","southeastern brazilian music","southern brazilian music","xote"], add: () => ["brazilian music"] },
        { list: ["african folk music","afro-jazz","cape verdean music","central african music","east african music","malagasy music","north african music","northeastern african music","seychelles & mascarene islands music","southern african music","west african music"], add: () => ["african music"] },
        { list: ["ancient chinese music","ancient egyptian music","ancient greek music","ancient levitical music","ancient roman music","hyang-ak","mesopotamian music"], add: () => ["ancient music"] },
        { list: ["al-jadīd","algerian chaabi","arabic classical music","arabic folk music","arabic jazz","arabic pop","bedouin music","khaliji music","levantine arabic music","orkes gambus","raï","shaabi","zajal"], add: () => ["arabic music"] },
        { list: ["buddhist music","central asian music","east asian music","ghazal","north asian music","south asian music","southeast asian music","west asian music"], add: () => ["asian music"] },
        { list: ["balinese music","batak music","igorot music","indigenous taiwanese music","javanese music","malagasy music","malay music","minangkabau music","pakacaping music","polynesian music","sundanese music"], add: () => ["austronesian music"] },
        { list: ["aleke","bachata","brukdown","bullerengue","calypso","caribbean folk music","champeta","cuban music","cumbia colombiana","dembow","french caribbean music","garifuna music","goombay","indo-caribbean music","jamaican music","junkanoo","kaseko","merengue","palo de mayo","parang","porro","soca","steel band","tropicanibalismo","vallenato"], add: () => ["caribbean music"] },
        { list: ["brukdown","cumbia salvadoreña","garifuna music","palo de mayo","purísima","son de pascua","son nica","tamborera","tamborito","xuc"], add: () => ["central american music"] },
        { list: ["anglican chant","armenian church music","byzantine chant","coptic music","ethiopian church music","kyivan chant","mass","passion","plainsong","russian orthodox liturgical music","seinn nan salm","syriac chant"], add: () => ["christian liturgical music"] },
        { list: ["alpenrock","ancient roman music","anglican chant","ashkenazi music","balkan music","baroque music","baroque suite","british music","caucasian music","celtic electronica","celtic metal","celtic new age","celtic punk","celtic rock","chanson","classical period","country & irish","crimean tatar music","dechovka","dutch cabaret","european folk music","fanfare","finnish tango","german music","grand opéra","greek music","iberian music","irish showband","italian music","kabarett","kalmyk music","kleinkunst","kyivan chant","madrigal","medieval classical music","mittelalter-metal","mittelalter-rock","mulatós","mélodie","nordic music","nòva cançon","opéra-comique","polish music","renaissance music","romanian music","russian music","schlager","singspiel","tragédie en musique","trampská hudba","verismo","waltz"], add: () => ["european music"] },
        { list: ["canción melódica","hispanic american music","murga","nueva canción","philippine rondalla","romance","spanish music"], add: () => ["hispanic music"] },
        { list: ["garifuna music","indigenous american traditional music","indigenous andean music","indigenous north american music","mesoamerican music"], add: () => ["indigenous american music"] },
        { list: ["ginan","jilala music","maddahi","mataali","nasheed","rapai dabõih","turkish mevlevi music"], add: () => ["islamic religious music & recitation"] },
        { list: ["ashkenazi music","hasidic music","jewish liturgical music","muzika mizrahit","muzika yehudit mekorit","oriental jewish music","orthodox pop","sephardic music"], add: () => ["jewish music"] },
        { list: ["ambient americana","american folk music","american primitivism","americana","barbershop","boogie woogie","canadian folk music","chanson québécoise","chicago polka","coon song","country","country rock","cowboy poetry","greenlandic music","hapa haole","indigenous north american music","louisiana music","minstrelsy","new mexico music","pep band","ragtime","roots rock","sacred steel","shaker music","southern gospel","texan music","tin pan alley","vaudeville"], add: () => ["northern american music"] },
        { list: ["australian folk music","indigenous australian traditional music","melanesian music","micronesian music","pacific reggae","polynesian music"], add: () => ["oceanian music"] },
        { list: ["ars nova","ars subtilior","cante alentejano","cantu a tenore","contenance angloise","ganga","himene tarava","izvorna bosanska muzika","lab polyphony","madrigal","paghjella","seto leelo","sutartinės","tosk polyphony","trallalero"], add: () => ["polyphonic chant"] },
        { list: ["aleke","argentine music","avanzada","bailecito","baithak gana","bambuco","brazilian music","bullerengue","calipso venezolano","caporal","carnaval cruceño","carranga","chacarera","chamamé","champeta","chilean music","chuntunqui romántico","conjunto andino","cueca","cumbia colombiana","currulao","gaita zuliana","guarania","indigenous andean music","joropo","kaseko","malagueña venezolana","mapuche folk music","muliza","música llanera","onda nueva","pasillo","payada","peruvian music","polka paraguaya","porro","rioplatense music","rock andino","salsa choke","saya","taquirari","tecnomerengue","vallenato","vals venezolano","yaraví","zamacueca","zamba"], add: () => ["south american music"] },
        { list: ["banga","jilala music","kafi","manzuma","qawwali","rapai dabõih","sufi rock","sufiana kalam","turkish mevlevi music"], add: () => ["sufi music"] },
        { list: ["altai music","bashkir folk music","central asian throat singing","karakalpak traditional music","khakas traditional music","kyrgyz traditional music","mongolian music","sakha traditional music"], add: () => ["turkic-mongolic music"] },
        //{ list: ["african music","ancient music","arabic music","asian music","austronesian music","caribbean music","central american music","christian liturgical music","european music","hispanic music","indigenous american music","islamic religious music & recitation","jewish music","maqāmic music","northern american music","oceanian music","polyphonic chant","prehistoric music","south american music","sufi music","traditional folk music","turkic-mongolic music"], add: () => ["regional music"] },
        // --- ROCK ---
        { list: ["shitgaze"], add: () => ["slacker rock"] },
        { list: ["c86","dolewave","dunedin sound","garage rock revival","indie surf","math pop","midwest emo","new rave","noise pop","post-punk revival","slacker rock","slowcore","twee pop"], add: () => ["indie rock"] },
        { list: ["brutal prog","zeuhl"], add: () => ["avant-prog"] },
        { list: ["neo-canterbury"], add: () => ["canterbury scene"] },
        { list: ["psychobilly"], add: () => ["rockabilly"] },
        { list: ["eleki","rautalanka","wong shadow"], add: () => ["surf rock"] },
        { list: ["alternative dance","baggy","britpop","dream pop","emo-pop","geek rock","grunge","indie rock","jangle pop","mall screamo","post-britpop","post-grunge","shimokita-kei","shoegaze"], add: () => ["alternative rock"] },
        { list: ["boogie rock"], add: () => ["blues rock"] },
        { list: ["xian psych"], add: () => ["christian rock"] },
        { list: ["avant-prog","krautrock"], add: () => ["experimental rock"] },
        { list: ["alpenrock","british folk rock","celtic rock","mittelalter-rock","nordic folk rock","phleng phuea chiwit","pinoy folk rock","rock rural"], add: () => ["folk rock"] },
        { list: ["funk metal"], add: () => ["funk rock"] },
        { list: ["frat rock","freakbeat","garage psych","garage punk","garage rock revival"], add: () => ["garage rock"] },
        { list: ["glam punk"], add: () => ["glam rock"] },
        { list: ["beatdown hardcore","easycore","noisecore","post-hardcore","sass"], add: () => ["hardcore punk"] },
        { list: ["glam metal","heavy psych","occult rock","stoner rock"], add: () => ["hard rock"] },
        { list: ["jamgrass","livetronica"], add: () => ["jam band"] },
        { list: ["math pop"], add: () => ["math rock"] },
        { list: ["2 tone","beat rock","mod revival"], add: () => ["new wave"] },
        { list: ["pigfuck","shitgaze"], add: () => ["noise rock"] },
        { list: ["avant-prog","canterbury scene","neo-prog","symphonic prog"], add: () => ["progressive rock"] },
        { list: ["rap metal"], add: () => ["rap rock"] },
        { list: ["indorock","rockabilly","twist"], add: () => ["rock & roll"] },
        { list: ["indie surf","surf punk","surf rock","vocal surf"], add: () => ["surf music"] },
        //{ list: ["acoustic rock","afro-rock","alternative rock","anatolian rock","aor","art punk","art rock","bard rock","blues rock","british rhythm & blues","candombe beat","christian rock","comedy rock","country rock","cowpunk","deutschrock","emo","experimental rock","folk rock","funk rock","garage rock","glam rock","hard rock","hardcore [punk]","heartland rock","industrial rock","jam band","jazz-rock","jersey shore sound","latin rock","manguebeat","math rock","metal","miejski folk","new wave","noise rock","pop rock","post-punk","post-rock","progressive rock","proto-punk","psychedelic rock","pub rock","punk blues","punk rock","rap rock","reggae rock","rock & roll","rock andaluz","rock andino","rock musical","rock opera","roots rock","southern rock","sufi rock","surf music","symphonic rock","tolai rock","zolo"], add: () => ["rock"] },
        // --- SCENES ---
        { list: ["praise break"], add: () => ["praise & worship"] },
        { list: ["j-euro"], add: () => ["wa euro"] },
        { list: ["h8000","hardline"], add: () => ["vegan straight edge"] },
        { list: ["praise & worship","urban contemporary gospel"], add: () => ["ccm"] },
        { list: ["cantopop","gufeng","hokkien pop","mandopop","zhongguo feng"], add: () => ["c-pop"] },
        { list: ["touhou music"], add: () => ["doujin music"] },
        { list: ["bronx drill","brooklyn drill"], add: () => ["east coast hip hop"] },
        { list: ["ladbroke grove scene"], add: () => ["english underground"] },
        { list: ["alternative idol"], add: () => ["japanese idol"] },
        { list: ["future core"], add: () => ["j-core"] },
        { list: ["mod revival"], add: () => ["mod"] },
        { list: ["grand opéra","new german school","romantische oper"], add: () => ["romanticism"] },
        { list: ["haight-ashbury scene"], add: () => ["san francisco sound"] },
        { list: ["akishibu-kei","picopop"], add: () => ["shibuya-kei"] },
        { list: ["south florida soundcloud rap"], add: () => ["southern hip hop"] },
        { list: ["krishnacore","vegan straight edge","youth crew"], add: () => ["straight edge"] },
        { list: ["kote kei","nagoya kei","soft visual"], add: () => ["visual kei"] },
        { list: ["utaite"], add: () => ["vocaloid scene"] },
        { list: ["otomad"], add: () => ["ytpmv"] },
        { list: ["rabm"], add: () => ["black metal"] },
        // { list: ["afrofuturism","akron sound","alté","anarcho-punk","asian underground","aussie pub rock","bay area thrash metal","beach music","beijing new sound","bernese dialect scene","bloghouse","bosstown sound","bristol sound","british rhythm & blues","british trad jazz","britpop","brno alternative scene","brony music","burger-highlife","bérite club","c-pop","campus folk","canterbury scene","cascadian black metal","cbgb scene","ccm","chicago no wave","chicago school","christian hardcore","cleveland punk","clube da esquina","cocktail nation","dariacore","darmstadt school","dek bass","demoscene","desi hip hop","deutschrock","dolewave","donosti sound","doujin music","dunedin sound","düsseldorf school","east coast hip hop","emo revival","english underground","epadunk","filk","first wave of detroit techno","florida fast music","fort thunder scene","franco-flemish school","frapcore","free noise","french hip hop","friese bries","furry music","futurism","gothenburg sound","grebo","greenwich village scene","group sounds","hamburger schule","harlem renaissance","hauntology","hellenic black metal","high quality rip","hip-hopolo","hipco","hoboken sound","holy terror","j-core","j-pop","japanese hardcore","japanese hip hop","japanese idol","jersey shore sound","jovem guarda","k-pop","kansai no wave","kawaii metal","la beat scene","laurel canyon scene","leningrad rock club scene","little band scene","loft jazz","louisville sound","madchester","maidcore","manguebeat","manila sound","mentai rock","merseybeat","minneapolis sound","mod","moscow school","motswako","movida madrileña","młoda polska","nardcore","nederbeat","nerdcore hip hop","nerdcore techno","neue deutsche welle","neue volksmusik","new brunswick basement scene","new london jazz","new music","new orleans blues","new partisans","new pop","new primitivism","new romantic","new tone","new wave of new wave","new way of danish fuck you","new weird america","new weird finland","new york hardcore","no wave","nola sludge","northern gothic","northern soul","nova srpska scena","nova vanguarda paulistana","novaya scena","novo dub","nueva canción","nueva ola","nwobhm","onkyo","opm","p-pop","paisley underground","palm desert scene","pop kreatif","pop yeh-yeh","positive punk","progg","psichedelia occulta italiana","psychsploitation","q-pop","queercore","rabm","red dirt","revolution summer","riot grrrl","road rap","rock barrial","rock in opposition","rock radical vasco","rock subterráneo","rock sónico","rock urbano español","rock urbano mexicano","romanticism","russemusikk","san francisco sound","scottish folk revival","seapunk","second british folk revival","second viennese school","shibuya-kei","shimokita-kei","siberian punk","soundclown","southern hip hop","sovietwave","straight edge","sunset strip glam metal","swing revival","t-pop","taqwacore","teutonic thrash metal","texas psychedelia scene","the wave","tontipop","tropicanibalismo","tropicália","trova rosarina","udigrudi","uk hip hop","uk82","ultra","urban grooves","v-pop","vanguarda paulista","vietnamese new wave","visual kei","vixa","vocaloid scene","voëlvry movement","warez scene","west coast hip hop","west coast sound of holland","west side sound","windmill scene","wizard rock","women's music movement","xibei feng","yass","ytpmv","yugoslav new wave","zamrock","zimdancehall","česká alternativní scéna","česká nová vlna","český underground"], add: () => ["scenes & movements"] },
        // --- SINGER & SONGW. ---
        { list: ["avtorskaya pesnya","canzone d'autore","chanson à texte","euskal kantagintza berria","kleinkunst","liedermacher","música de intervenção","nova cançó","nueva canción","nòva cançon","poezja śpiewana","trova"], add: () => ["singer-songwriter"] },
        // --- SPOKEN WORD ---
        { list: ["beat poetry","cowboy poetry","dub poetry","jazz poetry","punk poetry","slam poetry","sound poetry"], add: () => ["poetry"] },
        { list: ["sermons"], add: () => ["speeches"] },
        { list: ["fairy tales","folktales","guided meditation","interview","lectures","poetry","radio drama","speeches","stand-up comedy"], add: () => ["spoken word"] },
        // --- EXTRA ---
        { list: ["batonebi songs"], add: () => ["lullabies"] },
        { list: ["fairy tales","lullabies","nursery rhymes"], add: () => ["children's music"] },
        { list: ["comedy rap","comedy rock","scrumpy and western"], add: () => ["musical comedy"] },
        { list: ["break-in","dutch cabaret","kabarett","musical comedy","prank calls","sketch comedy","stand-up comedy"], add: () => ["comedy"] },
        { list: ["ethereal wave","neoclassical darkwave","neue deutsche todeskunst"], add: () => ["darkwave"] },
        { list: ["bird sounds","insect sounds","whale song"], add: () => ["animal sounds"] },
        { list: ["animal sounds","rain sounds"], add: () => ["nature recordings"] },
        { list: ["nature recordings","radio broadcast recordings"], add: () => ["field recordings"] },
        { list: ["country gospel","jubilee","praise break","sacred steel","southern gospel","traditional black gospel","urban contemporary gospel"], add: () => ["gospel"] },
        { list: ["bhajan","lauda","purísima","sacred harp singing"], add: () => ["hymns"] },
        { list: ["tibetan buddhist chant","vedic chant"], add: () => ["mantra"] },
        { list: ["circus march","dobrado","funeral march"], add: () => ["march"] },
        { list: ["beni","drum and bugle corps","drumline","fife and drum corps","guggenmusik","pep band","pipe band"], add: () => ["marching band"] },
        { list: ["battle record","binaural beats","broadband noise"], add: () => ["sound effects"] },
    ];

    function buildTags(genres) {

       // 0) Look for "Released"
       let year = "";
       for (const row of document.querySelectorAll('table.album_info tr')) {
           if (row.querySelector('th.info_hdr')?.textContent.includes('Released')) {
               year = row.querySelector('td')?.textContent.match(/\b\d{4}\b/g)?.pop() || "";
               break;
           }
       }

       // 1) First layer of tags
       let tags = [year, ...[...genres].map(g => g.innerText.toLowerCase())];

       const activeGroupMap = GROUP_MAP;

        // 2) Complex mapping
        function applyGroup() {
            activeGroupMap.forEach(group => {
                if (group.list.some(x => tags.includes(x))) {
                    tags.push(...group.add(year));
                }
            });
        }

       // 3) Waterfall
       let changed = true;
       while (changed) {
           const before = tags.length;
           applyGroup();
           tags = removeDuplicates(tags);
           changed = tags.length !== before;
       }

       tags = removeDuplicates(tags);

       const combined = tags.join(", ");

       document.querySelector('[id^=tags_text_l_]').innerText = combined;
       document.querySelector('input[id^=tags_l_]').value = combined;

       const saveBtn = document.querySelector('.tag_save');
       if (saveBtn) saveBtn.click();
   }

    function addButtons() {
        const catalogDiv = document.querySelector('div.my_catalog_catalog');
        if (!catalogDiv) return;

        const makeBtn = (label, handler) => {
            const b = document.createElement('div');
            b.innerText = label;
            b.className = "btn blue_btn btn_small";
            b.addEventListener('click', handler);
            return b;
        };

       const btnMain = makeBtn("Primary", () => {
           const genres = Array.from(document.querySelectorAll('.release_pri_genres > .genre'))
           .filter(el => {
               const header = el.closest('tr')?.querySelector('th')?.textContent ?? '';
               return !header.includes('Scenes') && !header.includes('Movements');
           });
           buildTags(genres);
       });

        const btnMainSec = makeBtn("Pri + Sec", () => {
            const genres = Array.from(document.querySelectorAll('.release_pri_genres > .genre, .release_sec_genres > .genre'))
            .filter(el => {
                const header = el.closest('tr')?.querySelector('th')?.textContent ?? '';
                return !header.includes('Scenes') && !header.includes('Movements');
            });
            buildTags(genres);
        });

        const IDAlbum = document.querySelector('#column_container_right .album_title input').value.match(/\d+/)[0];

        const btnExclude = makeBtn("Exclude from upcomings", () => {
            rym.request.post("AddUpcomingExclusion", { object: 'release', assoc_id: IDAlbum }, null, "script");
        });

        catalogDiv.after(btnMain);
        btnMain.after(btnMainSec);
    }

    addButtons();

  // My catalog
(function() {

    function extractLabelsWithCounts() {
        const nodes = [...document.querySelectorAll('ul.issues li[id^="issue_"] .issue_label a.label')];

        if (!nodes.length) return null;

        const map = new Map();
        const seenIssues = new Set();

        nodes.forEach(a => {
            const li = a.closest('li[id^="issue_"]');
            const issueId = li.id;

            if (seenIssues.has(issueId)) return;
            seenIssues.add(issueId);

            const title = a.getAttribute("title");
            if (title === "[Label897]") return;

            const href = a.getAttribute("href");
            const name = a.textContent.trim();

            if (!map.has(href)) {
                map.set(href, { name, href, count: 1 });
            } else {
                map.get(href).count++;
            }
        });

        return [...map.values()];
    }


    function getIssueCount() {
        const h2s = [...document.querySelectorAll("h2")];
        for (const h of h2s) {
            const text = h.textContent.trim();
            const match = text.match(/^(\d+)\s+Issues?$/i);
            if (match) return parseInt(match[1], 10);
        }
        return null;
    }

    function moveCatalogIntoTable() {
        const table = document.querySelector('.album_info tbody');
        const catalog = document.querySelector('.release_my_catalog');
        if (!table || !catalog) return false;

        if (table.querySelector('.rym-integrated')) return true;

        const allButtons = [...catalog.querySelectorAll(".btn.blue_btn.btn_small")];
        const btn1 = allButtons[0] || null;
        const btn2 = allButtons[1] || null;
        const btn3 = allButtons[2] || null;

        const LABELS = extractLabelsWithCounts();
        const ISSUE_COUNT = getIssueCount();

        const ROWS = [
            ["My Rating", [".my_catalog_rating"]],
            ["Autotags", ["__BTN1__", "__BTN2__"]],
            ["Tags", [".my_catalog_tags"]],
        ];

        if (LABELS && LABELS.length) {
            ROWS.push([`Labels\n(Total issues: ${ISSUE_COUNT})`, ["__LABELS__"]]);
        }

        ROWS.push(
            ["List", ["#addtolist"]],
            ["Catalog", ["__BTN3__","__COPY_WISHLIST_BTN__","__COPY_NOTCOLLECTED_BTN__",".my_catalog_catalog", ".my_catalog_format"]],
            ["Misc", [".my_catalog_listening",".my_catalog_review",".my_catalog_rate_tracks",".my_catalog_more",".my_catalog_bump"]]
        );

        ROWS.forEach(([label, selectors]) => {

            const tr = document.createElement('tr');
            tr.className = 'rym-integrated';

            const th = document.createElement('th');
            th.className = 'info_hdr';
            if (typeof label === "string" && label.includes("\n")) {
                const [line1, line2] = label.split("\n");
                th.innerHTML = `${line1}<br><span class="rym-issues-count">${line2}</span>`;
            } else {
                th.textContent = label;
            }

            const td = document.createElement('td');
            td.colSpan = 2;

            selectors.forEach(sel => {

                if (sel === "__BTN1__" && btn1) return td.appendChild(btn1);
                if (sel === "__BTN2__" && btn2) return td.appendChild(btn2);
                if (sel === "__BTN3__" && btn3) return td.appendChild(btn3);

                if (sel === "__LABELS__" && LABELS) {
                    LABELS.forEach((obj, i) => {
                        const a = document.createElement("a");
                        a.className = "label";
                        a.href = obj.href;
                        a.textContent = `${obj.name} (${obj.count})`;

                        td.appendChild(a);

                        if (i < LABELS.length - 1) {
                            td.appendChild(document.createTextNode(", "));
                        }
                    });
                    return;
                }

                if (sel === "__COPY_WISHLIST_BTN__") {
                    const original = document.querySelector("#catalog_btn_w");
                    if (original) {
                        const clone = original.cloneNode(true);
                        clone.id = "catalog_btn_w_clone"; // no duplicates
                        clone.classList.remove("catalog_btn_option", "2btn");
                        clone.classList.add("btn", "blue_btn", "btn_small");
                        td.appendChild(clone);
                    } else {
                        td.textContent = "Wishlist button not found";
                    }
                    return;
                }

                if (sel === "__COPY_NOTCOLLECTED_BTN__") {
                    const original = document.querySelector("#catalog_btn_n");
                    if (original) {
                        const clone = original.cloneNode(true);
                        clone.id = "catalog_btn_n_clone"; // no duplicates
                        clone.classList.remove("catalog_btn_option", "2btn");
                        clone.classList.add("btn", "blue_btn", "btn_small");
                        td.appendChild(clone);
                    } else {
                        td.textContent = "Not collected button not found";
                    }
                    return;
                }

                let block = catalog.querySelector(sel);
                if (!block) block = document.querySelector(sel);
                if (block) td.appendChild(block);
            });

            tr.appendChild(th);
            tr.appendChild(td);
            table.appendChild(tr);
        });

        return true;
    }

    const interval = setInterval(() => {
        if (moveCatalogIntoTable()) {
            clearInterval(interval);
        }
    }, 200);

})();

})();
