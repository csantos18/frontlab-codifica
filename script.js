const ctaButton = document.querySelector("#ctaButton");
const ctaMessage = document.querySelector("#ctaMessage");
const contactForm = document.querySelector("#contactForm");
const formMessage = document.querySelector("#formMessage");
const cepInput = document.querySelector("#cep");
const addressResult = document.querySelector("#addressResult");
const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

function setMessage(element, text, isError = false) {
  if (!element) {
    return;
  }

  element.textContent = text;
  element.classList.toggle("error", isError);
}

function onlyNumbers(value) {
  return value.replace(/\D/g, "");
}

function formatCep(value) {
  const numbers = onlyNumbers(value).slice(0, 8);

  if (numbers.length > 5) {
    return `${numbers.slice(0, 5)}-${numbers.slice(5)}`;
  }

  return numbers;
}

async function searchCep(cep) {
  const cleanCep = onlyNumbers(cep);

  if (cleanCep.length !== 8) {
    setMessage(addressResult, "Digite um CEP com 8 numeros.", true);
    return;
  }

  setMessage(addressResult, "Consultando endereco...");

  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();

    if (data.erro) {
      setMessage(addressResult, "CEP nao encontrado. Verifique o numero informado.", true);
      return;
    }

    const address = `${data.logradouro || "Logradouro nao informado"}, ${data.bairro || "bairro nao informado"} - ${data.localidade}/${data.uf}`;
    setMessage(addressResult, address);
  } catch {
    setMessage(addressResult, "Nao foi possivel consultar o CEP agora.", true);
  }
}

if (ctaButton) {
  ctaButton.addEventListener("click", () => {
    document.querySelector("#inscricao").scrollIntoView({ behavior: "smooth" });
    setMessage(ctaMessage, "Obrigado pelo interesse! Preencha o formulario para receber informacoes.");
  });
}

if (menuToggle && mainNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = mainNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mainNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mainNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if (cepInput) {
  cepInput.addEventListener("input", (event) => {
    event.target.value = formatCep(event.target.value);
  });

  cepInput.addEventListener("blur", (event) => {
    if (event.target.value.trim()) {
      searchCep(event.target.value);
    }
  });
}

if (contactForm) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = document.querySelector("#name").value.trim();
    const email = document.querySelector("#email").value.trim();
    const message = document.querySelector("#message").value.trim();

    if (!name || !email || !message) {
      setMessage(formMessage, "Preencha nome, e-mail e mensagem antes de enviar.", true);
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setMessage(formMessage, "Informe um e-mail valido para contato.", true);
      return;
    }

    setMessage(formMessage, `Obrigado, ${name}! Sua mensagem foi registrada com sucesso.`);
    contactForm.reset();
    setMessage(addressResult, "Informe um CEP para consultar a API ViaCEP.");
  });
}
