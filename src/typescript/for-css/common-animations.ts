const typewriter = document.querySelectorAll(".typewriter-content") as NodeListOf<HTMLElement>

class Writer {
    currentPhraseIndex: number = 0
    currentLetterIndex: number = 0
    typeSpeed: number = 100
    deleteSpeed: number = 50
    delayBetweenPhrases: number = 1000
    isDeleting: boolean = false
    phrases: string[]
    element: Element

    constructor(phrases: string[], element: Element) {
        this.phrases = phrases
        this.element = element
    }

    type = () => {
        if (this.phrases == null) return
        const currentPhrase: string = this.phrases[this.currentPhraseIndex]
        // Deletando frases
        if (this.isDeleting) {
            this.element.textContent = currentPhrase.substring(0, this.currentLetterIndex - 1);
            this.currentLetterIndex--;
    
            if (this.currentLetterIndex === 0) {
                this.isDeleting = false
                this.currentPhraseIndex = (this.currentPhraseIndex + 1) % this.phrases.length;
                setTimeout(() => this.type(), this.delayBetweenPhrases)
            } else {
                setTimeout(() => this.type(), this.deleteSpeed)
            }
        } 
        // Escrevendo frases
        else {
            this.element.textContent = currentPhrase.substring(0, this.currentLetterIndex + 1)
            this.currentLetterIndex++
    
            if (this.currentLetterIndex === currentPhrase.length) {
                this.isDeleting = true
                setTimeout(() => this.type(), this.delayBetweenPhrases)
            } else {
                setTimeout(() => this.type(), this.typeSpeed)
            }
        }
    }
}

typewriter.forEach((element) => {
    // Obtem as frases desejadas
    const phrases = element.textContent?.split(";")
    // Remove as frases e deixa apenas um espaço para calcular da tag
    element.textContent = "."
    element.style.minHeight = element.clientHeight.toString() + "px"

    element.textContent = ""

    // Invoca o controlador para ficar digitando as frases
    if (phrases != null)
        new Writer(phrases, element).type()
})

