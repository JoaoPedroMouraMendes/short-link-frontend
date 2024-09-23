const form = document.getElementById("short-link-form") as HTMLFormElement
const text = document.getElementById("short-link-text") as HTMLInputElement
const QRCodeInput = document.getElementById("short-link-qrcode") as HTMLInputElement
const QRCodeImage = document.getElementById("qr-code") as HTMLImageElement
const shortLinkArea = document.getElementById("short-link-area") as HTMLParagraphElement
const copyButton = document.getElementById("copy-button") as HTMLButtonElement
const responseContainer = document.getElementById("response-container") as HTMLDivElement
const loader = document.getElementById("loader") as HTMLSpanElement
// @ts-ignore
const errorModal = new bootstrap.Modal(document.getElementById('error-modal'))

type PostShortURLResponse = {
    id: string,
    originalURL: string,
    shortURL: string,
    createdAt: string,
    qrcode: string
}

form.addEventListener("submit", async (e) => {
    e.preventDefault()

    // Oculta as respostas anteriores
    if (!responseContainer.classList.contains("d-none")) {
        QRCodeImage.src = ""
        shortLinkArea.textContent = ""

        responseContainer.classList.add("d-none")
    }

    // Não executa o script caso 'text' esteja vazio
    if (text?.value == "") return

    // Habilita o loader
    loader.classList.remove("d-none")

    try {
        const data: PostShortURLResponse | undefined = await fetch(`http://localhost:8080`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ original_url: text.value })
        }).then(response => response.json()).catch(error => console.log(error))

        if (data == undefined) {
            // Remove o loader
            loader.classList.add("d-none")
            throw new Error("data not found")
        }

        // Habilita o container com as tags para resposta
        responseContainer.classList.remove("d-none");

        // Caso o usuário tenha pedido um qr code
        if (QRCodeInput.checked)
            QRCodeImage.src = `data:image/png;base64,${data.qrcode}`

        // Adiciona a URL curta
        shortLinkArea.textContent = data.shortURL
        // Deixa o input vazio
        text.value = ""

        // Remove o loader
        loader.classList.add("d-none")
    } catch (error) {
        errorModal.show()
    }
})


copyButton.addEventListener("click", () => {
    // Copia o texto
    navigator.clipboard.writeText(shortLinkArea.innerHTML)

    // Animação de quando o texto é copiado
    if (copyButton.firstChild != null) {
        const copyIcon = copyButton.getElementsByClassName("bi-clipboard")[0]
        if (copyIcon == null) return
        copyIcon.classList.remove("bi-clipboard")
        copyIcon.classList.add("bi-check-lg")
        setTimeout(() => {
            copyIcon.classList.remove("bi-check-lg")
            copyIcon.classList.add("bi-clipboard")
        }, 1000)
    }
})