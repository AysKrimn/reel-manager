const base_path = "./materials"
const get_source = (name_extension) => `${base_path}/${name_extension}`
const reels = [
    { src: get_source("king.png"), alt: 'King', rate: 1 },
    { src: get_source("queen.png"), alt: 'Queen', rate: 5 },
    { src: get_source("elite.png"), alt: 'Elite Wild', rate: 7 },
    { src: get_source("horse_knight.png"), alt: 'Horse Knight', rate: 8 },
    { src: get_source("knight.png"), alt: 'Knight', rate: 10 },
    { src: get_source("archer.png"), alt: 'Archer', rate: 11},
    { src: get_source("skull_knight.png"), alt: 'Skull', rate: 10 },
    { src: get_source("orc.png"), alt: 'Orc', rate: 10 }
];

function getRandomImage() {
    const rand = Math.random() * 100;
    let sum = 0;
    for (const reel of reels) {
        sum += reel.rate;
        if (rand <= sum) {
            console.log("reel:", reel, "probabibility:", reel.rate, "total:", sum)
            return reel;
        }
    }
    // return images[images.length - 1];
    return getRandomImage()
}

function spin() {
    // classları temizle
    document.querySelectorAll(".zone").forEach(element => element.classList.remove("winning-zone"))
    
    const slots = [
        ['slot1-1', 'slot1-2', 'slot1-3', 'slot1-4', 'slot1-5'],
        ['slot2-1', 'slot2-2', 'slot2-3', 'slot2-4', 'slot2-5'],
        ['slot3-1', 'slot3-2', 'slot3-3', 'slot3-4', 'slot3-5']
        
    ];

    // const slots = []

    // document.querySelectorAll(".scene .zone").forEach(element => slots.push(element.id))

    console.log("SLOTS:", slots)

    const results = [];

    for (let i = 0; i < slots.length; i++) {
        results[i] = [];
        for (let j = 0; j < slots[i].length; j++) {

            const image = getRandomImage();
            const imageElement = document.getElementById(slots[i][j])

            imageElement.innerHTML = `<img src="${image.src}" alt="${image.alt}">`;
            imageElement.title = image.alt

            results[i][j] = image.alt;

        }
    }

    console.log("rezults:",results)
    checkWin(results);
}

function checkWin(results) {
    // 5 satır var ve aşağıdaki kombinasyon 5 satırı 3er olacak şekilde kontrol eter
    // 0, 0 = 1. makaranın 1. satırı, 0,1 ise 1. makaranın 2. sütununu kontrol eder.

    const paylines = [
        // Horizontal paylines (Yatay)
        // 1. satır (olasılıklar)
        [[0, 0], [0, 1], [0, 2]],
        [[0, 1], [0, 2], [0, 3]],
        [[0, 2], [0, 3], [0, 4]],
        // // 2. yatay satır olasılıklar
        [[1, 0], [1, 1], [1, 2]],
        [[1, 1], [1, 2], [1, 3]],
        [[1, 2], [1, 3], [1, 4]],
        // // 3. yatay satır olasılıklar
        [[2, 0], [2, 1], [2, 2]],
        [[2, 1], [2, 2], [2, 3]],
        [[2, 2], [2, 3], [2, 4]],

        // Vertical paylines (Dikey)
        [[0, 0], [1, 0], [2, 0]],
        [[0, 1], [1, 1], [2, 1]],
        [[0, 2], [1, 2], [2, 2]],
        [[0, 3], [1, 3], [2, 3]],
        [[0, 4], [1, 4], [2, 4]],
        // çapraz
        [[0, 0], [1, 1], [2, 2]], 
        [[0, 2], [1, 1], [2, 0]], 
        [[0, 2], [1, 3], [2, 4]], 
        [[0, 4], [1, 3], [2, 2]],
        //  zigzag
        [[0, 0], [1, 1], [0, 2]], 
        [[0, 1], [1, 2], [0, 3]], 
        [[0, 2], [1, 3], [0, 4]],
        [[1, 0], [0, 1], [1, 2]], 
        [[1, 1], [0, 2], [1, 3]], 
        [[1, 2], [0, 3], [1, 4]],
        [[2, 0], [1, 1], [2, 2]], 
        [[2, 1], [1, 2], [2, 3]], 
        [[2, 2], [1, 3], [2, 4]],
        [[0, 2], [1, 1], [2, 0]], 
        [[0, 3], [1, 2], [2, 1]], 
        [[0, 4], [1, 3], [2, 2]]
        
        ];

    const result_zone = document.querySelector('#result ul');
    // temizle
    result_zone.textContent = ""

    let win = false;

    for (const line of paylines) {
        // const [a, b, c] = line.map(([x, y]) => results[x][y]);
        // console.log("1. set:", a, "2. set:", b, "3. set:", c)
        console.log("LINE:", line)
        const symbols = line.map(([x, y]) =>  results[x][y] );
        console.log("Set:", symbols)

        const nonWildSymbols = new Set(symbols.filter(symbol => symbol !== 'Elite Wild')); // Jokerleri set dışında tut
        const wildCount = symbols.filter(symbol => symbol === 'Elite Wild').length;

        // Eğer jokerler hariç diğer simgelerden sadece bir tane varsa ve toplamda 3 kart varsa
        if (nonWildSymbols.size === 1 || nonWildSymbols.size === 2 && symbols.length - wildCount <= 1) {

             line.map(([x, y]) => {
                const id = `slot${x + 1}-${y + 1}`;
                const element = document.getElementById(id)
                console.log("DENK GELEN SLOT:", id, "html:", element)
                // add class
                element.classList.add("winning-zone")
                
                result_zone.innerHTML += `<li>Denk gelen parça bilgisi: ${x + 1}. satır , ${y + 1}. sütun </li>`
            });

            win = true;
            break;
        }
    }

    if (win === false) {
        result_zone.textContent = 'Tekrar dene';
    }
}