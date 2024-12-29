

export default class Tile {
    #tileElement
    #x
    #y
    #value
    #image

    constructor(tileContainer, value = Math.random() > 0.5 ? 4 : 2, imageMap = {
        2: '../images/2.png',
        4: '../images/4.png',
        8: '../images/8.png',
        16: '../images/16.png',
        32: '../images/32.png',
        64: '../images/64.png',
        128: '../images/128.png',
        256: '../images/256.png',
        512: '../images/512.png',
        1024: '../images/1024.png',
    }) {
        this.#tileElement = document.createElement('div');
        this.#tileElement.classList.add('tile-class');
        tileContainer.append(this.#tileElement);
        
        this.imageMap = imageMap; // mapping values to images
        this.value = value;
    }

    get value() {
        return this.#value;
    }

    set value(v) {
        this.#value = v;
        this.updateTile();  // Update tile appearance based on value/image
    }

    set x(value) {
        this.#x = value;
        this.#tileElement.style.setProperty('--x', value);
    }

    set y(value) {
        this.#y = value;
        this.#tileElement.style.setProperty('--y', value);
    }

    remove() {
        console.log("removing tile")
        this.#tileElement.remove();
    }

    waitForTransition(animation = false) {
        return new Promise(resolve => {
            this.#tileElement.addEventListener(
                animation ? "animationend" : "transitionend", 
                resolve, {
                once: true
            });
        })
    }

    updateTile() {
        const power = Math.log2(this.#value);
        const backgroundLightness = 100 - power * 9;

        this.#tileElement.style.setProperty(
            "--background-lightness",
            `${backgroundLightness}%`
        );

        this.#tileElement.style.setProperty(
            "--text-lightness",
            `${backgroundLightness <= 50 ? 90 : 10}%`
        );

        // If an image for the value exists, use it, otherwise fallback to text
        if (this.imageMap[this.#value]) {
            this.#tileElement.style.backgroundImage = `url(${this.imageMap[this.#value]})`;
            this.#tileElement.textContent = '';  // Hide text
        } else {
            this.#tileElement.style.backgroundImage = '';  // Remove any image
            this.#tileElement.textContent = this.#value; // Show value as text
        }
    }
}
